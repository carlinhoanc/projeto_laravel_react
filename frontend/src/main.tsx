import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import App from './App';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
  },
});

console.log('React entry starting');

function showCriticalError(err: any) {
  try {
    const el = document.getElementById('app') || document.body;
    const banner = document.createElement('div');
    banner.style.background = '#ffdddd';
    banner.style.color = '#000';
    banner.style.padding = '10px';
    banner.style.whiteSpace = 'pre-wrap';
    banner.innerText = 'JavaScript error:\n' + (err && (err.stack || err.message || String(err)));
    el.prepend(banner);
  } catch (e) {
    console.error('Failed to show error banner', e);
  }
}

window.addEventListener('error', (e) => {
  console.error('Unhandled error', e.error || e.message);
  showCriticalError(e.error?.stack || e.message);
});
window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled rejection', e.reason);
  showCriticalError(e.reason?.stack || String(e.reason));
});

const rootEl = document.getElementById('app') || (function () {
  const d = document.createElement('div');
  d.id = 'app';
  document.body.appendChild(d);
  console.error('Root #app not found; fallback #app created');
  return d;
})();

const root = createRoot(rootEl);
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
