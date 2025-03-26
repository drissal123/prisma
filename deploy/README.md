# Deployment Guide for InMotion Hosting

This guide will help you deploy your Next.js application on InMotion Hosting using Node.js 16.

## Prerequisites

- InMotion Hosting account with Node.js 16 available
- SSH access to your hosting account
- A domain or subdomain pointing to your InMotion hosting

## Deployment Steps

### 1. Upload Files

Upload the `deploy.zip` file to your hosting account using FTP or the File Manager in cPanel, then extract it.

### 2. Install PM2 (Process Manager)

```bash
# SSH into your server
ssh username@your-domain.com

# Navigate to your home directory
cd ~

# Install PM2 globally (if not already installed)
npm install -g pm2
```

### 3. Configure Environment Variables

Create a `.env` file in your application directory:

```bash
cd path/to/extracted/files
nano .env
```

Add the following content (replace with your actual values):

```
NEXTAUTH_SECRET=your_random_secret_here
NEXTAUTH_URL=https://your-domain.com
DATABASE_URL=your_database_connection_string
```

Save and exit (Ctrl+X, then Y, then Enter).

### 4. Initialize Database

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push
```

### 5. Start the Application

```bash
# Start the application with PM2
pm2 start ecosystem.config.js

# Make PM2 start on server reboot
pm2 save
pm2 startup
```

### 6. Configure Reverse Proxy (if needed)

If your application runs on a port (e.g., 3000) but you want it accessible via your domain, you'll need to set up a reverse proxy.

For Apache (commonly used on InMotion), create or edit `.htaccess` in your web root:

```
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteRule ^(.*)$ http://localhost:3000/$1 [P,L]
</IfModule>
```

### 7. Monitoring and Logs

To view logs:
```bash
pm2 logs response-api
```

To monitor the application:
```bash
pm2 monit
```

### 8. Updating the Application

For future updates:
```bash
# Navigate to your app directory
cd path/to/app

# Stop the current instance
pm2 stop response-api

# Replace files (upload new version)
# ...

# Start the application again
pm2 start ecosystem.config.js
```

## Troubleshooting

- If you encounter permission issues, try `chmod +x start.js server.js`
- If the port is in use, change it in `ecosystem.config.js`
- Check the logs for any errors: `pm2 logs response-api` 