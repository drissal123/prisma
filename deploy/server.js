const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

// Get port from environment or default to 3000
const port = parseInt(process.env.PORT || '3000', 10);

// Create the Next.js app
const app = next({
  dir: '.',
  dev: false,
  hostname: 'localhost',
  port,
});

// Get the request handler
const handle = app.getRequestHandler();

// Prepare the app then start the server
app.prepare().then(() => {
  createServer((req, res) => {
    // Parse the URL
    const parsedUrl = parse(req.url, true);
    
    // Let Next.js handle the request
    handle(req, res, parsedUrl);
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on port ${port}`);
  });
}); 