const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#navigation');
menu.hidden = false;
nav.classList.add('enhanced');
function closeMenu() {
  menu.setAttribute('aria-expanded', 'false');
  nav.classList.remove('open');
}
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  nav.classList.toggle('open', open);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menu.focus();
  }
});
document.addEventListener('click', event => {
  if (!event.target.closest('.site-header')) closeMenu();
});

const form = document.querySelector('#publication-filters');
if (form) {
  form.hidden = false;
  const search = form.querySelector('input');
  const year = form.querySelector('select');
  const articles = [...document.querySelectorAll('.publication')];
  const groups = [...document.querySelectorAll('.publication-year')];
  const status = document.querySelector('#result-count');
  const empty = document.querySelector('#empty-results');
  const params = new URLSearchParams(location.search);
  search.value = params.get('q') || '';
  if ([...year.options].some(option => option.value === params.get('year'))) year.value = params.get('year');
  function applyFilters() {
    let count = 0;
    articles.forEach(article => {
      article.hidden = !matchesPublication(article.dataset.search, article.dataset.year, search.value, year.value);
      if (!article.hidden) count++;
    });
    groups.forEach(group => { group.hidden = ![...group.querySelectorAll('.publication')].some(article => !article.hidden); });
    status.textContent = `${count} of ${articles.length} publications`;
    empty.hidden = count !== 0;
    const next = new URLSearchParams();
    if (search.value.trim()) next.set('q', search.value.trim());
    if (year.value !== 'all') next.set('year', year.value);
    // file:// previews can disallow history updates; filtering still works there.
    try { history.replaceState(null, '', location.pathname + (next.size ? '?' + next.toString() : '') + location.hash); } catch {}
  }
  form.addEventListener('submit', event => event.preventDefault());
  form.addEventListener('input', applyFilters);
  form.addEventListener('change', applyFilters);
  form.addEventListener('reset', event => {
    event.preventDefault();
    search.value = '';
    year.value = 'all';
    applyFilters();
    search.focus();
  });
  applyFilters();
}
