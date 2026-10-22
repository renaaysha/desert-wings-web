/* =========================================================
   Contact page — info cards, validated contact form with a
   spam honeypot, character counter and "open in email app".
   ========================================================= */
(function () {
  const c = DW.company;

  // Info cards built from the single source of truth in data.js
  const cards = document.getElementById("infoCards");
  if (cards) cards.innerHTML = [
    { i: "pin", t: "Address", v: `${c.poBox}<br>${c.city}` },
    { i: "phone", t: "Phone", v: `<a href="tel:${c.phoneRaw}">${c.phone}</a><br><a href="tel:${c.phone2Raw}">${c.phone2}</a>` },
    { i: "mail", t: "Email", v: `<a href="mailto:${c.email}">${c.email}</a>` },
    { i: "chat", t: "WhatsApp", v: `<a href="https://wa.me/${c.whatsapp}" target="_blank" rel="noopener">Chat with our team</a>` },
    { i: "clock", t: "Office hours", v: `${c.hours}<br><small>${c.kitchenHours}</small>` }
  ].map(x => `
    <div class="info-card reveal">
      <div class="card-icon">${icon(x.i, 22)}</div>
      <div><h3>${x.t}</h3><p>${x.v}</p></div>
    </div>`).join("");

  const form = document.getElementById("contactForm");
  if (!form) return;

  // Service dropdown options from data.js
  form.service.insertAdjacentHTML("beforeend",
    DW.services.map(s => `<option>${s.title}</option>`).join("") + "<option>Other / General enquiry</option>");

  // Live character counter for the message box
  const msg = document.getElementById("cMsg");
  const count = document.getElementById("charCount");
  msg.addEventListener("input", () => (count.textContent = msg.value.length));

  liveValidate(form);
  form.addEventListener("submit", e => {
    e.preventDefault();
    if (form.website.value) return;           // honeypot filled → silently ignore bots
    if (!validateForm(form)) return;

    const data = formToObject(form);
    delete data.website;
    const ref = makeRef("C");
    const btn = document.getElementById("contactSubmit");
    btn.disabled = true;
    btn.textContent = "Sending…";

    // Simulated network delay — replace with fetch() to your backend (see guide)
    setTimeout(() => {
      store.push("dw_contacts", { ref, date: new Date().toISOString(), ...data });
      form.reset();
      count.textContent = "0";
      btn.disabled = false;
      btn.innerHTML = `${icon("mail", 18)} Send Message`;
      toast(`Message sent! Reference ${ref}.`);

      // Offer to also send it through the visitor's own email app
      const body = `Ref: ${ref}\nName: ${data.fullName}\nCompany: ${data.company}\nPhone: ${data.phone}\nService: ${data.service}\n\n${data.message}`;
      const link = `mailto:${c.email}?subject=${encodeURIComponent("Website enquiry " + ref)}&body=${encodeURIComponent(body)}`;
      const note = document.createElement("p");
      note.className = "hint";
      note.innerHTML = `Saved with reference <strong>${ref}</strong>. <a href="${link}">Also send via your email app →</a>`;
      form.querySelector(".hint.sent")?.remove();
      note.classList.add("sent");
      form.appendChild(note);
    }, 700);
  });
})();
