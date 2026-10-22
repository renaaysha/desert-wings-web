/* =========================================================
   Careers page — searchable / filterable job list and an
   application form inside a native <dialog> modal.
   Jobs come from DW.jobs in data.js.
   ========================================================= */
(function () {
  const list = document.getElementById("jobList");
  if (!list) return;

  const search = document.getElementById("jobSearch");
  const dept = document.getElementById("jobDept");
  const type = document.getElementById("jobType");
  const modal = document.getElementById("jobModal");
  const form = document.getElementById("applyForm");
  const MAX_MB = 2;

  // Fill the filter dropdowns with the unique departments and job types
  const unique = key => [...new Set(DW.jobs.map(j => j[key]))].sort();
  dept.insertAdjacentHTML("beforeend", unique("dept").map(d => `<option>${d}</option>`).join(""));
  type.insertAdjacentHTML("beforeend", unique("type").map(t => `<option>${t}</option>`).join(""));

  /* ---- Render the filtered list ---- */
  function render() {
    const q = search.value.trim().toLowerCase();
    const jobs = DW.jobs.filter(j =>
      (!dept.value || j.dept === dept.value) &&
      (!type.value || j.type === type.value) &&
      (!q || `${j.title} ${j.desc} ${j.dept}`.toLowerCase().includes(q)));

    document.getElementById("jobCount").textContent =
      `${jobs.length} position${jobs.length === 1 ? "" : "s"} found`;

    list.innerHTML = jobs.length ? jobs.map(j => `
      <article class="job">
        <div>
          <h3>${j.title}</h3>
          <div class="job-meta">
            <span>${icon("briefcase", 15)} ${j.dept}</span>
            <span>${icon("pin", 15)} ${j.location}</span>
            <span>${icon("clock", 15)} ${j.type}</span>
            <span>${icon("award", 15)} ${j.exp}</span>
          </div>
        </div>
        <div class="job-actions">
          <button class="btn btn-primary btn-sm" type="button" data-apply="${j.id}">View & apply</button>
        </div>
      </article>`).join("")
      : `<p class="empty">No positions match your search. Try clearing the filters or send a general application.</p>`;
  }
  [search, dept, type].forEach(el => el.addEventListener("input", render));

  /* ---- Open the modal for a job (event delegation handles all buttons) ---- */
  document.addEventListener("click", e => {
    const btn = e.target.closest("[data-apply]");
    if (!btn) return;
    const job = DW.jobs.find(j => j.id === btn.dataset.apply);
    document.getElementById("modalTitle").textContent = job ? job.title : "General Application";
    document.getElementById("modalDept").textContent = job ? `${job.dept} · ${job.location}` : "Any department";
    document.getElementById("modalDesc").textContent = job
      ? `${job.desc} Experience: ${job.exp}.`
      : "Tell us about yourself and the kind of role you're looking for.";
    document.getElementById("applyPosition").value = job ? `${job.id} – ${job.title}` : "General application";
    form.reset();
    cv.setCustomValidity("");
    form.querySelectorAll("[aria-invalid]").forEach(f => setFieldError(f, ""));
    modal.showModal();
  });

  const close = () => modal.close();
  document.getElementById("modalClose").addEventListener("click", close);
  document.getElementById("applyCancel").addEventListener("click", close);
  // Clicking the dark backdrop (outside the dialog box) closes it
  modal.addEventListener("click", e => { if (e.target === modal) close(); });

  /* ---- CV file check: type and size ---- */
  const cv = document.getElementById("aCv");
  cv.addEventListener("change", () => {
    const f = cv.files[0];
    let msg = "";
    if (f && !/\.(pdf|docx?)$/i.test(f.name)) msg = "Please upload a PDF or Word document.";
    else if (f && f.size > MAX_MB * 1024 * 1024) msg = `File is too large (max ${MAX_MB} MB).`;
    cv.setCustomValidity(msg);
    setFieldError(cv, msg);
  });

  /* ---- Submit ---- */
  liveValidate(form);
  form.addEventListener("submit", e => {
    e.preventDefault();
    if (!validateForm(form)) return;
    const data = formToObject(form);
    const f = cv.files[0];
    const ref = makeRef("A");
    store.push("dw_applications", {
      ref, date: new Date().toISOString(), ...data,
      cv: f ? `${f.name} (${Math.round(f.size / 1024)} KB)` : ""
    });
    /* A static site cannot store the CV file itself — connect a backend or a
       form service to receive uploads (see the implementation guide). */
    close();
    toast(`Application received. Reference ${ref}.`);
  });

  render();
})();
