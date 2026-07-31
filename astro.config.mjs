import { defineConfig } from 'astro/config';
import { PUBLIC_ORIGIN } from './config/public-origin.mjs';

export default defineConfig({
  site: PUBLIC_ORIGIN,
  output: 'static'
});
