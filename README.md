# baytownfireandwaterrestoration.com

Static Astro site for **Baytown Fire and Water Restoration**, a phone referral line that connects Baytown, TX homeowners with independent restoration companies.

## Commands

| Command | What it does |
|---|---|
| `npm install` | Install dependencies |
| `npm run dev` | Local dev server |
| `npm run build` | Build to `dist/` |
| `npm run check` | Run pre-launch checks on `dist/` (links, schema, phones, duplicates, meta) |
| `npm run check -- --external` | Same, plus request every external link |
| `npm run placeholders` | List placeholders still to fill |

## Before launch: fill the placeholders

Everything lives in **`src/config/site.json`**. Replace each `{{...}}` value, then rebuild.

| Key | Meaning |
|---|---|
| `phoneWater` / `phoneWaterTel` | Water damage call tracking number, display format and `+1XXXXXXXXXX` |
| `phoneFire` / `phoneFireTel` | Fire damage number (same as water if there is only one) |
| `phoneHours` | Hours the line is really answered. Only write "24/7" if confirmed |
| `email` | Contact email on the domain. Also the recipient of the contact form |
| `ownerName` | Person who runs the site (About page, "Reviewed by") |
| `social` | `[]` or a list like `[{ "name": "Facebook", "url": "https://..." }]`, real profiles only |
| `lastUpdated` | Date shown on service pages and in the sitemap |

Phone numbers are never written in pages. They come from `site.json` through `src/lib/site.ts` and `src/components/CallButton.astro`. Each layout takes an `offer` prop (`water` default, `fire` on the fire page).

## Staging mode (noindex)

`"noindex": true` in `src/config/site.json` adds a `noindex, nofollow` tag to every page and removes the sitemap line from `robots.txt`. Set it to `false` when the placeholders are filled and the site is ready to be indexed, then submit the sitemap in Google Search Console.

## Deploy to Hostinger through Git

Hostinger shared hosting cannot run the Astro build, so GitHub builds it:

1. Every push to `main` or `claude/gallant-carson-sg8zly` runs `.github/workflows/deploy-hostinger.yml`.
2. The workflow builds the site, runs the checks, and commits the contents of `dist/` to the **`hostinger`** branch.
3. Hostinger's Git feature deploys the `hostinger` branch into `public_html`.

One-time setup in Hostinger hPanel (Websites > Manage > Advanced > Git):

1. Copy the SSH key hPanel shows and add it in GitHub: repo Settings > Deploy keys > Add deploy key (read-only is enough). Needed because the repository is private.
2. Create the repository in hPanel: URL `git@github.com:abdullahsaleemseo/baytownfireandwaterrestoration.git`, branch `hostinger`, install path left empty (`public_html`, which must be empty first).
3. Turn on Auto Deployment: copy the webhook URL from hPanel and add it in GitHub: repo Settings > Webhooks > Add webhook, content type `application/json`, "Just the push event".

After that, any change pushed to the working branch goes live within a couple of minutes.

Manual alternative: run `npm run build` and upload the contents of `dist/` (including the hidden `.htaccess`) to `public_html`.

Notes:
- `.htaccess` forces https and non-www, and serves `404.html`.
- The contact form posts to `/api/contact.php`, which uses PHP `mail()`. Create the mailbox in `email` and a `no-reply@` address on the domain in hPanel so mail is delivered.

## Analytics

Phone clicks fire a `phone_click` event (`phone_offer`, `call_location`, `page_path`) to `gtag` if present, push to `dataLayer`, and dispatch a DOM event. Add the GA4 snippet to `src/layouts/Base.astro` when ready.

## Content rules (keep these when adding pages)

- No invented addresses, reviews, ratings, licenses, certifications, response times, prices or statistics.
- Cite official sources for safety, insurance and licensing facts.
- No em dashes. One H1 per page. Unique title and description.
- No blog link until at least 3 real posts exist. No reviews section until real reviews exist (`src/components/Reviews.astro` is ready but unused).
- Image sources and licenses are listed in `CREDITS.md` and shown on `/disclaimer/`.
