# AGrowth website

Static AGrowth website for Cloudflare Workers Static Assets.

## Deployment
Cloudflare is connected to this GitHub repository. Updating the `main` branch triggers the configured deployment. The deploy command is `npx wrangler deploy`.

## Structure
- `public/` website files
- `wrangler.jsonc` Cloudflare configuration

## Local preview
```bash
npm install
npm run dev
```
