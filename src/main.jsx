import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles.css';
import './totoro.css';

const container = document.getElementById('root');
if (!container) {
  throw new Error('Lofi Memory root container not found.');
}

try {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  console.error('Failed to mount Lofi Memory:', error);
  container.innerHTML = `
    <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:#fffaf2;color:#2f4535;padding:24px;font-family:Inter,system-ui,sans-serif;text-align:center;">
      <div style="max-width:520px;background:#fff;border:1px solid #e3d6c5;border-radius:24px;padding:32px;box-shadow:0 12px 30px rgba(61,48,37,0.08);">
        <h1 style="margin:0 0 12px;font-size:28px;font-weight:800;color:#33513f;">Lofi Memory needs a quick refresh</h1>
        <p style="margin:0 0 20px;line-height:1.7;color:#556a5f;">This quiet space did not finish loading in this browser session. Please refresh the page, and your cozy journaling room will be ready again.</p>
        <a href="./app.html" style="display:inline-flex;border-radius:999px;background:#5f8354;color:white;padding:12px 22px;text-decoration:none;font-weight:700;">Refresh Lofi Memory</a>
      </div>
    </div>
  `;
}
