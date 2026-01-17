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

function decreaseLogoSizeOnScroll() {
    const logo = document.querySelector(".header-logo img");
    if (!logo) return;
    
    logo.classList.toggle("is-scrolled", window.scrollY > 50);
}
window.addEventListener("scroll", decreaseLogoSizeOnScroll, false);