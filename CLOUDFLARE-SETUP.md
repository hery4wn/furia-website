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
Builds integration is not active until the dashboard deployment is confirmed successful.

## Private dashboard

The owner selected password login without a payment card. Set `ADMIN_PASSWORD` as an encrypted Worker secret in the Cloudflare dashboard, using a unique passphrase of 16–512 characters. Never commit it. `/admin` redirects to `/admin/login`; authenticated sessions use a signed, Secure/HttpOnly/SameSite=Strict cookie and expire after eight hours. Changing the secret invalidates all sessions. Login attempts are limited through D1. `/admin/logout` clears the browser cookie.

Password entry must be completed by the owner in Cloudflare, not pasted into chat.

Cloudflare adapter always strips caller-supplied Sites identity headers.
Admin is denied until the password secret (or optional Cloudflare Access JWT verification) is configured.
Configure Access for `/admin*` and `/api/admin/*`, only the owner email, then set:

- `CF_ACCESS_TEAM_DOMAIN`: exact HTTPS team domain ending `.cloudflareaccess.com`.
- `CF_ACCESS_AUD`: application audience; comma-separated if two Access apps are used.

Do not protect the entire business website. Verify unauthenticated admin/API requests fail and owner login works before cutover.

## Domain cutover

Target: `furiapalopo.fit`, registration remains at Hostinger.
Cloudflare domain onboarding is in progress; nameservers and Worker custom domain are not yet configured.
Use assigned Cloudflare nameservers, preserve existing email records, and connect the domain to the deployed Worker only after database/data and Access checks.
Do not use the old Sites IP as the new Worker target.
Existing Sites production remains available during setup. Production analytics/reviews must be checked and migrated privately before switching traffic; never commit visitor data to GitHub.

Validation: existing Worker tests and Cloudflare signature/authorization tests pass locally.
