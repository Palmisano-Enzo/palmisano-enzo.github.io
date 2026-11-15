const PROJECTS_CSV_URL = "data/projects.csv";

let allProjects = [];

fetch(PROJECTS_CSV_URL)
  .then(response => {
    if (!response.ok) {
      throw new Error(`Chargement du CSV impossible (${response.status})`);
    }
    return response.text();
  })
  .then(csv => {
    allProjects = parseCsv(csv).map(([lang, title, subtitle, description, date, link, tags, image]) => ({
      lang,
      title,
      subtitle,
      description,
      date,
      link,
      tags,
      image
    }));

    renderBlog();
  })
  .catch(error => console.error("Erreur de chargement des projets :", error));

function parseCsv(csv) {
  const rows = [];
  let row = [];
  let cell = "";
  let insideQuotes = false;

  for (let i = 0; i < csv.length; i++) {
    const char = csv[i];

    if (char === '"') {
      if (insideQuotes && csv[i + 1] === '"') {
        cell += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === "," && !insideQuotes) {
      row.push(cell.trim());
      cell = "";
    } else if ((char === "\n" || char === "\r") && !insideQuotes) {
      if (char === "\r" && csv[i + 1] === "\n") i++;
      row.push(cell.trim());
      if (row.some(value => value !== "")) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }

  row.push(cell.trim());
  if (row.some(value => value !== "")) rows.push(row);

  return rows.slice(1);
}

function renderBlog() {
  const container = document.getElementById("projets");
  if (!container) return;

  container.innerHTML = "";

  allProjects
    .filter(project => project.lang === currentLang)
    .forEach(project => {
      const article = document.createElement("article");
      article.innerHTML = `
        <h2 class="project-title">${project.title}</h2>
        <h3 class="project-subtitle">${project.subtitle}</h3>
        <div class="project-content">
          <p>${project.description}</p>
          <small>${project.date}</small>
          ${project.link ? `<a href="${project.link}" target="_blank" rel="noopener noreferrer">Voir →</a>` : ""}
        </div>
      `;

      article.addEventListener("click", () => openProject(project));
      container.appendChild(article);
    });
}

function openProject(project) {
  const overlay = document.getElementById("project-overlay");
  if (!overlay) return;

  const content = overlay.querySelector(".overlay-content");
  content.innerHTML = `
    <button class="overlay-close" aria-label="Fermer">&times;</button>
    <div class="overlay-media">
      <img src="${project.image || "assets/placeholder.png"}" alt="">
    </div>
    <div class="overlay-body">
      <h2>${project.title}</h2>
      <h3>${project.subtitle}</h3>
      <p>${project.description}</p>
      <small>${project.date}</small><br>
      ${project.link ? `<a href="${project.link}" target="_blank" rel="noopener noreferrer">Voir →</a>` : ""}
    </div>
  `;

  overlay.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeOverlay() {
  const overlay = document.getElementById("project-overlay");
  if (!overlay) return;

  overlay.classList.remove("open");
  document.body.style.overflow = "";
}

document.addEventListener("click", event => {
  if (event.target.classList.contains("overlay-close")) {
    closeOverlay();
  }

  if (event.target.id === "project-overlay") {
    closeOverlay();
  }
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeOverlay();
  }
});
