import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// 引入i18n配置
import './i18n';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 