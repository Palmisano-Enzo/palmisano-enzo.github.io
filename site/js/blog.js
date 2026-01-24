const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vT8mMR3ytIGeUkrsZWK5c_ippRYVLLjQcG_5BPeqcwYjl1FgH0AdQYUszWGlu-f_0aN0VIiY_djDvhv/pub?gid=0&single=true&output=tsv";

let allProjects = [];

  fetch(SHEET_URL)
  .then(res => res.text())
  .then(tsv => {
    const rows = tsv.split("\n").slice(1);
    allProjects = rows.map(row => {
      const [lang, title, subtitle, description, date, link, tags, image] =
        row.split("\t").map(cell => cell.trim());

      return {lang, title, subtitle, description, date, link, tags, image };
    });

    renderBlog();
  })
  .catch(err => console.error("Erreur Google Sheet:", err));

function renderBlog() {
  const container = document.getElementById("projets");
  if (!container) return;

  container.innerHTML = "";

  allProjects
    .filter(p => p.lang === currentLang)
    .forEach(p => {
        const article = document.createElement("article");

        article.innerHTML = `
        <h2 class="project-title">${p.title}</h2>
        <h3 class="project-subtitle">${p.subtitle}</h3>
        <div class="project-content">
        <p>${p.description}</p>
        <small>${p.date}</small>
        ${p.link ? `<a href="${p.link}" target="_blank">Voir →</a>` : ""}
        </div>
        `;

        article.addEventListener("click", () => {
            openProject(p);
          });

    container.appendChild(article);
  });

}

function openProject(project) {
    const overlay = document.getElementById("project-overlay");
    const content = overlay.querySelector(".overlay-content");
  
    content.innerHTML = `
      <div class="overlay-media">
        <img src="${project.image || 'assets/placeholder.png'}" alt="">
      </div>
      <div class="overlay-body">
        <h2>${project.title}</h2>
        <h3>${project.subtitle}</h3>
        <p>${project.description}</p>
        <small>${project.date}</small><br>
        ${project.link ? `<a href="${project.link}" target="_blank">Voir →</a>` : ""}
      </div>
    `;
  
    overlay.classList.add("open");
  }

  document.getElementById("project-overlay").addEventListener("click", e => {
    if (e.target.id === "project-overlay") {
      e.currentTarget.classList.remove("open");
    }
  });
  
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      document.getElementById("project-overlay").classList.remove("open");
    }
  });
