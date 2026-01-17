function loadPartial(selector, url, callback) {
    fetch(url)
      .then(res => res.text())
      .then(html => {
        document.querySelector(selector).innerHTML = html;
        if (callback) callback();
      });
  }

function highlightActivePage() {
const page = location.pathname.split("/").pop() || "index.html";

document.querySelectorAll(".main-nav a").forEach(link => {
    const href = link.getAttribute("href");
    link.classList.toggle("active", href === page);
});
}

function initMobileMenu() {
const burger = document.querySelector(".burger");
const nav = document.querySelector(".mobile-nav");

if (!burger || !nav) return;

    burger.addEventListener("click", () => {
        nav.classList.toggle("open");
    });

    nav.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
        nav.classList.remove("open");
        });
});
}