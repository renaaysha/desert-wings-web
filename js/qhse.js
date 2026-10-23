/* =========================================================
   QHSE page — training chips + temperature safety checker.
   Limits follow common HACCP guidance; adjust them to your
   own approved food safety plan.
   ========================================================= */
(function () {
  // Training areas from data.js
  const list = document.getElementById("trainingList");
  if (list) list.innerHTML = DW.training.map(t => `<span>${icon("check", 16)} ${t}</span>`).join("");

  const form = document.getElementById("tempForm");
  if (!form) return;

  // Critical limits per control point
  const LIMITS = {
    cook:   { test: t => t >= 75, rule: "Core temperature must reach at least 75 °C.", fix: "Continue cooking and re-probe until 75 °C is reached." },
    hot:    { test: t => t >= 63, rule: "Hot food must be held at 63 °C or above.", fix: "Reheat to 75 °C within the hour, or discard if held below 63 °C for over 2 hours." },
    chill:  { test: t => t <= 5,  rule: "Chilled food must be kept at 5 °C or below.", fix: "Move to a working unit, record the incident and discard high-risk food above 8 °C for over 2 hours." },
    freeze: { test: t => t <= -18, rule: "Frozen food must be kept at −18 °C or below.", fix: "Check the freezer seal and setting; quarantine and assess partially thawed stock." },
    reheat: { test: t => t >= 75, rule: "Reheated food must reach at least 75 °C.", fix: "Continue reheating. Food should be reheated only once." }
  };

  liveValidate(form);
  form.addEventListener("submit", e => {
    e.preventDefault();
    const out = document.getElementById("tempResult");
    if (!validateForm(form)) { out.innerHTML = ""; return; }
    const limit = LIMITS[form.tempStage.value];
    const temp = parseFloat(form.tempValue.value);
    const ok = limit.test(temp);
    out.innerHTML = `
      <div class="temp-result ${ok ? "ok" : "bad"}">
        ${icon(ok ? "check" : "x", 20)}
        <span>${ok ? "PASS" : "FAIL"} — ${temp} °C. ${limit.rule}${ok ? "" : `<br><small>Corrective action: ${limit.fix}</small>`}</span>
      </div>`;
  });
})();
