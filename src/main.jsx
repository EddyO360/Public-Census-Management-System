import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

console.log('Main.jsx loaded successfully');

try {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  console.log('Root element found:', root);
  
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log('App rendered successfully');
} catch (error) {
  console.error('Error rendering app:', error);
} 