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
      <h2>${p.title}</h2>
      <h3>${p.subtitle}</h3>
      <p>${p.description}</p>
      <small>${p.date}</small>
      ${p.link ? `<a href="${p.link}" target="_blank">Voir →</a>` : ""}
    `;

    container.appendChild(article);
  });
}
