# Atlas app

The Atlas web app for separated Australian parents (app.get-atlas.com.au). Plain HTML, CSS and JavaScript: no build step, no analytics. The only server code is the paywall (`middleware.js`, `api/`).

Everything a person enters stays in their own browser (localStorage). Nothing is sent anywhere.

## Deploy

- **Vercel:** import this repo, framework preset "Other", no build command, output directory `.` (the repo root). `vercel.json` adds the headers.
- **Netlify:** publish directory `.`, no build command. `_headers` adds the same headers.

Every page is `noindex` (meta tag, `X-Robots-Tag` header and `robots.txt`). The marketing site and blog live on Ghost at www.get-atlas.com.au and are unaffected.

## Access (paywall)

Paid access, no accounts and no database. Plan: `05 Strategy & plans/atlas-paywall-build-plan-v2.md`.

- `middleware.js` runs before every request. No valid `atlas_access` cookie means a redirect to `/activate.html`. Public: activate, terms, how-it-works, for-professionals, the User guide PDF (short link `/user-guide`) and the shell CSS/JS they need.
- `/buy` (in `vercel.json`) redirects to the Stripe Payment Link. Change the link there only.
- `api/activate.js` checks a Stripe Checkout Session is paid in AUD, sets a signed 12-month cookie and shows the buyer their Atlas key. POSTing a key re-issues the cookie.
- `api/signout.js` clears the cookie (Lock app).
- `lib/tokens.js` signs keys and cookies with `SESSION_SECRET` (HMAC). Changing the secret invalidates every key ever issued.
- `scripts/make-key.mjs` mints keys locally: `SESSION_SECRET=… node scripts/make-key.mjs [cs_live_… | --count 10]`.
- Env vars (Vercel): `SESSION_SECRET`, `STRIPE_SECRET_KEY`.
- `/demo/` is public: a generated, fictional-data copy of five app pages (Today, Week, Money, Records, 3 sample Scripts). It is built by `../demo-build` (`node scripts/build-demo.mjs`, then copy `out/demo` over `demo/`). Never edit `demo/` by hand; rebuild after changing any app page. `/buy/demo` and `/buy` redirect to the Stripe Payment Link with `client_reference_id=demo` / `site` so Stripe shows which door a sale came through (no analytics).

## Structure

- `index.html` Today · `money.html` · `week.html` · `records.html` · `admin.html` · `scripts.html` · `goals.html`
- `*-print.html` printable versions
- `budget.html`, `kids-week.html`, `companion.html`, `guides.html`, `guides-print.html` redirect old links to the new pages
- `assets/app/` shared JavaScript and styles · `assets/fonts/` self-hosted fonts · `assets/*.pdf` companion pack · `images/` Reading tab images

Source and working notes live in the Atlas Reimagined folder, not in this repo.
