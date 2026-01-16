function loadPartial(selector, url, callback) {
    fetch(url)
      .then(res => res.text())
      .then(html => {
        document.querySelector(selector).innerHTML = 'html';
        if (callback) callback();
      });
  }