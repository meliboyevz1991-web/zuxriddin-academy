(function () {
  'use strict';
  const tests = Array.isArray(window.ZUX_TESTS) ? window.ZUX_TESTS : [];
  const subject = document.body.dataset.subject || '';
  const list = document.getElementById('test-list');
  const counts = document.querySelectorAll('[data-count]');

  for (const el of counts) {
    const s = el.dataset.count;
    const n = tests.filter(t => t.subject === s).length;
    el.textContent = n + ' ta test';
  }

  for (const el of document.querySelectorAll('[data-count-level]')) {
    const levelCount = el.dataset.countLevel;
    const count = tests.filter(t => t.subject === 'grammar' && t.level === levelCount).length;
    el.textContent = count + ' ta dars-test';
  }

  if (!list) return;
  const requested = (new URLSearchParams(location.search).get('level') || '').toUpperCase();
  const level = ['A1','A2','B1','B2','C1','C2'].includes(requested) ? requested : '';
  const subjectTests = tests.filter(t => !subject || t.subject === subject);
  const shown = subjectTests.filter(t => !level || t.level === level);
  const order = ['A1','A2','B1','B2','C1','C2'];
  shown.sort((a,b) => subject ? (order.indexOf(a.level)-order.indexOf(b.level) || (subject === 'grammar' ? a.url.localeCompare(b.url) : b.url.localeCompare(a.url))) : b.url.split('/').pop().localeCompare(a.url.split('/').pop()));

  const filters = document.getElementById('level-filters');
  for (const tile of document.querySelectorAll('.grammar-level-tile')) {
    const tileLevel = new URL(tile.href, location.href).searchParams.get('level');
    if (level === tileLevel) tile.classList.add('selected');
  }
  if (filters && subject) {
    const makeFilter = (value, name) => {
      const a = document.createElement('a');
      a.href = value ? '?level=' + encodeURIComponent(value) : location.pathname.split('/').pop();
      a.textContent = name;
      if (level === value) a.className = 'active';
      filters.append(a);
    };
    makeFilter('', 'Barchasi');
    order.forEach(item => makeFilter(item,item));
  }

  if (!shown.length) {
    const p = document.createElement('p');
    p.className = 'muted-notice';
    p.textContent = 'Hozircha bu yerda test yo‘q. Yangi HTML test GitHub’ga yuklanganda avtomatik paydo bo‘ladi.';
    list.append(p);
    return;
  }
  const fragment = document.createDocumentFragment();
  for (const test of shown) {
    const item = document.createElement('a');
    item.className = 'test-item';
    item.href = test.url; // Paths are stored relative to website root, not domain root.
    const left = document.createElement('span');
    const title = document.createElement('strong');
    title.textContent = test.title;
    const detail = document.createElement('small');
    detail.textContent = test.subject.charAt(0).toUpperCase() + test.subject.slice(1) + ' • ' + test.level + ' level';
    left.append(title,detail);
    const completed = window.ZUX_PROGRESS && window.ZUX_PROGRESS.get().find(r => r.id === test.url);
    if (completed) {
      const previous = document.createElement('small');
      previous.className = 'completed-score';
      previous.textContent = '✓ Oxirgi natija: ' + completed.score + '/' + completed.total;
      left.append(previous);
    }
    const badge = document.createElement('span');
    badge.className = 'pill';
    badge.textContent = (test.url === 'grammar-a2-everyday-grammar.html' || /^grammar-(b1|b2|c1)-\d{2}-/.test(test.url)) ? 'Dars + Test →' : 'Boshlash →';
    item.append(left,badge);
    fragment.append(item);
  }
  list.append(fragment);
})();
