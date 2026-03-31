document.addEventListener('DOMContentLoaded', function () {
  const current = window.location.pathname.split('/').pop() || 'index.html';

  for (const link of document.querySelectorAll('.nav-links a')) {
    const href = link.getAttribute('href');
    if (href === current || (current === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  }

  const copyrightEl = document.getElementById('copyright-date');
  if (copyrightEl) {
    const now = new Date();
    const month = now.toLocaleString('en-US', { month: 'long' });
    copyrightEl.textContent = `${month} ${now.getFullYear()}`;
  }

  const root = document.documentElement;
  const toggle = document.getElementById('theme-toggle');
  const label = document.getElementById('theme-label');

  function readUrlTheme() {
    try {
      const params = new URLSearchParams(window.location.search);
      const value = params.get('theme');
      return value === 'dark' || value === 'light' ? value : null;
    } catch (e) {
      return null;
    }
  }

  function readSavedTheme() {
    try {
      const saved = localStorage.getItem('site-theme');
      return saved === 'dark' || saved === 'light' ? saved : null;
    } catch (e) {
      return null;
    }
  }

  function applyTheme(theme) {
    const dark = theme === 'dark';
    if (dark) {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }
    if (toggle) toggle.checked = dark;
    if (label) label.textContent = dark ? 'Night' : 'Light';
  }

  function saveTheme(theme) {
    try {
      localStorage.setItem('site-theme', theme);
    } catch (e) {}
  }

  function updateInternalLinks(theme) {
    const links = document.querySelectorAll('a[href]');
    links.forEach((link) => {
      const rawHref = link.getAttribute('href');
      if (!rawHref) return;
      if (rawHref.startsWith('#')) return;
      if (rawHref.startsWith('mailto:')) return;
      if (rawHref.startsWith('http://') || rawHref.startsWith('https://')) return;
      if (rawHref.startsWith('javascript:')) return;

      const parts = rawHref.split('#');
      const pathAndQuery = parts[0];
      const hash = parts[1] ? '#' + parts[1] : '';
      const queryParts = pathAndQuery.split('?');
      const pathname = queryParts[0];
      const params = new URLSearchParams(queryParts[1] || '');
      params.set('theme', theme);
      link.setAttribute('href', pathname + '?' + params.toString() + hash);
    });
  }

  const initialTheme = readUrlTheme() || readSavedTheme() || 'light';
  applyTheme(initialTheme);
  saveTheme(initialTheme);
  updateInternalLinks(initialTheme);

  if (toggle) {
    toggle.addEventListener('change', function () {
      const theme = toggle.checked ? 'dark' : 'light';
      applyTheme(theme);
      saveTheme(theme);
      updateInternalLinks(theme);
      try {
        const url = new URL(window.location.href);
        url.searchParams.set('theme', theme);
        history.replaceState({}, '', url.toString());
      } catch (e) {}
    });
  }
});
