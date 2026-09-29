# Atlas app

The Atlas web app for separated Australian parents (app.get-atlas.com.au). Plain HTML, CSS and JavaScript: no build step, no server code, no analytics.

Everything a person enters stays in their own browser (localStorage). Nothing is sent anywhere.

## Deploy

- **Vercel:** import this repo, framework preset "Other", no build command, output directory `.` (the repo root). `vercel.json` adds the headers.
- **Netlify:** publish directory `.`, no build command. `_headers` adds the same headers.

Every page is `noindex` (meta tag, `X-Robots-Tag` header and `robots.txt`). The marketing site and blog live on Ghost at www.get-atlas.com.au and are unaffected.

## Access

`auth.js` shows a password screen before any page. It is a soft gate for the beta, not security: the password is in the source.

## Structure

- `index.html` Today · `money.html` · `week.html` · `records.html` · `admin.html` · `scripts.html` · `goals.html`
- `*-print.html` printable versions
- `budget.html`, `kids-week.html`, `companion.html`, `guides.html`, `guides-print.html` redirect old links to the new pages
- `assets/app/` shared JavaScript and styles · `assets/fonts/` self-hosted fonts · `assets/*.pdf` companion pack · `images/` Reading tab images

Source and working notes live in the Atlas Reimagined folder, not in this repo.
