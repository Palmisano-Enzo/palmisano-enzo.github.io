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