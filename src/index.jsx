import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app.jsx'; // Import your main App component

// Get the root DOM element where our React app will be rendered
const rootElement = document.getElementById('root');

// Create a React root
const root = ReactDOM.createRoot(rootElement);

// Render the App component into the root
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
