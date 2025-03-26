#!/bin/bash

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "npm is not installed. Please install Node.js and npm first."
    exit 1
fi

# Install PM2 globally if not already installed
if ! command -v pm2 &> /dev/null; then
    echo "Installing PM2..."
    npm install -g pm2
    
    # Add PM2 to PATH if it's not automatically added
    export PATH="$PATH:$HOME/node_modules/.bin"
    echo "export PATH=\"\$PATH:\$HOME/node_modules/.bin\"" >> ~/.bashrc
    source ~/.bashrc
fi

# Navigate to the application directory (use the directory where this script is located)
cd "$(dirname "$0")"

# Install dependencies if they're not already installed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Check if Prisma client is generated
if [ ! -d "node_modules/.prisma" ]; then
    echo "Generating Prisma client..."
    npx prisma generate
fi

# Start the application
if command -v pm2 &> /dev/null; then
    echo "Starting application with PM2..."
    pm2 start server.js --name "response-api"
    pm2 save
else
    echo "PM2 installation failed. Starting application with Node.js..."
    node server.js
fi

echo "Application started. Check logs with 'pm2 logs response-api' if PM2 is available." 