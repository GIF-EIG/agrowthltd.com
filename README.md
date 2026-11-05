# AGrowth website — GitHub + Cloudflare Workers

## Repository structure

- `public/` — HTML, CSS, JS and optimized images
- `src/index.js` — Cloudflare Worker API for the enquiry form
- `wrangler.jsonc` — Worker/static assets/email binding configuration
- `package.json` — Wrangler dependency and deploy scripts

## Deployment

Cloudflare build settings should remain:

- Production branch: `main`
- Root directory: `/`
- Build command: none
- Deploy command: `npx wrangler deploy`

Push/commit changes to `main`; Cloudflare will deploy automatically.

## One-time setup for the enquiry form

The form posts to `/api/enquiry` and the Worker sends the enquiry to `agrowth.adm@gmail.com`.

In Cloudflare, enable **Email Service → Send emails**, onboard `agrowth.rw` as a sending domain, and verify the required DNS records. The Worker sends from `website@agrowth.rw`. Also ensure `agrowth.adm@gmail.com` is an allowed/verified destination for the Email binding. Once Email Service is active, no API key is required in the front-end.

If Email Service is not configured, the website remains available but the form will display an error instead of pretending the enquiry was sent.
