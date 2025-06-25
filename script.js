/* ----------  BEÁLLÍTÁSOK  ---------- */
const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwn0MwGZRq6yX88-F4pC-KXe_hh6X94h2Eh669UkaeRm1miRTXW2QfQewThk4ihBH58cw/exec";

const EMAIL_SERVICE_ID = "service_g1117fv";
const EMAIL_TEMPLATE_ID = "template_7slhllf";

/* ==========  KÉRÉS BEKÜLDÉSE  ========== */
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("requestForm");
  if (!form) return;                       // csak az index oldalon létezik

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const title   = formData.get("title")?.trim();
    const type    = formData.get("type") || "Film";
    const message = formData.get("message")?.trim() || "-";
    const date    = new Date().toLocaleDateString("hu-HU");

    if (!title) {
      alert("Adj meg egy címet!");         // egyszerű ellenőrzés
      return;
    }

    const payload = { title, type, date };

    try {
      /* 1️⃣  MENTÉS A GOOGLE-SCRIPTHEZ */
      const res = await fetch(SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error(await res.text());

      /* 2️⃣  E-MAIL KÜLDÉSE AUTEJES ADATTAL  */
      await emailjs.send(EMAIL_SERVICE_ID, EMAIL_TEMPLATE_ID, {
        title,
        type,
        message,
        date
      });

      alert("Kérés elmentve, e-mail értesítés elküldve. Köszönjük!");
      form.reset();
    } catch (err) {
      console.error(err);
      alert("Hiba történt a mentés vagy az e-mail küldése közben.");
    }
  });
});

/* ==========  KORÁBBI KÉRÉSEK BETÖLTÉSE  ========== */
async function loadRequests() {
  try {
    const res = await fetch(SCRIPT_URL);
    if (!res.ok) throw new Error(await res.text());
    const list = await res.json();

    const tbody = document.querySelector("#requestTable tbody");
    list.forEach((req) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${req.title}</td>
        <td>${req.type}</td>
        <td>${req.date}</td>
        <td>${req.status}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error(err);
  }
}

if (document.getElementById("requestTable")) {
  loadRequests();
}
