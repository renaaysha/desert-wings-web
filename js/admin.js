/* =========================================================
   Admin (demo) — lists everything the site's forms saved to
   localStorage, with search, delete, clear and CSV export.
   ========================================================= */
(function () {
  const TABS = [
    { key: "dw_quotes", label: "Quotes", cols: ["ref", "date", "service", "company", "name", "email", "phone", "headcount", "monthly", "total"] },
    { key: "dw_contacts", label: "Messages", cols: ["ref", "date", "fullName", "company", "email", "phone", "service", "message"] },
    { key: "dw_applications", label: "Applications", cols: ["ref", "date", "position", "fullName", "email", "phone", "experience", "inQatar", "cv"] },
    { key: "dw_newsletter", label: "Subscribers", cols: ["date", "email"] }
  ];
  const HEADINGS = { ref: "Ref", date: "Date", fullName: "Name", name: "Name", inQatar: "In Qatar", cv: "CV file", monthly: "Monthly (QAR)", total: "Total (QAR)" };
  let active = 0;

  const tabsEl = document.getElementById("adminTabs");
  const tableEl = document.getElementById("adminTable");
  const searchEl = document.getElementById("adminSearch");
  if (!tabsEl) return;

  const heading = c => HEADINGS[c] || c.charAt(0).toUpperCase() + c.slice(1);
  const cell = (row, c) => {
    const v = row[c];
    if (c === "date" && v) return new Date(v).toLocaleString();
    if (typeof v === "number") return v.toLocaleString();
    return v == null ? "" : String(v);
  };

  function renderStats() {
    document.getElementById("adminStats").innerHTML = TABS.map(t =>
      `<div class="admin-stat"><strong>${store.get(t.key, []).length}</strong><span class="muted">${t.label}</span></div>`).join("");
  }

  function renderTabs() {
    tabsEl.innerHTML = TABS.map((t, i) =>
      `<button class="chip" type="button" aria-pressed="${i === active}" data-tab="${i}">${t.label}</button>`).join("");
  }

  function rowsForActive() {
    const q = searchEl.value.trim().toLowerCase();
    return store.get(TABS[active].key, [])
      .map((row, index) => ({ row, index }))           // keep original index for deleting
      .filter(({ row }) => !q || JSON.stringify(row).toLowerCase().includes(q));
  }

  function renderTable() {
    const t = TABS[active];
    const rows = rowsForActive();
    if (!rows.length) {
      tableEl.innerHTML = `<p class="empty" style="margin:0;border:0">No ${t.label.toLowerCase()} yet. Submit a form on the site and it will appear here.</p>`;
      return;
    }
    tableEl.innerHTML = `
      <table class="table">
        <thead><tr>${t.cols.map(c => `<th scope="col">${heading(c)}</th>`).join("")}<th scope="col"><span class="sr-only">Actions</span></th></tr></thead>
        <tbody>${rows.map(({ row, index }) => `
          <tr>${t.cols.map(c => `<td>${escapeHtml(cell(row, c))}</td>`).join("")}
            <td><button class="icon-btn" type="button" data-delete="${index}" aria-label="Delete entry">${icon("trash", 16)}</button></td>
          </tr>`).join("")}
        </tbody>
      </table>`;
  }

  function renderAll() { renderStats(); renderTabs(); renderTable(); }

  tabsEl.addEventListener("click", e => {
    const b = e.target.closest("[data-tab]");
    if (!b) return;
    active = Number(b.dataset.tab);
    renderAll();
  });
  searchEl.addEventListener("input", renderTable);

  tableEl.addEventListener("click", e => {
    const b = e.target.closest("[data-delete]");
    if (!b || !confirm("Delete this entry?")) return;
    const key = TABS[active].key;
    const list = store.get(key, []);
    list.splice(Number(b.dataset.delete), 1);
    store.set(key, list);
    renderAll();
    toast("Entry deleted.");
  });

  document.getElementById("clearAll").addEventListener("click", () => {
    const t = TABS[active];
    if (!store.get(t.key, []).length || !confirm(`Delete all ${t.label.toLowerCase()}? This cannot be undone.`)) return;
    store.set(t.key, []);
    renderAll();
    toast(`${t.label} cleared.`);
  });

  document.getElementById("exportCsv").addEventListener("click", () => {
    const t = TABS[active];
    const rows = rowsForActive().map(r => r.row);
    if (!rows.length) { toast("Nothing to export.", "info"); return; }
    const csv = [t.cols.map(heading), ...rows.map(r => t.cols.map(c => cell(r, c)))]
      .map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\r\n");
    const a = Object.assign(document.createElement("a"), {
      href: URL.createObjectURL(new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" })),
      download: `desert-wings-${t.label.toLowerCase()}.csv`
    });
    a.click();
    URL.revokeObjectURL(a.href);
  });

  renderAll();
})();
