# TEMPORARY SOG UI REPAIR MEMO

> Status: ACTIVE / UI repair incomplete  
> Repository: `badjoke-lab/stable-or-gone`  
> Purpose: Keep the confirmed UI problems and repair requirements visible during implementation.  
> Removal condition: Owner approval after all listed work and screenshot review.  

## Operating rules

* This file is the temporary source of truth for the current UI repair.
* Do not delete, shorten, silently rewrite, or mark an item complete without evidence.
* Read this file before starting each repair batch and update it after each batch.
* A completed item must record the affected routes/templates, commit SHA, PC screenshots, mobile screenshots, and remaining problems.
* Automated audit success is not owner acceptance and is not sufficient by itself.
* Partial work must be reported as partial work. Do not use `complete`, `finished`, or equivalent while any listed item remains.
* Support work is one section of the overall repair, not a replacement for the other sections.
* No unrequested payment processor, wallet, analytics service, or external dependency may be added.
* Any newly discovered UI problem must be appended to this memo instead of being omitted from the final scope.

## Progress index

- [ ] 1. Completion-report and audit-state corrections
- [ ] 2. Global layout, navigation, footer, typography
- [ ] 3. Home
- [ ] 4. Stablecoin indexes
- [ ] 5. Organization indexes
- [ ] 6. Event indexes
- [ ] 7. Stablecoin detail template and exceptions
- [ ] 8. Issuer detail template and exceptions
- [ ] 9. Event detail template and exceptions
- [ ] 10. Stats
- [ ] 11. Access & Regulation
- [ ] 12. Compare
- [ ] 13. Timeline
- [ ] 14. Updates
- [ ] 15. Guides and long-form pages
- [ ] 16. Support discovery, explanation, wallet-page usability
- [ ] 17. Full-page screenshot workflow and human review
- [ ] Final production verification and owner approval

---

この文書は、SOG UI修正で確認済みの問題、修正方針、未完了条件を保持する一時作業メモです。
現時点で「全ページを1枚ずつ確認した」とは言えません。以下は、最新の全ページ成果物、監査JSON、共通テンプレート、実際のPC・モバイル画像からすでに確定している問題点の一覧です。個別レコード固有の追加崩れは、922枚を1枚ずつ目視する工程でさらに出る可能性があります。

## 1. まず「全部終わった」という報告自体が誤り

### 1-1. 最新の全ページスクショActionは失敗している

461ルートについてPC 461枚、モバイル461枚の撮影には成功しましたが、最終判定は**failure**です。`/stats/`のモバイルで7pxの横方向オーバーフローが残っています。

**どうすべきか**

* 失敗Runを完了扱いしない
* `/stats/`を直した後、同じ全461ルートを再撮影
* Action全体がsuccessになるまでマージ・完了報告を禁止する

### 1-2. 監査自身が`manual_review_required: true`

自動監査は「人間による実画像確認が必要」と明示しています。それを無視して完了扱いしました。

**どうすべきか**

* PC・モバイルの実画像レビューを必須工程にする
* テンプレート別の承認表を残す
* 「撮影成功」と「見た目合格」を分離する

既存のUI監査Issueにも「自動スクリーンショットをowner acceptanceとして扱うな」と明記されていました。

### 1-3. 可読性監査は大量の問題を検出しているのに失敗扱いしていない

最新監査JSONの実測値です。

**モバイル**

* 小さすぎる通常本文：11
* 小さすぎるコンパクト文字：3,409
* 小さすぎるリンク・ボタン文字：16,303
* 小さすぎるメタデータ：30,954
* 小さすぎるタップ対象：13,867
* 内部リンクか通常文字か判別しにくい箇所：4,575
* 想定外の公開フォント：149
* 461ルートすべてに何らかのfindingsあり

**PC**

* 小さすぎる通常本文：3,356
* 小さすぎるコンパクト文字：16,132
* 小さすぎるリンク・ボタン文字：20,319
* 小さすぎるメタデータ：24,691
* 判別しにくい内部リンク：4,383
* 想定外の公開フォント：256

それでも`failed_count: 0`です。つまり現在の監査は、**問題を数えているだけで合否に反映していません**。

**どうすべきか**

* 本文、メタデータ、リンク、タップ領域にブロッキング閾値を設定
* モバイル本文16px前後、補助文14px以上、メタデータ12〜13px以上を基準化
* タップ対象は原則44px以上
* 重大findingsが1件でもあればActionを失敗させる
* 「検出したが無視して成功」を廃止する

### 1-4. Production smokeはUI監査ではない

成功した本番Workflowが確認したのは、デプロイSHA、データ件数、ルート、JSON-LD、ガイド公開などです。**見た目の品質や寄付導線は合格条件に入っていません。**

**どうすべきか**

* Production deployment success
* Functional success
* Visual acceptance

この3つを別判定にする。私は1つ目と2つ目の成功を、3つ目まで成功したように報告していました。

---

# 2. 全ページ共通の問題

## 2-1. モバイルのグローバルナビが途中で切れている

393px幅では、上部ナビが`Organizations`の途中で切れています。Events、Stats、Guides、About、Methodology、Supportなどは画面外です。横スクロール可能だとしても、その表示や誘導がありません。

**どうすべきか**

* モバイルで16項目を横一列に並べない
* 主要項目を4〜6件に限定
* 残りは明示的な`More`メニューか2段目へ分離
* 現在位置とスクロール可能性を見えるようにする
* `Support`はメニューの奥ではなく独立CTAにする

## 2-2. PCナビも項目が多すぎる

PCではSupportまで表示されていますが、16項目近いリンクが横一列に並び、どれが主要機能なのか分かりません。Supportは右端に埋もれています。

**どうすべきか**

ナビを次のように再編します。

* Registry：Stablecoins / Organizations / Events
* Research：Compare / Access / Timeline / Stats
* Learn：Guides / Glossary / Models
* Project：About / Methodology / Updates
* 独立CTA：Support
* 独立utility：Submit correction

## 2-3. Support導線が共通フッターから消えている

設定ファイルではSupportをutility、about navigation、footer project groupに含めています。

しかし実際の`BaseLayout`はフッターリンクを別途ハードコードし、Supportを入れていません。

**どうすべきか**

* ハードコードされた`footerLinks`を廃止
* `footerNavigationGroups`をそのまま描画
* 全ページのフッターにSupportを表示
* SupportをCorrectionsやGitHubと同格以下に置かず、視覚的に強調する

## 2-4. 上部の主要アクションがCorrectionだけ

全ページのマストヘッド右上には`Submit correction`だけがあります。

**どうすべきか**

右上を次の2アクションにします。

* `Support this archive`：主要CTA
* `Submit correction`：補助リンク

現在は修正依頼だけを全ページで強調し、運営支援は隠しています。

## 2-5. モバイルのセクション見出しが3列のまま

Stablecoin、Issuer、Eventページでは、

* 左の分類ラベル
* 中央の大見出し
* 右の説明文

を狭い画面でも横並びにしています。そのため本文幅が極端に狭くなり、縦に1〜3語ずつ折り返されます。

例：

* `Reviewed / Identity and current state / This summary...`
* `Connected assets / Relationships / Current, ended...`
* `Sources / Evidence / Sources used...`

**どうすべきか**

モバイルでは必ず縦積みにします。

1. 小ラベル
2. H2
3. 説明文

PCだけ3列を許可します。

## 2-6. ページ内ナビも途中で切れている

Stablecoin dossierの`Assessment / Organizations / Mechanism / Reserves...`、IssuerやEventのページ内ナビも横一列で、後半が切れています。

**どうすべきか**

* モバイルは2列グリッドまたは選択式目次
* 横スクロールを使う場合は右端フェードや矢印を表示
* 現在セクションを追従表示
* 長い詳細ページではsticky目次を用意

## 2-7. フッターが小さく密集している

モバイルフッターは小さなリンクが2列程度に密集し、タップしにくく、Supportもありません。

**どうすべきか**

* Registry / Learn / Project / Dataの4グループに分割
* 1リンクごとの高さを確保
* Supportを最上段または独立ブロックへ
* Version JSONなど機械向けリンクは下層に分離

## 2-8. モノスペースの使い過ぎ

監査方針ではモノスペースはIDや限定的メタデータ向けですが、ステータス、番号、ラベルなどに広く残っています。

**どうすべきか**

* ID、アドレス、JSON、日付コードだけモノスペース
* ステータスや一般ラベルは本文用sans
* 監査で`unexpected_public_font`を失敗条件にする

---

# 3. トップページ

トップは他ページよりは整っていますが、完了とは言えません。

## 3-1. モバイルで約35,000pxの長さ

トップに116件の全レジストリを載せているため、非常に長いページです。トップページとStablecoin registerが機能的に重複しています。

**どうすべきか**

トップには以下だけ載せます。

* 概要
* 件数
* 主要な探索入口
* 最近の重要変更
* 代表レコードまたは20件程度
* 全件はStablecoin registerへ誘導

## 3-2. フィルターと全件テーブルの文字・操作対象が小さい

トップだけでモバイルの小さすぎる操作文字が250件検出されています。

**どうすべきか**

* 検索欄、select、Clear、Copy linkを44px以上
* フィルターをモバイル用drawerへ
* 表をモバイル専用リストにする
* 主要情報だけ先に表示し、追加列は詳細ページへ

## 3-3. 支援CTAがない

最も訪問されるトップページに、運営支援への明確な導線がありません。

**どうすべきか**

最低2箇所に設置します。

* トップ概要・件数の直後
* レジストリの後、フッター直前

文言は「Donate」の一語ではなく、何を維持しているか説明します。

---

# 4. Stablecoin一覧ページ

## 4-1. `/stablecoins/`モバイルが約60,858px

今回の全スクショで最長です。検索可能な全116件を1ページで表示しています。

**どうすべきか**

* 初期表示20件
* ページネーションまたは明示的なLoad more
* URLでフィルター状態を保持
* 検索結果件数を上に固定
* モバイルで全116件を一括描画しない

## 4-2. ページネーションが連結している

`Previous123456Next`のように空白・ボタン境界がありません。

**どうすべきか**

* 各ページ番号を独立したリンクボタンにする
* 現在ページを明確にする
* Previous / Nextに十分な余白
* モバイルでは`Previous  2 / 6  Next`へ簡略化

## 4-3. PCのページ別一覧が5列で細かすぎる

カードが5列に詰まり、各レコードの説明が小さくなっています。

**どうすべきか**

* PCは3〜4列
* 重要項目をName / Symbol / Lifecycle / Issuanceに限定
* 長い情報は詳細ページへ
* ステータスの視覚差を明確にする

---

# 5. Organization一覧ページ

## 5-1. Stablecoin一覧と同じ過密カード問題

PCでは5列、モバイルでは縦長カードが連続し、組織種別・法域・関係数・source数が同じ重さで並びます。

**どうすべきか**

* 組織名と接続資産を主情報にする
* 法域・種別・source数を副情報にする
* PC3〜4列、モバイル1列
* Issuer / protocol / regulator / custodianなどを視覚的に区別

## 5-2. ページネーションが同様に連結

`Previous123456Next`問題がOrganization、Eventにも共通しています。

---

# 6. Event一覧ページ

## 6-1. PCカードが小さすぎる

191件を20件単位で並べていますが、PCでは横に多数のカードが並び、日付・タイトル・impact・lifecycle effect・recoveryが細かすぎます。

**どうすべきか**

* PCは表または3列カード
* 日付、対象、事件名、結果を主情報にする
* Impact、Recoveryなどは2段目
* 重大度による視覚差を付ける

## 6-2. モバイルのカード本文が長い

1カード内に説明を詰め込みすぎています。

**どうすべきか**

* 一覧は2〜3行の要約
* 詳細はEventページへ
* 重要eventだけ結果を強調
* 長い分類文は非表示または展開式

---

# 7. Stablecoin詳細116ページ

## 7-1. モバイルのセクション見出しが読みにくい

共通テンプレートのため116ページすべてに影響します。

**どうすべきか**

前述の通り、モバイルでは見出しを縦積みにします。

## 7-2. 詳細ページが長すぎる

USDT、USDC、sUSDなど情報量の多いページは19,000〜22,000px前後です。

**どうすべきか**

* 上部にCurrent state summary
* Lifecycle
* Reserves
* Organizations
* Evidence

の主要5セクションだけを優先表示し、技術メタデータや全deploymentはdetailsへ格納します。

## 7-3. メタデータの文字が小さすぎる

Stablecoin詳細では、多いページで200件以上の小さすぎるメタデータが検出されています。

**どうすべきか**

* IDラベルと値のサイズを上げる
* 1行に詰め込みすぎない
* モバイルでは2列ledgerを1列へ
* 重要度の低いcanonical ID等は折りたたむ

## 7-4. 情報の優先順位が弱い

Lifecycle、Issuance、Reference、Backing、Redemption、Evidenceがほぼ同じ線と文字で表現されています。

**どうすべきか**

* 現在状態を最上位
* 重大事件を次
* Redemption / reserve accessを次
* 技術メタデータを下位
* status色は装飾ではなく意味を持つ範囲で使用

## 7-5. PCも横に広すぎて読みづらい

テーブルが画面幅いっぱいに広がり、セル内文字が小さい状態です。

**どうすべきか**

* 本文最大幅を設定
* 重要な表は2〜3列に制限
* 巨大表は横幅ではなくセクション分割
* source、deployment、reserveを別ブロック化

---

# 8. Issuer詳細107ページ

## 8-1. 値同士が連結している

実スクショでは次のような表示があります。

* `Hong Kong / British Virgin IslandsMultiple jurisdictions`
* `1 current1 historical`
* `StablecoinTether USDtOrganizationTether`

**どうすべきか**

* 値を別ブロックまたはリストにする
* 数値とラベルの間隔を保証
* 複数法域をchipではなく改行リストにする
* 関係レコードはカードか表へ

## 8-2. Relationshipsのモバイルレイアウトが崩れている

左ラベル、中央タイトル、右説明の3列で、説明が極端な細長い縦文になります。

**どうすべきか**

縦積み後、各relationshipを次の形式にします。

* Asset
* Role
* Status
* Start / End
* Evidence count

## 8-3. Evidenceの説明と実レコードが同じ密度

見出し・説明・source情報の境界が弱いです。

**どうすべきか**

* Evidence summary
* Source cards
* Archive / reliability metadata

を分ける。

---

# 9. Event詳細191ページ

## 9-1. Affected recordsの文字が連結している

例：

`StablecoinTether USDtOrganizationTether`

**どうすべきか**

対象種別、名称、リンクを別行にします。

## 9-2. Event factsのグリッドが不均衡

Date、Affected records、Evidenceが半端な2列グリッドになり、空白セルや不自然な幅が生じています。

**どうすべきか**

モバイルでは1列、PCでは3列の均等カードにする。

## 9-3. `Record details`のsummaryと説明が連結

`Record detailsClassification, review...`のように余白がなく、展開可能な要素として分かりにくいです。

**どうすべきか**

* Summaryを独立行
* 開閉アイコン
* 説明文を次行
* タップ領域44px以上

## 9-4. ページ末尾のリンクが連結している

`Submit a correctionMethodologyEvent registerData manifest`

**どうすべきか**

リンクをボタンまたは縦リストにし、間隔を確保する。

---

# 10. Statsページ

## 10-1. モバイル横オーバーフロー7px

最新Actionを失敗させた確認済みの問題です。

**どうすべきか**

* 原因となるgrid/table幅を393px以内へ
* `min-width`、固定列幅、長いラベルを確認
* `overflow-x: hidden`で隠すのではなく中身を再配置する

## 10-2. 最も可読性の悪いページの一つ

モバイルで、

* 小さすぎる通常本文8
* 小さすぎるcompact 250
* 小さすぎるmetadata 250

が検出されています。

**どうすべきか**

* 数字を小さい列に詰めない
* 主要KPIを2列カード
* 分類別件数は横棒または読みやすい表
* 詳細内訳は折りたたみ
* モバイル専用レイアウトを作る

---

# 11. Access & Regulationページ

## 11-1. 異常に長い

* モバイル：約46,628px
* PC：約31,531px

**どうすべきか**

* 法域または資産で絞り込み
* 初期表示件数を制限
* jurisdictionごとの展開式
* Legal / Regulatory / Accessをタブまたは明確なセクションに分離

## 11-2. PCでも通常本文250件が小さすぎる

このページはPCでも最悪クラスです。

**どうすべきか**

* 1画面に載せるfacetを減らす
* 説明文を14〜16pxへ
* 表を横に詰めず、record cardまたは詳細drawerへ

---

# 12. Compareページ

## 12-1. 選択項目が多く、初期画面が複雑

4つのasset selectと多数のfacet設定が一度に表示されています。

**どうすべきか**

* 初期は2資産
* `Add another asset`で追加
* facet設定はAdvancedへ
* モバイルは1資産ずつカード表示
* 比較結果の重要差分を最初に表示

## 12-2. モバイルのselectとラベルが小さい

**どうすべきか**

select高さ44px以上、ラベル14px以上、各入力間に十分な余白を取る。

---

# 13. Timelineページ

## 13-1. モバイルメタデータ250件が小さすぎる

日付、source family、分類などが小さな文字で大量に続きます。

**どうすべきか**

* 年・月でグルーピング
* Event名と対象を主表示
* source metadataは展開式
* lifecycle effectを視覚的に区別

## 13-2. 長い単調な縦列

各eventの見た目がほぼ同じで、重大事件を探しにくいです。

**どうすべきか**

重大度、depeg、termination、recovery、regulatoryなどの種類を明確に示す。

---

# 14. Updatesページ

## 14-1. リンクと本文の判別が弱い

監査で曖昧な内部リンクが55件検出されています。

**どうすべきか**

* タイトルリンクを明確に着色・下線
* 日付、変更種別、対象を固定位置へ
* JSONパスなどの技術情報は別ブロックへ

## 14-2. フィードとしての時系列階層が弱い

**どうすべきか**

Publication dateを主軸に、Change type、Affected records、Summaryを整列させる。

---

# 15. Guidesと長文ページ

## 15-1. モバイル表が小さく密集

特にEU、MiCA、UK、Open USDガイドでcompact text findingsが多く出ています。

**どうすべきか**

* モバイルで表をカードへ変換
* 横スクロール表には固定先頭列と説明を付ける
* 重要な結論を表より先に出す

## 15-2. 記事末尾にSupportがない

Guide footerはAll guides、Glossary、Methodology、Correctionだけです。

**どうすべきか**

記事を読み終えた場所に、

* `Support independent archive maintenance`
* `Submit a correction`

を並べます。

## 15-3. About・Methodology末尾にもSupportがない

長文ページのfooterもGlossary、Models、Updates、Correctionsだけです。

**どうすべきか**

AboutとMaintenanceでは、支援用途を説明したCTAを目立たせます。

---

# 16. Supportページと寄付導線

Supportページにウォレット一覧が存在すること自体は問題ではありません。現在のBTC、ETH、USDT、USDC、SOL、BNB、DOGE、AVAX、XRPのウォレット一覧、対応ネットワーク、アドレス、Copy機能は維持します。

この修正で解決すべき問題は、決済手段の置き換えではなく、Supportの存在、支援理由、到達導線が利用者にほとんど見えないことです。

## 16-1. モバイルではSupportが実質見つからない

SupportはPCナビの最右端にありますが、モバイルではそこまで表示されません。フッターにもなく、トップにも支援CTAがありません。

**現状では、SupportページのURLを知っている人以外はほぼ到達できません。**

**どうすべきか**

* モバイルで横スクロールしなくてもSupport導線が見える構造にする
* 通常ナビの末尾へ置くだけで完了扱いしない
* PCとモバイルの両方で、Supportが画面内から認識できることを実画像で確認する
* Supportリンクのリンク先が`/support/`であることを確認する

## 16-2. ウォレット一覧は維持する

Stripe、カード決済、外部決済サービスは追加しません。所有者が明示的に決定していない支払い手段を勝手に追加、提案、前提化しません。

**維持するもの**

* BTC
* ETH
* USDT
* USDC
* SOL
* BNB
* DOGE
* AVAX
* XRP
* 各資産の現在のネットワーク表示
* 各ウォレットアドレス
* Copy address機能
* 誤送金防止の注意文
* 編集方針に支援が影響しないことの説明

**禁止事項**

* ウォレット一覧を理由なく隠す
* 資産選択式へ勝手に変更する
* 表示順を勝手に変更する
* Stripeやカード決済を追加する
* 暗号資産支援をSecondary扱いにする
* 所有者の指示なしに新しい決済事業者やウォレットを追加する

## 16-3. Supportリンクを置くだけでは不足

普通のテキストリンクをナビやフッターに1本追加しても、利用者が見つけなければ支援にはつながりません。Supportの存在と、何を維持するための支援かを、その場で理解できる必要があります。

**どうすべきか**

* `Support`だけでなく、独立運営、ソース確認、リンク維持、レコード更新に使われることを短く説明する
* 通常リンク群へ埋没させず、周囲と識別できる見せ方にする
* 過剰な広告表示、モーダル、画面を妨げる固定バナーにはしない
* サイトのレジストリUIと同じ視覚言語を維持する
* 支援文言は誇張、虚偽、強制、罪悪感を煽る表現にしない

## 16-4. CTA配置が不足している

最低でも次の位置を検討・実装対象とします。配置ごとにPC・モバイル実画像を確認します。

1. 全ページのヘッダーまたは常に発見できるグローバル領域
2. 全ページのフッター
3. トップの概要・件数付近
4. トップの主要コンテンツ終了後
5. Stablecoin詳細の主要情報またはEvidence終了後
6. Issuer詳細の主要情報またはEvidence終了後
7. Event詳細のEvidence終了後
8. Guide記事の末尾
9. About
10. Maintenance

同じ文言を無差別に繰り返すのではなく、各ページで価値を得た直後に自然に見える位置へ置きます。

## 16-5. CorrectionとSupportの優先順位が逆

現在はCorrectionが全ページ右上で目立ち、Supportは見えないか画面外です。

**どうすべきか**

* Supportを認識可能な主要アクションとして扱う
* Correctionは引き続き全ページから利用できるようにする
* Supportを強調するためにCorrectionを消さない
* 両者の用途が混同されないラベルと配置にする

## 16-6. Supportページ自体の可読性

ウォレット一覧は維持しますが、長いアドレス、ネットワーク名、注意文、CopyボタンがPC・モバイルで崩れないことを確認する必要があります。

**どうすべきか**

* 長いBTC、EVM、Solana、XRPアドレスがカード外へはみ出さない
* アドレスを省略表示する場合も、コピーされる値は完全なアドレスを維持する
* Copyボタンを十分なタップ領域にする
* ネットワーク名と資産名を混同させない
* XRPのDestination tag / memo注意文を保持する
* 9件すべてをPC・モバイルで確認する

## 16-7. Support導線の確認条件

Support周りは次をすべて確認するまで完了扱いしません。

1. PCでSupportを見つけられる
2. モバイルで横スクロールなしにSupport導線を認識できる
3. トップから`/support/`へ到達できる
4. Stablecoin、Issuer、Event、Guide、About、Maintenanceから到達できる
5. フッターから到達できる
6. 9ウォレットがすべて表示される
7. 各ネットワーク名とアドレスが正しい
8. Copy機能が全9件で動作する
9. 長いアドレスによる横オーバーフローがない
10. Stripe、カード決済、未承認の外部決済が追加されていない
11. Support CTAだけ直して他のUI修正を完了扱いしていない

## 16-8. Supportは全体修正の一項目

Support改善だけを終えても、SOG UI修正全体は完了ではありません。共通ナビ、フッター、一覧、詳細テンプレート、Stats、Access & Regulation、Compare、Timeline、Updates、Guides、長文ページ、全ページPC・モバイル確認が残っていれば、全体ステータスは未完了です。

---

# 17. 全ページスクショAction自体の問題

## 17-1. 画像を作るだけで、画像を承認していない

922枚を生成しても、視覚的な合否判定がありません。

## 17-2. 重大findingsが非ブロッキング

全461ルートにreadability findingがあっても成功扱いできます。

## 17-3. テンプレート別承認がない

最低限、次の9系統を別々に承認する必要があります。

* Home：1
* Stablecoin index：6
* Organization index：6
* Event index：10
* Stablecoin detail：116
* Organization detail：107
* Event detail：191
* Guide index/article：12
* Analysis / utility / project pages：13

## 17-4. 長い名称や大量データのedge case指定がない

代表ページだけではなく、次を固定監査対象にする必要があります。

* 最長名称
* 最長URL
* evidence最多
* event最多
* deployment最多
* sourceゼロ
* unknown最多
* discontinued / collapsed / migrated
* 長い法域名
* 長いウォレットアドレス

## 17-5. 「スクショAction success＝UI完了」を禁止すべき

完了条件は次のすべてです。

1. 全461ルート撮影成功
2. 自動レイアウト監査成功
3. readability findingsが許容基準内
4. PCテンプレート実画像レビュー
5. モバイルテンプレート実画像レビュー
6. 寄付導線レビュー
7. ownerによる明示的承認
8. 本番再撮影で同一結果

---

## 現在の正式な結論

* **UI改修は完了していません**
* **全ページ確認も完了していません**
* **最新の全ページスクショActionは失敗です**
* **モバイル詳細ページ、一覧、Stats、Access、ナビ、フッター、Support導線に重大な未修正があります**
* **寄付ページは存在するだけで、発見・到達・支払いの導線が成立していません**
* **現在の監査は、大量の可読性問題を検出しながら合否に反映しない欠陥があります**

修正に入る前に、この一覧を基準としてIssue化し、項目を消さずに進捗を記録する必要があります。

---

# Work log

Update this table after every implementation batch. Do not replace previous rows.

| Date / time (UTC) | Status | Sections touched | Routes/templates checked | Commit / PR | Desktop evidence | Mobile evidence | Remaining problems |
|---|---|---|---|---|---|---|---|
| 2026-07-28 | Memo created; no UI repair performed in this commit | Documentation only | None | Pending commit SHA | Not reviewed | Not reviewed | All sections above remain open |

# Completion statement restriction

Until every checkbox in the Progress index is checked and owner approval is recorded, the only valid overall status is:

**UI REPAIR INCOMPLETE**
