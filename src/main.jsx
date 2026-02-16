import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

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
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}
