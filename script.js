
document.getElementById("filmForm").addEventListener("submit", function(event) {
  event.preventDefault();

  const statusMessage = document.getElementById("statusMessage");
  const form = document.getElementById("filmForm");

  emailjs.send("service_g1117fv", "template_7slhllf", {
    title: document.getElementById("title").value,
    type: document.getElementById("type").value,
    message: document.getElementById("message").value,
    date: new Date().toLocaleString("hu-HU")
  }).then(function(response) {
    statusMessage.innerText = "✅ Kérés sikeresen elküldve!";
    statusMessage.style.color = "lightgreen";
    form.reset();
    setTimeout(() => statusMessage.innerText = "", 5000);
  }, function(error) {
    statusMessage.innerText = "❌ Hiba történt a küldés során. Próbáld újra később.";
    statusMessage.style.color = "red";
    setTimeout(() => statusMessage.innerText = "", 7000);
  });
});

const btn = document.getElementById('sendBtn');
function toast(msg, ok = true) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.style.background = ok ? '#4caf50' : '#e53935';
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 4000);
}
form.addEventListener('submit', e => {
  e.preventDefault();
  btn.classList.add('loader-on');
  emailjs.sendForm('service_xxx', 'template_xxx', form)
    .then(() => {
      toast('✅ Kérés elküldve!');
      form.reset();
    })
    .catch(() => {
      toast('❌ Hiba történt');
    })
    .finally(() => {
      btn.classList.remove('loader-on');
    });
});
