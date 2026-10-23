/* =========================================================
   Desert Wings — Shared components
   ---------------------------------------------------------
   1. ICONS   : inline SVG icon library (no icon font needed)
   2. HEADER  : top bar + navigation, injected into #site-header
   3. FOOTER  : footer columns, injected into #site-footer
   4. FLOATING: WhatsApp button, back-to-top button, toast area
   Writing these once in JS means every page shares exactly
   the same header and footer — edit here, update everywhere.
   ========================================================= */

const ICONS = {
  factory: '<path d="M2 20h20V8l-6 4V8l-6 4V4H2z"/><path d="M6 16h.01M10 16h.01M14 16h.01M18 16h.01"/>',
  party: '<rect x="3" y="8" width="18" height="4"/><path d="M12 8v13M19 12v9H5v-9M7.5 8a2.5 2.5 0 1 1 0-5C11 3 12 8 12 8s1-5 4.5-5a2.5 2.5 0 1 1 0 5"/>',
  laundry: '<rect x="4" y="2" width="16" height="20" rx="2"/><circle cx="12" cy="13" r="5"/><path d="M8 6h.01M11 6h.01"/>',
  box: '<path d="M21 8l-9-5-9 5v8l9 5 9-5z"/><path d="M3 8l9 5 9-5M12 13v8"/>',
  coffee: '<path d="M17 8h1a4 4 0 0 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4z"/><path d="M6 2v3M10 2v3M14 2v3"/>',
  smile: '<circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/>',
  menu: '<path d="M2 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H2zM22 4h-7a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h8z"/>',
  star: '<path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3"/>',
  crane: '<path d="M2 18h20M4 18v-3a8 8 0 0 1 16 0v3M10 7V5h4v2M12 7v4"/>',
  flame: '<path d="M12 22c4 0 7-3 7-7 0-4-3-6-4-10-2 2-3 4-3 6-1-1-2-2-2-4-3 3-5 5-5 8 0 4 3 7 7 7z"/>',
  home: '<path d="M3 10l9-7 9 7v11a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>',
  briefcase: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2M2 13h20"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/>',
  phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 6l-10 7L2 6"/>',
  pin: '<path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
  check: '<path d="M20 6L9 17l-5-5"/>',
  arrow: '<path d="M5 12h14M13 5l7 7-7 7"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
  chef: '<path d="M6 13.9A4 4 0 0 1 7.5 6a5 5 0 0 1 9 0A4 4 0 0 1 18 13.9V20H6z"/><path d="M6 17h12"/>',
  users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
  truck: '<path d="M1 3h15v13H1zM16 8h4l3 3v5h-7z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>',
  thermo: '<path d="M14 14.8V4a2 2 0 0 0-4 0v10.8a4 4 0 1 0 4 0z"/>',
  leaf: '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10z"/><path d="M2 21c0-3 1.9-5.4 5.1-6"/>',
  file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8"/>',
  chat: '<path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 21l2.1-5.6A8.5 8.5 0 1 1 21 11.5z"/>',
  bars: '<path d="M3 6h18M3 12h18M3 18h18"/>',
  x: '<path d="M18 6L6 18M6 6l12 12"/>',
  chevron: '<path d="M6 9l6 6 6-6"/>',
  left: '<path d="M15 18l-6-6 6-6"/>',
  right: '<path d="M9 18l6-6-6-6"/>',
  up: '<path d="M12 19V5M5 12l7-7 7 7"/>',
  linkedin: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/>',
  facebook: '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
  instagram: '<rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>',
  calc: '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
  printer: '<path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v8H6z"/>',
  trash: '<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>',
  award: '<circle cx="12" cy="8" r="7"/><path d="M8.2 13.9L7 23l5-3 5 3-1.2-9.1"/>'
};

/** Returns an inline SVG string for an icon name. */
function icon(name, size = 24, cls = "") {
  const paths = ICONS[name] || ICONS.star;
  return `<svg class="icon ${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${paths}</svg>`;
}

/** Brand mark: a sun rising between two wings over a dune line. */
const LOGO_SVG = `
<svg class="logo-mark" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
  <circle cx="32" cy="30" r="10" fill="var(--accent)"/>
  <path d="M30 32C22 22 12 20 3 22c7 2 12 6 15 11 4-2 8-2 12-1z" fill="var(--brand)"/>
  <path d="M34 32c8-10 18-12 27-10-7 2-12 6-15 11-4-2-8-2-12-1z" fill="var(--brand)"/>
  <path d="M4 48c10-7 20-7 28-3s18 4 28-3v8H4z" fill="var(--accent)" opacity=".55"/>
</svg>`;

/** Builds and injects the site header. */
function renderHeader() {
  const mount = document.getElementById("site-header");
  if (!mount) return;
  const c = DW.company;
  const current = location.pathname.split("/").pop() || "index.html";

  const links = DW.nav.map(item => {
    const active = item.href === current ? ' aria-current="page" class="active"' : "";
    return `<li><a href="${item.href}"${active}>${item.label}</a></li>`;
  }).join("");

  mount.outerHTML = `
  <a class="skip-link" href="#main">Skip to main content</a>
  <div class="topbar">
    <div class="container topbar-inner">
      <a href="tel:${c.phoneRaw}">${icon("phone", 14)} ${c.phone}</a>
      <a href="mailto:${c.email}">${icon("mail", 14)} ${c.email}</a>
      <span class="topbar-hours">${icon("clock", 14)} ${c.hours}</span>
    </div>
  </div>
  <header class="site-header" id="siteHeader">
    <nav class="container nav" aria-label="Main navigation">
      <a class="brand" href="index.html" aria-label="${c.shortName} home">
        ${LOGO_SVG}
        <span class="brand-text"><strong>Desert Wings</strong><small>W.L.L. · Qatar</small></span>
      </a>
      <ul class="nav-links" id="navLinks">${links}
        <li class="nav-cta-mobile"><a class="btn btn-primary" href="quote.html">Get a Quote</a></li>
      </ul>
      <div class="nav-actions">
        <button class="icon-btn" id="themeToggle" type="button" aria-label="Switch to dark mode">${icon("moon", 20)}</button>
        <a class="btn btn-primary btn-sm nav-cta" href="quote.html">${icon("calc", 16)} Get a Quote</a>
        <button class="icon-btn hamburger" id="navToggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="navLinks">${icon("bars", 22)}</button>
      </div>
    </nav>
  </header>`;
}

/** Builds and injects the site footer. */
function renderFooter() {
  const mount = document.getElementById("site-footer");
  if (!mount) return;
  const c = DW.company;
  const serviceLinks = DW.services.map(s => `<li><a href="services.html#${s.id}">${s.title}</a></li>`).join("");
  const navLinks = DW.nav.map(n => `<li><a href="${n.href}">${n.label}</a></li>`).join("");

  mount.outerHTML = `
  <footer class="site-footer">
    <div class="container footer-grid">
      <div class="footer-col footer-brand">
        <a class="brand brand-light" href="index.html">${LOGO_SVG}
          <span class="brand-text"><strong>Desert Wings</strong><small>W.L.L. · Qatar</small></span></a>
        <p>Industrial and event catering, packed meals, cafeterias, housekeeping and laundry for organisations across Qatar.</p>
        <div class="social">
          <a href="${c.social.linkedin}" target="_blank" rel="noopener" aria-label="LinkedIn">${icon("linkedin", 18)}</a>
          <a href="${c.social.facebook}" target="_blank" rel="noopener" aria-label="Facebook">${icon("facebook", 18)}</a>
          <a href="${c.social.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${icon("instagram", 18)}</a>
        </div>
      </div>
      <div class="footer-col">
        <h3>Quick Links</h3>
        <ul>${navLinks}<li><a href="quote.html">Request a Quote</a></li></ul>
      </div>
      <div class="footer-col">
        <h3>Services</h3>
        <ul>${serviceLinks}</ul>
      </div>
      <div class="footer-col">
        <h3>Contact</h3>
        <ul class="footer-contact">
          <li>${icon("pin", 16)} ${c.poBox}, ${c.city}</li>
          <li>${icon("phone", 16)} <a href="tel:${c.phoneRaw}">${c.phone}</a></li>
          <li>${icon("phone", 16)} <a href="tel:${c.phone2Raw}">${c.phone2}</a></li>
          <li>${icon("mail", 16)} <a href="mailto:${c.email}">${c.email}</a></li>
        </ul>
        <form class="newsletter" id="newsletterForm" novalidate>
          <label for="nlEmail">Get menu & service updates</label>
          <div class="newsletter-row">
            <input id="nlEmail" name="email" type="email" placeholder="you@company.com" required autocomplete="email">
            <button class="btn btn-primary btn-sm" type="submit">Subscribe</button>
          </div>
          <small class="field-error" aria-live="polite"></small>
        </form>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="container footer-bottom-inner">
        <span>© <span id="year"></span> ${c.name} All rights reserved.</span>
        <span><a href="admin.html">Enquiry dashboard</a> · <a href="qhse.html">Food safety policy</a></span>
      </div>
    </div>
  </footer>`;
}

/** Floating WhatsApp + back-to-top buttons and the toast container. */
function renderFloating() {
  const c = DW.company;
  const wrap = document.createElement("div");
  wrap.innerHTML = `
    <a class="fab fab-whatsapp" href="https://wa.me/${c.whatsapp}?text=${encodeURIComponent("Hello Desert Wings, I'd like to enquire about your catering services.")}" target="_blank" rel="noopener" aria-label="Chat with us on WhatsApp">${icon("chat", 26)}</a>
    <button class="fab fab-top" id="backToTop" type="button" aria-label="Back to top">${icon("up", 22)}</button>
    <div class="toast-stack" id="toastStack" role="status" aria-live="polite"></div>`;
  document.body.append(...wrap.children);
}

/** Replaces every <i data-icon="name"></i> placeholder with its SVG. */
function renderIconPlaceholders(root = document) {
  root.querySelectorAll("[data-icon]").forEach(el => {
    el.outerHTML = icon(el.dataset.icon, Number(el.dataset.size) || 24, el.className);
  });
}

renderHeader();
renderFooter();
renderFloating();
renderIconPlaceholders();
