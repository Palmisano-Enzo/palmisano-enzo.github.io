let langData = {};
let currentLang = localStorage.getItem("lang") || "fr";

const langReady = fetch("data/lang.json")
  .then(res => res.json())
  .then(data => {
    langData = data;
  });

function initLangSwitch() {
    document.querySelectorAll(".lang-switch button").forEach(btn => {
        btn.addEventListener("click", () => {
          setLang(btn.dataset.lang);
        });
      });

      langReady.then(() => {
        applyLang();
      });
}

function applyLang() {
    document.documentElement.lang = currentLang;
    localStorage.setItem("lang", currentLang);
  
    // bouton actif
    document.querySelectorAll(".lang-switch button").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.lang === currentLang);
    });
  
    // texte
    updateContent();
  
    // blog
    if (typeof renderBlog === "function") {
      renderBlog();
    }
}

function setLang(lang) {
    currentLang = lang;
    applyLang();
}

function updateContent() {
    if (!langData[currentLang]) return;
    document.querySelectorAll("[data-key]").forEach(el => {
      const key = el.dataset.key;
      const value = key
        .split(".")
        .reduce((o, i) => o?.[i], langData[currentLang]);
  
      if (value) el.textContent = value;
    });
}