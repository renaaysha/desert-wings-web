/* =========================================================
   Quote page — 4-step wizard with a live cost estimate.
   Steps: 0 Service → 1 Requirements → 2 Details → 3 Review → 4 Success
   Rates come from DW.pricing in data.js (indicative only).
   ========================================================= */
(function () {
  const form = document.getElementById("quoteForm");
  if (!form) return;

  const P = DW.pricing;
  const MEAL_LABELS = { breakfast: "Breakfast", lunch: "Lunch", dinner: "Dinner", snack: "Night meal" };
  const LOCATION_LABELS = { doha: "Doha / Al Wakra", industrial: "Industrial Area / Mesaieed / Ras Laffan", remote: "Remote site" };
  const WEEKS_PER_MONTH = 52 / 12;   // ≈ 4.33

  const panels = [...form.querySelectorAll(".step-panel")];
  const stepperItems = [...document.querySelectorAll("#stepper li")];
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  let step = 0;
  let lastQuote = null;

  /* ---------- 1. Build service option cards ---------- */
  document.getElementById("serviceOptions").innerHTML = DW.services.map(s => `
    <label class="option">
      <input type="radio" name="service" value="${s.id}" required>
      <span class="option-body">${icon(s.icon, 26)}<strong>${s.title}</strong><small>${s.short}</small></span>
    </label>`).join("");

  // Pre-select a service from the URL, e.g. quote.html?service=packed
  const fromUrl = new URLSearchParams(location.search).get("service");
  const preset = form.querySelector(`input[name=service][value="${CSS.escape(fromUrl || "")}"]`);
  if (preset) preset.checked = true;

  // Start date cannot be in the past
  form.startDate.min = new Date().toISOString().split("T")[0];

  /* ---------- 2. Keep slider and number box in sync ---------- */
  const range = document.getElementById("headcountRange");
  const num = form.headcount;
  range.addEventListener("input", () => { num.value = range.value; update(); });
  num.addEventListener("input", () => { range.value = Math.min(num.value, range.max); update(); });

  /* ---------- 3. Show only the fields relevant to the chosen service ---------- */
  function service() { return (form.querySelector("input[name=service]:checked") || {}).value; }

  function toggleFields() {
    const s = service();
    const isEvent = s === "event";
    const isHk = s === "housekeeping";
    show("mealsField", !isEvent && !isHk);
    show("daysField", !isEvent && !isHk);
    show("durationField", !isEvent);
    show("tierField", isEvent);
    show("eventsField", isEvent);
    show("cafeteriaField", s === "cafeteria");
    show("addonsField", !isEvent);
    document.getElementById("headcountLabel").textContent =
      isEvent ? "Number of guests per event" : isHk ? "Number of residents / staff" : "Number of people to feed";
    // Housekeeping service: tick both add-ons by default the first time
    if (isHk && !form.querySelector("input[name=addons]:checked")) {
      form.querySelectorAll("input[name=addons]").forEach(c => (c.checked = true));
    }
  }
  function show(id, on) { document.getElementById(id).hidden = !on; }

  /* ---------- 4. Cost calculation ---------- */
  function calculate() {
    const s = service();
    const heads = Math.max(0, parseInt(num.value, 10) || 0);
    const factor = P.locationFactor[form.location.value] || 1;
    const lines = [];
    const result = { lines, monthly: 0, total: 0, isEvent: s === "event" };
    if (!s) return result;

    if (s === "event") {
      const tier = form.tier.value;
      const events = Math.max(1, parseInt(form.events.value, 10) || 1);
      const base = heads * P.eventRates[tier] * events;
      lines.push(["Guests × events", `${heads.toLocaleString()} × ${events}`]);
      lines.push([`Rate (${tier})`, `${P.eventRates[tier]} ${P.currency} / guest`]);
      if (factor !== 1) lines.push(["Location adjustment", `+${Math.round((factor - 1) * 100)}%`]);
      result.total = base * factor;
      return result;
    }

    const meals = [...form.querySelectorAll("input[name=meals]:checked")].map(m => m.value);
    const addons = [...form.querySelectorAll("input[name=addons]:checked")].map(a => a.value);
    const daysPerMonth = parseInt(form.days.value, 10) * WEEKS_PER_MONTH;
    const months = parseInt(form.duration.value, 10);
    let subtotal = 0;

    if (s !== "housekeeping") {
      const perPersonDay = meals.reduce((sum, m) => sum + P.mealRates[m], 0);
      const food = heads * perPersonDay * daysPerMonth;
      subtotal += food;
      lines.push(["People", heads.toLocaleString()]);
      lines.push(["Meals per day", meals.length ? meals.map(m => MEAL_LABELS[m]).join(", ") : "—"]);
      lines.push(["Food cost / month", money(food)]);
      if (s === "packed") {
        const packing = heads * meals.length * P.packedSurcharge * daysPerMonth;
        subtotal += packing;
        lines.push(["Packing & delivery", money(packing)]);
      }
      if (s === "cafeteria") {
        const n = Math.max(1, parseInt(form.cafeterias.value, 10) || 1);
        const fee = n * P.cafeteriaMgmtFee;
        subtotal += fee;
        lines.push([`Cafeteria management (${n})`, money(fee)]);
      }
    } else {
      lines.push(["Residents / staff", heads.toLocaleString()]);
    }

    if (addons.includes("housekeeping")) { const v = heads * P.housekeepingPerHead; subtotal += v; lines.push(["Housekeeping", money(v)]); }
    if (addons.includes("laundry")) { const v = heads * P.laundryPerHead; subtotal += v; lines.push(["Laundry", money(v)]); }

    if (factor !== 1) { lines.push(["Location adjustment", `+${Math.round((factor - 1) * 100)}%`]); subtotal *= factor; }

    const tierHit = P.volumeDiscounts.find(d => heads >= d.min);
    if (tierHit && subtotal > 0) {
      lines.push([`Volume discount (${tierHit.pct}%)`, `− ${money(subtotal * tierHit.pct / 100)}`]);
      subtotal *= 1 - tierHit.pct / 100;
    }

    result.monthly = subtotal;
    result.total = subtotal * months;
    result.months = months;
    return result;
  }

  /* ---------- 5. Paint the live estimate panel ---------- */
  function update() {
    toggleFields();
    const r = calculate();
    document.getElementById("estimateLines").innerHTML = r.lines
      .map(([k, v]) => `<dt>${escapeHtml(k)}</dt><dd>${escapeHtml(v)}</dd>`).join("") || "<dt>Select a service to begin</dt><dd></dd>";
    const monthlyEl = document.getElementById("estimateMonthly");
    const totalEl = document.getElementById("estimateTotal");
    const label = monthlyEl.previousElementSibling;
    if (r.isEvent) {
      label.textContent = "Estimated event total";
      monthlyEl.textContent = r.total ? money(r.total) : "—";
      totalEl.textContent = "";
    } else {
      label.textContent = "Estimated monthly cost";
      monthlyEl.textContent = r.monthly ? money(r.monthly) : "—";
      totalEl.textContent = r.total ? `${money(r.total)} over ${r.months} month${r.months > 1 ? "s" : ""}` : "";
    }
    return r;
  }
  form.addEventListener("input", update);
  form.addEventListener("change", update);

  /* ---------- 6. Step validation ---------- */
  function validateStep(i) {
    const panel = panels[i];
    if (i === 0) {
      const ok = !!service();
      document.getElementById("serviceError").textContent = ok ? "" : "Please choose a service to continue.";
      return ok;
    }
    if (i === 1) {
      let ok = true;
      // Only validate fields that are visible for this service
      [...panel.querySelectorAll("input, select, textarea")]
        .filter(f => !f.closest("[hidden]") && f.name)
        .forEach(f => { const m = fieldMessage(f); setFieldError(f, m); if (m) ok = false; });
      const mealsVisible = !document.getElementById("mealsField").hidden;
      const anyMeal = form.querySelector("input[name=meals]:checked");
      document.getElementById("mealsError").textContent = mealsVisible && !anyMeal ? "Choose at least one meal." : "";
      if (mealsVisible && !anyMeal) ok = false;
      if (service() === "housekeeping" && !form.querySelector("input[name=addons]:checked")) {
        toast("Choose housekeeping, laundry or both.", "error");
        ok = false;
      }
      return ok;
    }
    if (i === 2) {
      let ok = true, first = null;
      panel.querySelectorAll("input").forEach(f => {
        const m = fieldMessage(f); setFieldError(f, m);
        if (m) { ok = false; first = first || f; }
      });
      if (first) first.focus();
      return ok;
    }
    return true;
  }

  /* ---------- 7. Move between steps ---------- */
  function goTo(i) {
    step = i;
    panels.forEach(p => (p.hidden = Number(p.dataset.step) !== i));
    stepperItems.forEach((li, n) => {
      li.classList.toggle("active", n === i);
      li.classList.toggle("done", n < i);
    });
    prevBtn.disabled = i === 0;
    nextBtn.innerHTML = i === 3 ? `Submit request ${icon("check", 18)}` : `Continue ${icon("arrow", 18)}`;
    document.getElementById("stepActions").hidden = i === 4;
    if (i === 3) buildReview();
    form.closest(".form-card").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  nextBtn.addEventListener("click", () => {
    if (!validateStep(step)) return;
    if (step === 3) return submit();
    goTo(step + 1);
  });
  prevBtn.addEventListener("click", () => step > 0 && goTo(step - 1));
  // Pressing Enter inside a field moves forward instead of submitting the form
  form.addEventListener("submit", e => { e.preventDefault(); nextBtn.click(); });
  liveValidate(form);

  /* ---------- 8. Review & submit ---------- */
  function summary() {
    const d = formToObject(form);
    const s = DW.services.find(x => x.id === d.service);
    const r = calculate();
    const rows = [
      ["Service", s ? s.title : "—"],
      [service() === "event" ? "Guests per event" : "Headcount", d.headcount],
      ["Location", LOCATION_LABELS[d.location]]
    ];
    if (!document.getElementById("mealsField").hidden) rows.push(["Meals", [].concat(d.meals || []).map(m => MEAL_LABELS[m]).join(", ")]);
    if (!document.getElementById("daysField").hidden) rows.push(["Days / week", d.days]);
    if (!document.getElementById("durationField").hidden) rows.push(["Duration", `${d.duration} months`]);
    if (service() === "event") rows.push(["Events", d.events], ["Menu tier", d.tier]);
    if (service() === "cafeteria") rows.push(["Cafeterias", d.cafeterias]);
    if (d.addons) rows.push(["Add-ons", [].concat(d.addons).map(a => a[0].toUpperCase() + a.slice(1)).join(", ")]);
    if (d.startDate) rows.push(["Start date", d.startDate]);
    if (d.diet) rows.push(["Diet notes", d.diet]);
    rows.push(["Name", d.name], ["Company", d.company], ["Email", d.email], ["Phone", d.phone]);
    if (d.site) rows.push(["Site", d.site]);
    rows.push(r.isEvent ? ["Estimated total", money(r.total)] : ["Estimated monthly", money(r.monthly)]);
    if (!r.isEvent) rows.push(["Estimated contract", money(r.total)]);
    return { rows, data: d, estimate: r };
  }

  function buildReview() {
    document.getElementById("reviewList").innerHTML = summary().rows
      .map(([k, v]) => `<dt>${escapeHtml(k)}</dt><dd>${escapeHtml(v)}</dd>`).join("");
  }

  function submit() {
    const { rows, data, estimate } = summary();
    const ref = makeRef("Q");
    lastQuote = { ref, rows };
    store.push("dw_quotes", {
      ref, date: new Date().toISOString(), ...data,
      monthly: Math.round(estimate.monthly), total: Math.round(estimate.total)
    });
    /* To send this to a real inbox, POST `data` to your backend or a form
       service here (see the implementation guide, section "Connecting forms"). */
    document.getElementById("quoteRef").textContent = ref;
    const body = `Quote reference: ${ref}\n\n` + rows.map(([k, v]) => `${k}: ${v}`).join("\n");
    document.getElementById("emailQuote").href =
      `mailto:${DW.company.email}?subject=${encodeURIComponent("Quote request " + ref)}&body=${encodeURIComponent(body)}`;
    goTo(4);
    toast(`Quote request ${ref} saved.`);
  }

  /* ---------- 9. Success-screen actions ---------- */
  document.getElementById("printQuote").addEventListener("click", () => window.print());
  document.getElementById("downloadQuote").addEventListener("click", () => {
    if (!lastQuote) return;
    const text = `DESERT WINGS W.L.L. — QUOTE REQUEST\nReference: ${lastQuote.ref}\nDate: ${new Date().toLocaleString()}\n\n` +
      lastQuote.rows.map(([k, v]) => `${k.padEnd(20)} ${v}`).join("\n") +
      `\n\nThis is an indicative estimate. Final pricing follows a site survey.\n${DW.company.phone} · ${DW.company.email}`;
    const a = Object.assign(document.createElement("a"), {
      href: URL.createObjectURL(new Blob([text], { type: "text/plain" })),
      download: `${lastQuote.ref}.txt`
    });
    a.click();
    URL.revokeObjectURL(a.href);
  });
  document.getElementById("newQuote").addEventListener("click", () => {
    form.reset();
    range.value = num.value;
    form.querySelectorAll("[aria-invalid]").forEach(f => setFieldError(f, ""));
    goTo(0);
    update();
  });

  update();
})();
