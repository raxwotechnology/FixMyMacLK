import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import axios from 'axios';
import './index.css';
import App from './App';

// Global handler for invalid / expired auth sessions
let isHandling401 = false;
function handleUnauthorizedSession() {
  if (isHandling401) return;
  isHandling401 = true;
  
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  localStorage.removeItem('username');
  localStorage.removeItem('role');
  localStorage.removeItem('cashierId');
  localStorage.removeItem('cashierName');

  const currentHash = window.location.hash || '';
  if (!currentHash.includes('login')) {
    alert('Your session has expired or is invalid. Please log in again.');
    window.location.hash = '#/cashier/login';
  }

  setTimeout(() => {
    isHandling401 = false;
  }, 2000);
}

// Intercept axios 401 responses
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      handleUnauthorizedSession();
    }
    return Promise.reject(error);
  }
);

// Intercept native fetch 401 responses
const originalFetch = window.fetch;
window.fetch = async (...args) => {
  const response = await originalFetch(...args);
  if (response.status === 401) {
    handleUnauthorizedSession();
  }
  return response;
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);
