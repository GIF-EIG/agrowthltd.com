# AGrowth website

Production static website for AGrowth Ltd, deployed with Cloudflare Workers Static Assets.

## Deployment
Cloudflare is connected to the GitHub repository. Push/commit updates to the connected `main` branch; Cloudflare then runs `npx wrangler deploy`.

## Repository root
Keep these items at the repository root:
- `public/`
- `wrangler.jsonc`
- `package.json`
- `README.md`

The website itself is inside `public/`.
