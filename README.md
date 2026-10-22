# Desert Wings W.L.L. — Website

A complete, multi-page static website for Desert Wings W.L.L. (industrial & event catering, packed meals,
cafeterias, housekeeping and laundry — Al Wakra, Qatar). Pure HTML, CSS and JavaScript: no build step,
no frameworks, no dependencies except Google Fonts.

## Run it
- **Quickest:** double-click `index.html`.
- **Recommended (local server):** from this folder run `python -m http.server 8000` (or VS Code "Live Server")
  and open http://localhost:8000.
- **Publish:** upload the whole folder to any static host (Netlify, GitHub Pages, Vercel, cPanel `public_html`).

## Pages
| File | Purpose |
|---|---|
| `index.html` | Home — hero slider, services, counters, values, sectors, process, QHSE teaser, CTA |
| `about.html` | Company story, mission/vision/promise, values, capabilities |
| `services.html` | Detailed service blocks, comparison table, deep links to the quote form |
| `menu.html` | Weekly multicultural menu planner — day tabs, filters, search, CSV, print |
| `qhse.html` | Food safety, HACCP 7 principles, temperature checker, training areas |
| `quote.html` | 4-step quote wizard with a live cost estimate |
| `careers.html` | Filterable job list, application modal with CV validation |
| `contact.html` | Contact form, info cards, Google map, FAQ accordion |
| `admin.html` | Demo dashboard of all form submissions (localStorage) with CSV export |

## Edit content
Almost everything (phone, email, services, menu dishes, prices, jobs, FAQs) lives in **`js/data.js`**.
Items marked `// SAMPLE` (menus, prices, job openings, some counters) must be replaced with verified
company information before going live.

## Forms
Forms validate in the browser and save to `localStorage` so the site works with no server.
To receive submissions by email, connect a backend or a form service — see the implementation guide PDF.

See `../docs/Desert-Wings-Implementation-Guide.pdf` for a full step-by-step explanation of the code.
