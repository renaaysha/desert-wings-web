/* =========================================================
   Desert Wings — Shared site behaviour (loaded on every page)
   ---------------------------------------------------------
   Sections:
     A. Utilities (selectors, storage, toast, formatting)
     B. Form validation helper (used by every form)
     C. Theme (light / dark) toggle
     D. Navigation (mobile menu, sticky header)
     E. Scroll effects (reveal animations, counters, back-to-top)
     F. Hero slider
     G. Accordion & tabs
     H. Data renderers (services, values, sectors, stats, HACCP, FAQ)
     I. Newsletter form
     J. Boot — runs everything once the DOM is ready
   ========================================================= */

/* ---------- A. Utilities ---------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

/** Safe wrapper around localStorage (it can throw in private mode). */
const store = {
  get(key, fallback = []) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
    catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; }
    catch { return false; }
  },
  push(key, item) {
    const list = store.get(key, []);
    list.unshift(item);                 // newest first
    return store.set(key, list);
  }
};

/** Escapes text before inserting it into HTML (prevents XSS). */
function escapeHtml(str = "") {
  return String(str).replace(/[&<>"']/g, ch =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
}

/** Formats a number as Qatari Riyal, e.g. 12,500 QAR. */
function money(n) {
  return `${Math.round(n).toLocaleString("en-US")} ${DW.pricing.currency}`;
}

/** Creates a short, readable reference number such as DW-Q-8F3K2. */
function makeRef(prefix) {
  return `DW-${prefix}-${Date.now().toString(36).slice(-5).toUpperCase()}`;
}

/** Shows a temporary notification in the bottom corner. */
function toast(message, type = "success") {
  const stack = $("#toastStack");
  if (!stack) return;
  const el = document.createElement("div");
  el.className = `toast toast-${type}`;
  el.innerHTML = `${icon(type === "error" ? "x" : "check", 18)}<span>${escapeHtml(message)}</span>`;
  stack.appendChild(el);
  requestAnimationFrame(() => el.classList.add("show"));
  setTimeout(() => { el.classList.remove("show"); setTimeout(() => el.remove(), 300); }, 4000);
}

/* ---------- B. Form validation ---------- */
/**
 * Validates a form using the browser's built-in constraint API
 * (required, type="email", pattern, min, max, minlength) and shows
 * friendly messages in the .field-error element next to each field.
 * Returns true when the form is valid.
 */
function validateForm(form) {
  let firstInvalid = null;
  $$("input, select, textarea", form).forEach(field => {
    if (field.type === "submit" || field.disabled) return;
    const msg = fieldMessage(field);
    setFieldError(field, msg);
    if (msg && !firstInvalid) firstInvalid = field;
  });
  if (firstInvalid) firstInvalid.focus();
  return !firstInvalid;
}

function fieldMessage(field) {
  const v = field.validity;
  if (v.valid && !field.dataset.custom) return "";
  if (v.valueMissing) return field.type === "checkbox" ? "Please tick this box to continue." : "This field is required.";
  if (v.typeMismatch && field.type === "email") return "Please enter a valid email address.";
  if (v.patternMismatch) return field.dataset.patternMsg || "Please match the requested format.";
  if (v.rangeUnderflow) return field.type === "date" ? "Please choose a date from today onwards." : `Minimum value is ${field.min}.`;
  if (v.rangeOverflow) return `Maximum value is ${field.max}.`;
  if (v.tooShort) return `Please enter at least ${field.minLength} characters.`;
  if (v.customError) return field.validationMessage;
  return "";
}

function setFieldError(field, msg) {
  const wrap = field.closest(".field") || field.parentElement;
  const out = wrap && wrap.querySelector(".field-error");
  field.setAttribute("aria-invalid", msg ? "true" : "false");
  if (out) out.textContent = msg;
}

/** Re-validates a field as soon as the user fixes it. */
function liveValidate(form) {
  form.addEventListener("input", e => {
    if (e.target.getAttribute("aria-invalid") === "true") setFieldError(e.target, fieldMessage(e.target));
  });
  form.addEventListener("change", e => {
    if (e.target.getAttribute("aria-invalid") === "true") setFieldError(e.target, fieldMessage(e.target));
  });
}

/** Turns a form into a plain object: { name: value, ... } (checkbox groups become arrays). */
function formToObject(form) {
  const data = {};
  new FormData(form).forEach((value, key) => {
    if (value instanceof File) value = value.name;
    if (key in data) data[key] = [].concat(data[key], value);
    else data[key] = value;
  });
  return data;
}

/* ---------- C. Theme ---------- */
function initTheme() {
  const btn = $("#themeToggle");
  const saved = (() => { try { return localStorage.getItem("dw_theme"); } catch { return null; } })();
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(saved || (prefersDark ? "dark" : "light"));

  btn && btn.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(next);
    try { localStorage.setItem("dw_theme", next); } catch { /* ignore */ }
  });

  function applyTheme(mode) {
    document.documentElement.dataset.theme = mode;
    if (btn) {
      btn.innerHTML = icon(mode === "dark" ? "sun" : "moon", 20);
      btn.setAttribute("aria-label", mode === "dark" ? "Switch to light mode" : "Switch to dark mode");
    }
  }
}

/* ---------- D. Navigation ---------- */
function initNav() {
  const toggle = $("#navToggle");
  const links = $("#navLinks");
  const header = $("#siteHeader");

  toggle && toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    toggle.innerHTML = icon(open ? "x" : "bars", 22);
    document.body.classList.toggle("menu-open", open);
  });

  // Close the mobile menu after a link is chosen or Escape is pressed
  links && links.addEventListener("click", e => { if (e.target.closest("a") && links.classList.contains("open")) toggle.click(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && links && links.classList.contains("open")) toggle.click(); });

  // Add a shadow to the header once the page is scrolled
  const onScroll = () => header && header.classList.toggle("scrolled", window.scrollY > 10);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* ---------- E. Scroll effects ---------- */
function initReveal() {
  const items = $$(".reveal");
  if (!("IntersectionObserver" in window)) { items.forEach(i => i.classList.add("visible")); return; }
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add("visible"); io.unobserve(entry.target); }
    });
  }, { threshold: 0.12 });
  items.forEach(i => io.observe(i));
}

function initCounters() {
  const counters = $$("[data-count]");
  if (!counters.length) return;
  const animate = el => {
    const target = Number(el.dataset.count);
    const suffix = el.dataset.suffix || "";
    const duration = 1600;
    const start = performance.now();
    const step = now => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);              // ease-out cubic
      el.textContent = Math.round(target * eased).toLocaleString() + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { animate(e.target); io.unobserve(e.target); } });
  }, { threshold: 0.5 });
  counters.forEach(c => io.observe(c));
}

function initBackToTop() {
  const btn = $("#backToTop");
  if (!btn) return;
  window.addEventListener("scroll", () => btn.classList.toggle("show", window.scrollY > 600), { passive: true });
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

/* ---------- F. Hero slider ---------- */
function initSlider() {
  const slider = $("[data-slider]");
  if (!slider) return;
  const slides = $$(".slide", slider);
  const dotsWrap = $(".slider-dots", slider);
  let index = 0, timer = null;
  const delay = 6000;

  dotsWrap.innerHTML = slides.map((_, i) =>
    `<button type="button" aria-label="Go to slide ${i + 1}"></button>`).join("");
  const dots = $$("button", dotsWrap);

  function go(i) {
    index = (i + slides.length) % slides.length;
    slides.forEach((s, n) => {
      s.classList.toggle("active", n === index);
      s.setAttribute("aria-hidden", n !== index);
    });
    dots.forEach((d, n) => d.setAttribute("aria-current", n === index));
  }
  const next = () => go(index + 1);
  const prev = () => go(index - 1);
  const play = () => { stop(); timer = setInterval(next, delay); };
  const stop = () => clearInterval(timer);

  dots.forEach((d, i) => d.addEventListener("click", () => { go(i); play(); }));
  $(".slider-next", slider).addEventListener("click", () => { next(); play(); });
  $(".slider-prev", slider).addEventListener("click", () => { prev(); play(); });

  // Pause while hovered or focused; resume afterwards
  slider.addEventListener("mouseenter", stop);
  slider.addEventListener("mouseleave", play);
  slider.addEventListener("focusin", stop);
  slider.addEventListener("focusout", play);

  // Keyboard arrows
  slider.addEventListener("keydown", e => {
    if (e.key === "ArrowRight") { next(); }
    if (e.key === "ArrowLeft") { prev(); }
  });

  // Touch swipe
  let startX = 0;
  slider.addEventListener("touchstart", e => { startX = e.touches[0].clientX; stop(); }, { passive: true });
  slider.addEventListener("touchend", e => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) (dx < 0 ? next : prev)();
    play();
  });

  // Respect users who prefer reduced motion: no autoplay
  go(0);
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) play();
}

/* ---------- G. Accordion & tabs ---------- */
function initAccordions(root = document) {
  $$(".accordion-trigger", root).forEach(btn => {
    if (btn.dataset.bound) return;
    btn.dataset.bound = "1";
    btn.addEventListener("click", () => {
      const panel = document.getElementById(btn.getAttribute("aria-controls"));
      const open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", !open);
      panel.style.maxHeight = open ? null : panel.scrollHeight + "px";
      panel.classList.toggle("open", !open);
    });
  });
}

function initTabs(root = document) {
  $$("[role=tablist]", root).forEach(list => {
    const tabs = $$("[role=tab]", list);
    tabs.forEach((tab, i) => {
      tab.addEventListener("click", () => select(i));
      tab.addEventListener("keydown", e => {
        if (e.key === "ArrowRight") select((i + 1) % tabs.length, true);
        if (e.key === "ArrowLeft") select((i - 1 + tabs.length) % tabs.length, true);
      });
    });
    function select(i, focus) {
      tabs.forEach((t, n) => {
        const on = n === i;
        t.setAttribute("aria-selected", on);
        t.tabIndex = on ? 0 : -1;
        const panel = document.getElementById(t.getAttribute("aria-controls"));
        if (panel) panel.hidden = !on;
      });
      if (focus) tabs[i].focus();
      list.dispatchEvent(new CustomEvent("tabchange", { detail: { index: i } }));
    }
  });
}

/* ---------- H. Data renderers ---------- */
function renderServiceCards() {
  const el = $("#serviceCards");
  if (!el) return;
  el.innerHTML = DW.services.map((s, i) => `
    <article class="card service-card reveal" style="--d:${i * 80}ms">
      <div class="card-icon">${icon(s.icon, 28)}</div>
      <h3>${s.title}</h3>
      <p>${s.short}</p>
      <a class="link-arrow" href="services.html#${s.id}">Learn more ${icon("arrow", 16)}</a>
    </article>`).join("");
}

function renderValues() {
  const el = $("#valueCards");
  if (!el) return;
  el.innerHTML = DW.values.map((v, i) => `
    <div class="value reveal" style="--d:${i * 80}ms">
      <span class="value-icon">${icon(v.icon, 22)}</span>
      <div><h3>${v.title}</h3><p>${v.text}</p></div>
    </div>`).join("");
}

function renderSectors() {
  const el = $("#sectorGrid");
  if (!el) return;
  el.innerHTML = DW.sectors.map((s, i) => `
    <div class="sector reveal" style="--d:${i * 60}ms">${icon(s.icon, 30)}<span>${s.title}</span></div>`).join("");
}

function renderStats() {
  const el = $("#statsGrid");
  if (!el) return;
  el.innerHTML = DW.stats.map(s => `
    <div class="stat">
      <strong data-count="${s.value}" data-suffix="${s.suffix}">0${s.suffix}</strong>
      <span>${s.label}</span>
    </div>`).join("");
}

function renderHaccp() {
  const el = $("#haccpSteps");
  if (!el) return;
  el.innerHTML = DW.haccp.map((h, i) => `
    <li class="haccp-step reveal" style="--d:${i * 70}ms">
      <span class="haccp-num">${i + 1}</span>
      <div><h3>${h.title}</h3><p>${h.text}</p></div>
    </li>`).join("");
}

function renderFaq() {
  const el = $("#faqList");
  if (!el) return;
  el.innerHTML = DW.faqs.map((f, i) => `
    <div class="accordion-item">
      <h3><button class="accordion-trigger" type="button" aria-expanded="false" aria-controls="faq-${i}" id="faq-btn-${i}">
        ${f.q}${icon("chevron", 20, "chev")}</button></h3>
      <div class="accordion-panel" id="faq-${i}" role="region" aria-labelledby="faq-btn-${i}"><p>${f.a}</p></div>
    </div>`).join("");
}

/* ---------- I. Newsletter ---------- */
function initNewsletter() {
  const form = $("#newsletterForm");
  if (!form) return;
  liveValidate(form);
  form.addEventListener("submit", e => {
    e.preventDefault();
    if (!validateForm(form)) return;
    const email = form.email.value.trim().toLowerCase();
    const list = store.get("dw_newsletter", []);
    if (list.some(s => s.email === email)) { toast("You're already subscribed.", "info"); return; }
    store.push("dw_newsletter", { email, date: new Date().toISOString() });
    form.reset();
    toast("Thanks! You're subscribed to Desert Wings updates.");
  });
}

/* ---------- J. Boot ---------- */
document.addEventListener("DOMContentLoaded", () => {
  renderServiceCards();
  renderValues();
  renderSectors();
  renderStats();
  renderHaccp();
  renderFaq();

  initTheme();
  initNav();
  initSlider();
  initAccordions();
  initTabs();
  initNewsletter();
  initBackToTop();
  initCounters();
  initReveal();          // last, so dynamically rendered .reveal items are included

  const y = $("#year");
  if (y) y.textContent = new Date().getFullYear();
});
