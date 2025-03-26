module.exports = {
  apps: [
    {
      name: 'response-api',
      script: 'server.js',
      env: {
        NODE_ENV: 'production',
        PORT: process.env.PORT || 3000,
      },
      watch: false,
      max_memory_restart: '200M',
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
    },
  ],
}; 