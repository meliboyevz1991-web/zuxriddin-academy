// Always load the freshly published test list, then render the pages.
(function () {
  'use strict';
  const catalog = document.createElement('script');
  catalog.src = 'testlar.js?v=' + Date.now();
  catalog.onload = function () {
    const app = document.createElement('script');
    app.src = 'app.js';
    document.body.appendChild(app);
  };
  catalog.onerror = function () {
    const list = document.getElementById('test-list');
    if (list) list.textContent = 'Testlar ro‘yxatini yuklashda xato. Sahifani qayta yangilang.';
  };
  document.body.appendChild(catalog);
})();
