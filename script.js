
document.getElementById("filmForm").addEventListener("submit", function (event) {
  event.preventDefault();
  const statusMessage = document.getElementById("statusMessage");
  const title = document.getElementById("title").value.trim();
  const type = document.getElementById("type").value;
  const message = document.getElementById("message").value.trim();
  const date = new Date().toLocaleString("hu-HU");

  if (!title) {
    showStatusMessage("❌ A cím kitöltése kötelező.");
    return;
  }

  const requestData = { title, type, message, date, status: "Feldolgozás alatt" };
  fetch("save_request.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestData)
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      emailjs.send("service_g1117fv", "template_7slhllf", {
        title, type, message, date
      }).then(() => {
        showStatusMessage("✅ Kérés sikeresen elküldve!");
        document.getElementById("filmForm").reset();
      }).catch(() => {
        showStatusMessage("❌ Az e-mail küldése nem sikerült, de a kérés mentésre került.");
      });
    } else {
      showStatusMessage("❌ Hiba történt a mentés során. Kérjük, próbáld újra.");
    }
  })
  .catch(() => {
    showStatusMessage("❌ Hálózati hiba történt. Kérjük, próbáld újra.");
  });
});

function showStatusMessage(text) {
  const statusMessage = document.getElementById("statusMessage");
  statusMessage.innerText = text;
  statusMessage.style.opacity = "1";
  statusMessage.style.transition = "opacity 1s ease";

  setTimeout(() => {
    statusMessage.style.opacity = "0";
  }, 4000);

  setTimeout(() => {
    statusMessage.innerText = "";
  }, 5000);
}
