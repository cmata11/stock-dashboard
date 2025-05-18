import './style.css';
import { renderHome } from './pages/home.js';
import { renderAbout } from './pages/about.js';
import { renderStockSearch } from './pages/stock.js';

const routes = {
  '/': renderHome,
  '/about.html': renderAbout,
  '/stock.html': renderStockSearch,
};

function render(path = window.location.pathname) {
  const page = routes[path] || renderHome;
  page();
  history.pushState({}, '', path);
}

window.addEventListener('DOMContentLoaded', () => {
  render();
  document.querySelectorAll('a[data-route]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      render(link.getAttribute('data-route'));
    });
  });
});

window.addEventListener('popstate', () => render(window.location.pathname));
