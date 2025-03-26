// Simple Express server for Node.js 16
// This doesn't use any Next.js APIs directly
const express = require('express');
const path = require('path');
const fs = require('fs');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from .next/static
app.use('/_next/static', express.static(path.join(__dirname, '.next/static')));

// Serve public files
app.use(express.static(path.join(__dirname, 'public')));

// For all other requests, serve the pre-rendered HTML files
app.get('*', (req, res) => {
  const pathname = req.path === '/' ? '/index' : req.path;
  
  // Try to serve static HTML
  const htmlPath = path.join(__dirname, '.next/server/pages', `${pathname}.html`);
  
  if (fs.existsSync(htmlPath)) {
    return res.sendFile(htmlPath);
  }
  
  // If no static file, send the 404 page
  const notFoundPath = path.join(__dirname, '.next/server/pages/404.html');
  
  if (fs.existsSync(notFoundPath)) {
    return res.status(404).sendFile(notFoundPath);
  }
  
  // Fallback if no 404 page
  res.status(404).send('Page not found');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Node.js version: ${process.version}`);
}); 