import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const VERSION_HASH = 'iceberg-v1';
const CACHE_PREFIX = 'iceberg-pwa-';
const CURRENT_CACHE_NAME = `${CACHE_PREFIX}${VERSION_HASH}`;

const handleContextMenu = (e) => {
  e.preventDefault();
};

const handleKeyDown = (e) => {
  if (e.keyCode === 123) e.preventDefault();
  if (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) e.preventDefault();
  if (e.ctrlKey && e.keyCode === 85) e.preventDefault();
  if (e.metaKey && e.altKey && e.keyCode === 73) e.preventDefault();
};

window.addEventListener('contextmenu', handleContextMenu, { capture: true });
window.addEventListener('keydown', handleKeyDown, { capture: true });

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

if ('serviceWorker' in navigator) {
  let hasForcedReload = false;

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then(() => {
        if ('caches' in window) {
          caches
            .keys()
            .then((keys) => {
              const appCaches = keys.filter((key) => key.startsWith(CACHE_PREFIX));
              const hasCurrent = appCaches.includes(CURRENT_CACHE_NAME);
              const hasOther = appCaches.some((key) => key !== CURRENT_CACHE_NAME);

              if (hasOther && !hasCurrent) {
                return Promise.all(
                  appCaches.map((key) => caches.delete(key)),
                ).then(() => {
                  if (hasForcedReload) return;
                  hasForcedReload = true;
                  window.location.reload();
                });
              }

              return undefined;
            })
            .catch(() => {});
        }

        navigator.serviceWorker.addEventListener('controllerchange', () => {
          try {
            if (hasForcedReload) return;
            hasForcedReload = true;
            window.location.reload();
          } catch (_) {}
        });
      })
      .catch(() => {});
  });
}
