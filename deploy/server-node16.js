// Node.js 16 Compatible Server
const http = require('http');
const { parse } = require('url');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

// Constants
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'production';

// Create a simple HTTP server
const server = http.createServer((req, res) => {
  const parsedUrl = parse(req.url, true);
  
  // Simple healthcheck endpoint
  if (parsedUrl.pathname === '/healthcheck') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', nodeVersion: process.version }));
    return;
  }
  
  // For all other requests, delegate to the Next.js static files
  serveNextAssets(req, res, parsedUrl);
});

// Serve static Next.js assets
function serveNextAssets(req, res, parsedUrl) {
  // Determine if the path is to a static asset
  const staticPath = path.join(process.cwd(), '.next', 'static', parsedUrl.pathname);
  
  if (fs.existsSync(staticPath) && fs.statSync(staticPath).isFile()) {
    // Set appropriate content type
    const ext = path.extname(staticPath).toLowerCase();
    const contentType = getContentType(ext);
    
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(staticPath).pipe(res);
  } else {
    // For dynamic routes, use the standalone server
    useNextCliServer(req, res);
  }
}

// Content type mapping
function getContentType(ext) {
  const types = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml'
  };
  
  return types[ext] || 'application/octet-stream';
}

// Use Next.js CLI to handle requests
let nextServerProcess = null;

function useNextCliServer(req, res) {
  if (!nextServerProcess) {
    console.log('Starting Next.js server via CLI...');
    
    // Start the Next.js server in a separate process
    nextServerProcess = spawn('npx', ['next', 'start', '-p', '3001'], {
      env: { ...process.env, NODE_ENV },
      stdio: 'pipe'
    });
    
    // Log stdout and stderr
    nextServerProcess.stdout.on('data', (data) => {
      console.log(`Next.js stdout: ${data}`);
    });
    
    nextServerProcess.stderr.on('data', (data) => {
      console.error(`Next.js stderr: ${data}`);
    });
    
    // Handle process exit
    nextServerProcess.on('close', (code) => {
      console.log(`Next.js server process exited with code ${code}`);
      nextServerProcess = null;
    });
    
    // Give Next.js time to start
    setTimeout(() => {
      console.log('Next.js server should be ready now');
    }, 5000);
  }
  
  // Proxy the request to the Next.js server
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: req.url,
    method: req.method,
    headers: req.headers
  };
  
  const proxyReq = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  });
  
  proxyReq.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Internal Server Error');
  });
  
  req.pipe(proxyReq);
}

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Node.js version: ${process.version}`);
  console.log(`Environment: ${NODE_ENV}`);
});

// Handle graceful shutdown
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

function shutdown() {
  console.log('Shutting down server...');
  
  if (nextServerProcess) {
    nextServerProcess.kill();
  }
  
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
} 