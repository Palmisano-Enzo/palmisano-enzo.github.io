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
    allProjects = parseCsv(csv).map(([lang, title, subtitle, description, date, link, tags, imageFolder]) => ({
      lang,
      title,
      subtitle,
      description,
      date,
      link,
      tags,
      imageFolder
    }));

    return Promise.all(allProjects.map(async project => {
      project.coverImage = await loadCoverImage(project.imageFolder);
    }));
  })
  .then(() => {
    renderBlog();
  })
  .catch(error => console.error("Erreur de chargement des projets :", error));

async function loadCoverImage(imageFolder) {
  if (!imageFolder) return "assets/placeholder.png";

  const folder = `assets/${encodeURIComponent(imageFolder)}`;
  try {
    const response = await fetch(`${folder}/images.json`);
    if (!response.ok) throw new Error(`Chargement du manifeste impossible (${response.status})`);
    const images = await response.json();
    if (!Array.isArray(images) || images.length === 0) return "assets/placeholder.png";
    return `${folder}/${encodeURIComponent(images[0])}`;
  } catch (error) {
    console.error(`Erreur de chargement de la couverture ${imageFolder} :`, error);
    return "assets/placeholder.png";
  }
}

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
      article.style.backgroundImage = `url("${project.coverImage}")`;
      article.innerHTML = `
        <div class="project-card-caption">
          <h2 class="project-title">${project.title}</h2>
          <h3 class="project-subtitle">${project.subtitle}</h3>
        </div>
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

async function openProject(project) {
  const overlay = document.getElementById("project-overlay");
  if (!overlay) return;

  const content = overlay.querySelector(".overlay-content");
  content.innerHTML = `
    <button class="overlay-close" aria-label="Fermer">&times;</button>
    <div class="overlay-media" aria-label="Galerie d’images">
      ${project.imageFolder ? "" : '<img src="assets/placeholder.png" alt="Image non disponible">'}
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

  const media = content.querySelector(".overlay-media");
  if (!project.imageFolder) return;

  try {
    const folder = `assets/${encodeURIComponent(project.imageFolder)}`;
    const response = await fetch(`${folder}/images.json`);
    if (!response.ok) throw new Error(`Chargement du manifeste impossible (${response.status})`);

    const images = await response.json();
    if (!Array.isArray(images) || images.length === 0) return;

    media.innerHTML = `
      <button class="slider-control slider-previous" aria-label="Image précédente">&#10094;</button>
      <img class="slider-image" src="" alt="${project.title}">
      <button class="slider-control slider-next" aria-label="Image suivante">&#10095;</button>
      <span class="slider-counter" aria-live="polite"></span>
    `;

    let currentIndex = 0;
    const image = media.querySelector(".slider-image");
    const counter = media.querySelector(".slider-counter");
    const showImage = index => {
      currentIndex = (index + images.length) % images.length;
      image.src = `${folder}/${encodeURIComponent(images[currentIndex])}`;
      counter.textContent = `${currentIndex + 1} / ${images.length}`;
    };

    media.querySelector(".slider-previous").addEventListener("click", () => showImage(currentIndex - 1));
    media.querySelector(".slider-next").addEventListener("click", () => showImage(currentIndex + 1));
    showImage(0);
  } catch (error) {
    console.error(`Erreur de chargement des images pour ${project.title} :`, error);
  }
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
