// This is a simple starter script that runs the server directly
const { spawn } = require('child_process');
const path = require('path');

console.log('Starting Next.js application...');

// Start the server.js file directly
const server = spawn('node', ['server.js'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_ENV: 'production',
  },
});

// Handle errors
server.on('error', (err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

// Handle server exit
server.on('close', (code) => {
  console.log(`Server exited with code ${code}`);
  process.exit(code);
});

process.on('SIGINT', () => {
  console.log('Received SIGINT. Shutting down server...');
  server.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM. Shutting down server...');
  server.kill('SIGTERM');
}); 