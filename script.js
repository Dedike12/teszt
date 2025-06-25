const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwn0MwGZRq6yX88-F4pC-KXe_hh6X94h2Eh669UkaeRm1miRTXW2QfQewThk4ihBH58cw/exec";

const EMAIL_SERVICE_ID = "service_g1117fv";
const EMAIL_TEMPLATE_ID = "template_7slhllf";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("requestForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // csak most kérjük le a mezőket!
    const titleField = document.getElementById("title");
    const typeField = document.getElementById("type");
    const messageField = document.getElementById("message");

    const title = titleField?.value.trim();
    const type = typeField?.value || "Film";
    const message = messageField?.value.trim() || "-";
    const date = new Date().toLocaleDateString("hu-HU");

    if (!title) {
      alert("Adj meg egy címet!");
      return;
    }

    const payload = { title, type, date };

    try {
      // 1️⃣ Google Táblázatba mentés
      const res = await fetch(SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(await res.text());

      // 2️⃣ EmailJS küldés
      await emailjs.send(EMAIL_SERVICE_ID, EMAIL_TEMPLATE_ID, {
        title,
        type,
        message,
        date,
      });

      alert("Kérés elmentve és e-mail elküldve. Köszönöm!");
      form.reset();
    } catch (err) {
      console.error("Hiba:", err);
      alert("Hiba történt a mentés vagy e-mail küldés közben.");
    }
  });

  // kéréslista betöltése ha van ilyen táblázat az oldalon
  if (document.getElementById("requestTable")) {
    loadRequests();
  }
});

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
    console.error("Hiba a lista betöltésekor:", err);
  }
}
