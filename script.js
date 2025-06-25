
// ---- EmailJS & Google Sheets integráció, DOM teljes betöltés után ----
document.addEventListener("DOMContentLoaded", () => {

  // == DOM elemek ==
  const form = document.getElementById("request-form");
  const titleEl = document.getElementById("title");
  const typeEl  = document.getElementById("type");
  const messageEl = document.getElementById("message");
  const respBox = document.getElementById("response-box");
  const listEl  = document.getElementById("request-list");
  const noReqMsg = document.getElementById("no-req");

  // == EmailJS init ==
  emailjs.init("EBvaCSqGo_4lt8Eb9");

  // == Űrlap beküldés ==
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = titleEl.value.trim();
    const type = typeEl.value;
    const message = messageEl.value.trim();

    if (!title) {
      showStatus("❌ Kérlek adj meg címet!", false);
      return;
    }

    const payload = { title, type, message };

    // 1) EmailJS
    emailjs.send("service_g1117fv", "template_7slhllf", {
      title, type, message, date: new Date().toLocaleString("hu-HU")
    }).then(() => {
      // 2) Google Sheets POST
      return fetch("https://script.google.com/macros/s/AKfycbwIx3mTedbODboaZx02pGoQNgRsjcVzCyeUv-neWg2FWOONEW_qWVEh0mLZ5IzFc1X0/exec", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    }).then(res => {
      if (!res.ok) throw new Error("Sheet POST failed");
      showStatus("✅ Kérés sikeresen elküldve!", true);
      form.reset();
      fetchRequests();
    }).catch(err => {
      console.error(err);
      showStatus("❌ Hiba történt a küldéskor.", false);
    });
  });

  // == Kérések betöltése ==
  function fetchRequests() {
    fetch("https://script.google.com/macros/s/AKfycbwIx3mTedbODboaZx02pGoQNgRsjcVzCyeUv-neWg2FWOONEW_qWVEh0mLZ5IzFc1X0/exec")
      .then(r => r.json())
      .then(arr => {
        listEl.innerHTML = "";
        if (!Array.isArray(arr) || arr.length === 0) {
          noReqMsg.style.display = "block";
          return;
        }
        noReqMsg.style.display = "none";
        arr.reverse().forEach(it => {
          const li = document.createElement("li");
          li.innerHTML = `<strong>${it.title}</strong> (${it.type})`
            + `<br><small>${it.date}</small>` 
            + (it.message ? "<br>" + it.message : "");
          listEl.appendChild(li);
        });
      }).catch(err => {
        console.error(err);
        noReqMsg.textContent = "Nem sikerült betölteni a listát.";
        noReqMsg.style.display = "block";
      });
  }

  // Képernyő üzenet
  function showStatus(msg, ok) {
    respBox.textContent = msg;
    respBox.style.color = ok ? "lightgreen" : "red";
  }

  // Első betöltés
  fetchRequests();
});
