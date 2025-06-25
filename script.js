
document.getElementById("requestForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const type = document.getElementById("type").value;
    const title = document.getElementById("title").value;
    const note = document.getElementById("note").value;

    fetch("https://script.google.com/macros/s/AKfycbw7lMx08yYQUnddKSXNcm1dp20_BFYn5WaxY-tU8Ra1_T1OXcQKt1ajsei6_4UY8i5O/exec", {
        method: "POST",
        body: JSON.stringify({ type, title, note }),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(res => {
        if (res.ok) {
            alert("Kérés elküldve!");
            document.getElementById("requestForm").reset();
        } else {
            alert("Hiba történt.");
        }
    });
});
