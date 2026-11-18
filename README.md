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
| `phoneWater` / `phoneWaterTel` | The help line, display format and `+1XXXXXXXXXX`. One number covers water, fire, mold and biohazard |
| `phoneFire` / `phoneFireTel` | Kept equal to the water number (one number site-wide) |
| `phoneHours` | Hours the line is really answered. Only write "24/7" if confirmed |
| `email` | Contact email on the domain |
| `social` | `[]` or a list like `[{ "name": "Facebook", "url": "https://..." }]`, real profiles only |
| `lastUpdated` | Date shown on service pages and in the sitemap |

Phone numbers are never written in pages. They come from `site.json` through `src/lib/site.ts` and `src/components/CallButton.astro`. Each layout takes an `offer` prop (`water` default, `fire` on the fire page).

## Indexing

The site is live and indexable: every page has `<meta name="robots" content="index, follow, max-image-preview:large">` and a self-referencing canonical, except the 404 page, which has `noindex`. Setting `"noindex": true` in `src/config/site.json` switches every page back to `noindex, nofollow` (staging only). `robots.txt` allows crawling and lists the sitemap; sitemap `lastmod` is the build date.

## Deploy on Vercel through Git

The site is hosted on Vercel, which builds it from this repository on every push.

One-time setup:

1. On vercel.com choose Add New > Project and import this GitHub repository. Vercel detects Astro; keep the defaults (build command `npm run build`, output `dist`).
2. Production Branch (Project Settings > Git) should be the branch you work on, currently `claude/gallant-carson-sg8zly`. Pushes to it go live; other branches get preview URLs.
3. Domain: Project Settings > Domains > add `baytownfireandwaterrestoration.com` and `www.baytownfireandwaterrestoration.com`, set the non-www one as primary (Vercel then redirects www to it), and enter the DNS records Vercel shows in the Hostinger DNS zone. HTTPS is issued automatically.

`vercel.json` sets trailing-slash URLs, security headers and long-lived caching for hashed assets. `404.html` is served automatically for unknown URLs.

## Contact page

The Contact page is call-first: the help line, phone hours, a short "what to have ready" list and the email address for non-urgent questions. There is no contact form.

## Analytics

Phone clicks fire a `phone_click` event (`phone_offer`, `call_location`, `page_path`) to `gtag` if present, push to `dataLayer`, and dispatch a DOM event. Add the GA4 snippet to `src/layouts/Base.astro` when ready.

## Content rules (keep these when adding pages)

- No invented addresses, reviews, ratings, licenses, certifications, prices or statistics.
- 24/7 claims are allowed for the phone line only (confirmed, `phoneHours` is "24/7"). Describe the line and getting help scheduled, for example "24/7 water damage help line" or "Call any time, day or night, to get a restoration crew scheduled".
- Response-time promises are still not allowed: no "crews on site in 60 minutes", "we arrive in 30 minutes" or "immediate dispatch".
- Referral disclosure lives in the footer (every page), the Disclaimer, How It Works and the Contact page. Body copy uses a neutral brand voice ("the restoration crew", "a licensed restoration pro"), never "our team", "our technicians" or "our crew", and never contractor claims.
- Cite official sources for safety, insurance and licensing facts.
- No em dashes. One H1 per page. Unique title and description.
- No blog link until at least 3 real posts exist. No reviews section until real reviews exist (`src/components/Reviews.astro` is ready but unused).
- Image sources and licenses are listed in `CREDITS.md` and shown on `/disclaimer/`.
