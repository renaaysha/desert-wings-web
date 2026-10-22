/* =========================================================
   Menu page — weekly rotating menu with day tabs, cuisine and
   diet filters, live search, CSV download and print.
   Dishes come from DW.dishes in data.js.
   ========================================================= */
(function () {
  const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const MEALS = [
    { key: "breakfast", label: "Breakfast", icon: "coffee", time: "5:00 – 7:00 AM" },
    { key: "lunch", label: "Lunch", icon: "chef", time: "11:30 AM – 1:30 PM" },
    { key: "dinner", label: "Dinner", icon: "flame", time: "7:00 – 9:00 PM" }
  ];
  const DIETS = { veg: "Vegetarian", halal: "Halal", protein: "High protein", light: "Light" };
  const PER_MEAL = 4;   // dishes offered per meal per day

  const state = {
    day: new Date().getDay(),          // 0 = Sunday — opens on today's menu
    cuisines: new Set(),
    diets: new Set(),
    search: ""
  };

  const tabs = document.getElementById("dayTabs");
  const panel = document.getElementById("menuPanel");
  if (!tabs || !panel) return;

  /**
   * Picks the dishes served on a given day.
   * Each day starts at a different offset (day × 7) in the dish pool and takes
   * PER_MEAL consecutive dishes, so the week rotates without repeating days.
   */
  function dishesFor(dayIndex, mealKey) {
    const pool = DW.dishes[mealKey];
    const start = (dayIndex * 7) % pool.length;
    return Array.from({ length: PER_MEAL }, (_, i) => pool[(start + i) % pool.length]);
  }

  /** True when a dish passes all active filters. */
  function matches(dish) {
    if (state.cuisines.size && !state.cuisines.has(dish.cuisine)) return false;
    for (const d of state.diets) if (!dish.diet.includes(d)) return false;
    if (state.search && !dish.name.toLowerCase().includes(state.search)) return false;
    return true;
  }

  /* ---- Build the controls ---- */
  tabs.innerHTML = DAYS.map((d, i) =>
    `<button role="tab" type="button" aria-selected="${i === state.day}" tabindex="${i === state.day ? 0 : -1}">${d.slice(0, 3)}</button>`).join("");
  tabs.addEventListener("tabchange", e => { state.day = e.detail.index; render(); });

  const cuisineRow = document.getElementById("cuisineFilters");
  cuisineRow.insertAdjacentHTML("beforeend", DW.cuisines.map(c =>
    `<button class="chip" type="button" aria-pressed="false" data-cuisine="${c}">${c}</button>`).join(""));

  const dietRow = document.getElementById("dietFilters");
  dietRow.insertAdjacentHTML("beforeend", Object.entries(DIETS).map(([k, v]) =>
    `<button class="chip" type="button" aria-pressed="false" data-diet="${k}">${v}</button>`).join(""));

  // Toggle a chip on/off and update the matching Set
  function bindChips(row, attr, set) {
    row.addEventListener("click", e => {
      const chip = e.target.closest(".chip");
      if (!chip) return;
      const value = chip.dataset[attr];
      const on = chip.getAttribute("aria-pressed") !== "true";
      chip.setAttribute("aria-pressed", on);
      on ? set.add(value) : set.delete(value);
      render();
    });
  }
  bindChips(cuisineRow, "cuisine", state.cuisines);
  bindChips(dietRow, "diet", state.diets);

  // Search waits 200 ms after typing stops (debounce) before filtering
  let t;
  document.getElementById("menuSearch").addEventListener("input", e => {
    clearTimeout(t);
    t = setTimeout(() => { state.search = e.target.value.trim().toLowerCase(); render(); }, 200);
  });

  document.getElementById("resetFilters").addEventListener("click", () => {
    state.cuisines.clear(); state.diets.clear(); state.search = "";
    document.getElementById("menuSearch").value = "";
    document.querySelectorAll("#cuisineFilters .chip, #dietFilters .chip").forEach(c => c.setAttribute("aria-pressed", "false"));
    render();
  });

  document.getElementById("printMenu").addEventListener("click", () => window.print());
  document.getElementById("downloadMenu").addEventListener("click", downloadCsv);

  /* ---- Render the selected day ---- */
  function render() {
    let shown = 0;
    panel.innerHTML = MEALS.map(meal => {
      const list = dishesFor(state.day, meal.key).filter(matches);
      shown += list.length;
      const items = list.length
        ? list.map(d => `
          <div class="dish">
            <div>
              <h4>${escapeHtml(d.name)}</h4>
              <div class="dish-meta">
                <span class="badge">${d.cuisine}</span>
                ${d.diet.map(x => `<span class="diet diet-${x}">${DIETS[x]}</span>`).join("")}
              </div>
            </div>
            <span class="kcal">~${d.kcal} kcal</span>
          </div>`).join("")
        : `<p class="empty">No dishes match your filters.</p>`;
      return `<div class="meal-col"><h3>${icon(meal.icon, 22)} ${meal.label}<small>${meal.time}</small></h3>${items}</div>`;
    }).join("");

    document.getElementById("menuHeading").textContent = `${DAYS[state.day]}'s Menu`;
    document.getElementById("menuCount").textContent =
      `Showing ${shown} of ${MEALS.length * PER_MEAL} dishes for ${DAYS[state.day]}.`;
  }

  /* ---- CSV export of the whole week ---- */
  function downloadCsv() {
    const rows = [["Day", "Meal", "Dish", "Cuisine", "Diet", "Approx kcal"]];
    DAYS.forEach((day, i) => MEALS.forEach(m =>
      dishesFor(i, m.key).forEach(d =>
        rows.push([day, m.label, d.name, d.cuisine, d.diet.map(x => DIETS[x]).join(" / "), d.kcal]))));
    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\r\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
    const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(blob), download: "desert-wings-weekly-menu.csv" });
    a.click();
    URL.revokeObjectURL(a.href);
    toast("Weekly menu downloaded.");
  }

  render();
})();
