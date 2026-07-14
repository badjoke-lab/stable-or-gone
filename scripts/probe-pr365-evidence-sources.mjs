import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const queue=JSON.parse(fs.readFileSync(path.join(root,'docs/migration/evidence-archive-maintenance-queue-pr365.json'),'utf8'));
const output=path.join(root,'docs/migration/pr365-evidence-source-probe.json');
const cutoff='20260714235959';
const sleep=(ms)=>new Promise((resolve)=>setTimeout(resolve,ms));

async function fetchTimed(url,timeoutMs=45000){
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),timeoutMs);
  try{return await fetch(url,{signal:controller.signal,redirect:'follow',headers:{'user-agent':'Stable-or-Gone-Evidence-Maintenance/1.1'}});}
  finally{clearTimeout(timer);}
}

async function current(url){
  try{const response=await fetchTimed(url);return{ok:response.ok,status:response.status,final_url:response.url,content_type:response.headers.get('content-type')};}
  catch(error){return{ok:false,status:null,final_url:null,error:error.name==='AbortError'?'timeout':error.message};}
}

async function cdxOnce(url){
  const endpoint=new URL('https://web.archive.org/cdx/search/cdx');
  endpoint.searchParams.set('url',url);
  endpoint.searchParams.set('output','json');
  endpoint.searchParams.append('filter','statuscode:200');
  endpoint.searchParams.append('filter','mimetype:text/html');
  endpoint.searchParams.set('fl','timestamp,original,statuscode,mimetype,digest');
  endpoint.searchParams.set('collapse','digest');
  endpoint.searchParams.set('to',cutoff);
  const response=await fetchTimed(endpoint.toString(),60000);
  const body=await response.text();
  if(!response.ok)throw new Error(`HTTP ${response.status}: ${body.slice(0,120)}`);
  const parsed=JSON.parse(body);
  const headers=parsed[0]??[];
  return parsed.slice(1).map((values)=>Object.fromEntries(headers.map((header,index)=>[header,values[index]]))).sort((a,b)=>a.timestamp.localeCompare(b.timestamp));
}

async function cdx(url){
  let error=null;
  for(let attempt=1;attempt<=3;attempt++){
    try{return{ok:true,attempts:attempt,captures:await cdxOnce(url)}}
    catch(reason){error=reason.name==='AbortError'?'timeout':reason.message;if(attempt<3)await sleep(attempt*3000);}
  }
  return{ok:false,attempts:3,error,captures:[]};
}

const results=[];
for(const candidate of queue.selected_candidates){
  const live=await current(candidate.url);
  const original=await cdx(candidate.url);
  const finalUrl=live.final_url&&live.final_url!==candidate.url?live.final_url:null;
  const redirected=finalUrl?await cdx(finalUrl):null;
  const all=[...(original.captures??[]),...(redirected?.captures??[])];
  const unique=[...new Map(all.map((row)=>[`${row.timestamp}|${row.original}|${row.digest}`,row])).values()].sort((a,b)=>a.timestamp.localeCompare(b.timestamp));
  results.push({
    evidence_id:candidate.evidence_id,source_file:candidate.source_file,source_url:candidate.url,published_at:candidate.published_at,current:live,
    cdx:{ok:original.ok||Boolean(redirected?.ok),original_attempts:original.attempts,redirect_attempts:redirected?.attempts??0,original_error:original.error??null,redirect_error:redirected?.error??null,redirect_query_url:finalUrl,capture_count:unique.length,first_capture:unique[0]??null,latest_capture:unique.at(-1)??null,captures:unique}
  });
  console.log(`${candidate.evidence_id}: current=${live.status??live.error}; captures=${unique.length}`);
}

fs.writeFileSync(output,`${JSON.stringify({schema_version:'1.1',report_id:'sog_pr365_evidence_source_probe_2026_07_14',status:'internal_diagnostic_not_canonical_evidence',public_output:false,review_pr:365,cutoff_timestamp:cutoff,queue_id:queue.queue_id,result_count:results.length,results},null,2)}\n`);
