# Cloudflare setup — 23 October 2026

Repository: https://github.com/hery4wn/furia-website (main).

Account: e49c0edfb92607ef268e0bf3ff2669c6.
D1 database `furia-website` created: `0c87fe83-bb84-435f-a454-028ab58e684c`.
Binding: `DB`; migrations: `drizzle/`.

## Build integration

Worker name: `furia-website`.
Root: `/`. Build: `npm run build`.
Deploy: `npx wrangler@4 d1 migrations apply furia-website --remote && npx wrangler@4 deploy`.
Wrangler uses `wrangler.jsonc` and the existing UI build; no static-only Pages deployment.
GitHub Builds is active on `main`; automatic deployment of commit `2674dc93ff4bc7269d0acf2ed52b48c91fd48e7f` was confirmed Ready and serving 100% of traffic.
The persistent build token `furia-website-builds` was created with the owner's explicit approval. No token value is stored in this repository.

## Private dashboard

The owner selected password login without a payment card. Set `ADMIN_PASSWORD` as an encrypted Worker secret in the Cloudflare dashboard, using a unique passphrase of 16–512 characters. Never commit it. `/admin` redirects to `/admin/login`; authenticated sessions use a signed, Secure/HttpOnly/SameSite=Strict cookie and expire after eight hours. Changing the secret invalidates all sessions. Login attempts are limited through D1. `/admin/logout` clears the browser cookie.

Password entry must be completed by the owner in Cloudflare, not pasted into chat.
The owner saved the encrypted production secret; live `/admin/login` returns 200 and unauthenticated `/api/admin/metrics` returns 403. The owner's actual password was not read or used by the assistant.

Cloudflare adapter always strips caller-supplied Sites identity headers.
Admin is denied until the password secret (or optional Cloudflare Access JWT verification) is configured.
Configure Access for `/admin*` and `/api/admin/*`, only the owner email, then set:

- `CF_ACCESS_TEAM_DOMAIN`: exact HTTPS team domain ending `.cloudflareaccess.com`.
- `CF_ACCESS_AUD`: application audience; comma-separated if two Access apps are used.

Do not protect the entire business website. Verify unauthenticated admin/API requests fail and owner login works before cutover.

## Domain cutover

Target: `furiapalopo.fit`, registration remains at Hostinger.
Hostinger nameservers were changed with explicit approval to `dion.ns.cloudflare.com` and `edna.ns.cloudflare.com`; Hostinger confirmed success.
Both `furiapalopo.fit` and `www.furiapalopo.fit` were connected to the production Worker. Cloudflare generated managed Worker DNS records, replacing the old Sites A/CNAME records. Both domains are declared in `wrangler.jsonc` for future deployments. Public DNS/HTTPS activation must be verified after propagation; a successful settings save alone does not confirm global availability.
Do not use the old Sites IP as the new Worker target.
The owner explicitly chose to start statistics from zero. No old analytics, reviews or rate-limit rows were copied to Cloudflare or committed to GitHub. The existing Sites URL remains separate.

Validation: existing Worker tests, Cloudflare signature/authorization tests, and password/session/CSRF/rate-limit tests pass locally.
