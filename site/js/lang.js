let langData = {};
let currentLang = "fr";

fetch("data/lang.json")
  .then(res => res.json())
  .then(data => {
    langData = data;
    updateContent();
  });

  function setLang(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;
  
    document.querySelectorAll(".lang-switch button").forEach(btn => {
      btn.classList.remove("active");
    });
  
    document.querySelector(`[onclick="setLang('${lang}')"]`).classList.add("active");
  
    updateContent();
  }

function updateContent() {
  document.querySelectorAll("[data-key]").forEach(el => {
    const key = el.getAttribute("data-key");
    const value = key.split(".").reduce((obj, i) => obj[i], langData[currentLang]);
    el.textContent = value;
  });
}