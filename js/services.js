/* =========================================================
   Services page — builds the jump links and detailed service
   blocks from DW.services, and highlights the service that is
   currently on screen.
   ========================================================= */
(function () {
  const nav = document.getElementById("serviceNav");
  const wrap = document.getElementById("serviceDetails");
  if (!nav || !wrap) return;

  // 1. Jump links ("chips") at the top of the page
  nav.innerHTML = DW.services.map(s =>
    `<a class="chip" href="#${s.id}">${icon(s.icon, 16)} ${s.title}</a>`).join("");

  // 2. One detailed block per service
  wrap.innerHTML = DW.services.map(s => `
    <article class="service-detail" id="${s.id}">
      <div class="service-visual reveal">
        <span class="tag">${s.sectors[0]} · ${s.sectors[1]}</span>
        ${icon(s.icon, 120)}
      </div>
      <div class="reveal" style="--d:100ms">
        <span class="eyebrow">Service</span>
        <h2>${s.title}</h2>
        <p class="lead">${s.body}</p>
        <ul class="check-list">${s.features.map(f => `<li>${icon("check", 18)} ${f}</li>`).join("")}</ul>
        <div class="sector-tags">${s.sectors.map(t => `<span class="badge">${t}</span>`).join("")}</div>
        <a class="btn btn-primary" href="quote.html?service=${s.id}">${icon("calc", 18)} Get a quote for ${s.title}</a>
      </div>
    </article>`).join("");

  // 3. Highlight the chip of the service currently in view
  const chips = [...nav.querySelectorAll(".chip")];
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        chips.forEach(c => c.classList.toggle("active", c.getAttribute("href") === `#${e.target.id}`));
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  wrap.querySelectorAll(".service-detail").forEach(s => io.observe(s));

  // 4. The blocks are created by JS, so scroll to e.g. #packed ourselves after load
  if (location.hash) {
    window.addEventListener("load", () => {
      const target = document.querySelector(location.hash);
      if (target) target.scrollIntoView();
    });
  }
})();
