document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("requestForm");
    if (!form) return; // Ha nincs form az oldalon, kilépünk

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        const type = document.getElementById("type").value;
        const title = document.getElementById("title").value;
        const note = document.getElementById("note").value;
        const submitBtn = form.querySelector("button[type='submit']");

        // Visszajelző mező
        let feedback = document.getElementById("feedback");
        if (!feedback) {
            feedback = document.createElement("div");
            feedback.id = "feedback";
            feedback.style.marginTop = "10px";
            form.appendChild(feedback);
        }

        feedback.textContent = "Beküldés folyamatban...";
        feedback.style.color = "#444";
        submitBtn.disabled = true;

        fetch("https://script.google.com/macros/s/AKfycbw7lMx08yYQUnddKSXNcm1dp20_BFYn5WaxY-tU8Ra1_T1OXcQKt1ajsei6_4UY8i5O/exec", {
            method: "POST",
            body: JSON.stringify({ type, title, note }),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => {
            if (res.ok) {
                feedback.textContent = "✅ Kérés elküldve!";
                feedback.style.color = "green";
                form.reset();
            } else {
                feedback.textContent = "❌ Hiba történt a beküldés során.";
                feedback.style.color = "red";
            }
        }).catch(error => {
            feedback.textContent = "❌ Hálózati hiba: " + error;
            feedback.style.color = "red";
        }).finally(() => {
            submitBtn.disabled = false;
        });
    });
});