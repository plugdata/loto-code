// ===== SIMPLE HASH-BASED ROUTER =====
const routes = {};
let currentRoute = null;
let currentParams = {};
let isAuthenticated = false;

const publicRoutes = ['login', 'register'];

export function registerRoute(path, renderFn) {
  routes[path] = renderFn;
}

export function navigate(path) {
  window.location.hash = path;
}

export function getCurrentRoute() {
  return currentRoute;
}

export function getCurrentParams() {
  return currentParams;
}

export function setAuthenticated(value) {
  isAuthenticated = value;
}

function parseHash(hash) {
  const [route, queryString] = hash.split('?');
  const params = {};
  if (queryString) {
    queryString.split('&').forEach(pair => {
      const [key, value] = pair.split('=');
      if (key) params[decodeURIComponent(key)] = decodeURIComponent(value || '');
    });
  }
  return { route, params };
}

export function initRouter(defaultRoute = 'select') {
  function handleRoute() {
    const raw = window.location.hash.replace('#', '') || defaultRoute;
    const { route: hash, params } = parseHash(raw);

    // Auth guard
    if (!isAuthenticated && !publicRoutes.includes(hash)) {
      window.location.hash = 'login';
      return;
    }
    if (isAuthenticated && publicRoutes.includes(hash)) {
      window.location.hash = defaultRoute;
      return;
    }

    currentRoute = hash;
    currentParams = params;

    // Update nav active states
    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.route === hash);
    });

    // Show/hide app shell based on auth
    const appShell = document.getElementById('app-shell');
    const pageContent = document.getElementById('page-content');
    if (appShell) {
      appShell.style.display = isAuthenticated ? '' : 'none';
    }

    // Render the page
    if (pageContent && routes[hash]) {
      routes[hash](pageContent, params);
    }
  }

  window.addEventListener('hashchange', handleRoute);
  handleRoute();
}
