let langData = {};
let currentLang = "fr";

fetch("data/lang.json")
  .then(res => res.json())
  .then(data => {
    langData = data;
    setLang(currentLang);
  });

document.querySelectorAll(".lang-switch button").forEach(btn => {
    btn.addEventListener("click", () => {
      setLang(btn.dataset.lang);
    });
  });

  function setLang(lang) {
    currentLang = lang;
    localStorage.setItem("lang", lang);
    document.documentElement.lang = lang;
  
    document.querySelectorAll(".lang-switch button").forEach(btn => {
      btn.classList.remove("active");
    });
  
    document
    .querySelector(`[data-lang="${lang}"]`)
    .classList.add("active");
  
    updateContent();

    if (typeof renderBlog === "function") {
        renderBlog();
      }
  }

function updateContent() {
  document.querySelectorAll("[data-key]").forEach(el => {
    const key = el.getAttribute("data-key");
    const value = key.split(".").reduce((obj, i) => obj[i], langData[currentLang]);
    el.textContent = value;
  });
}