#!/bin/bash

# This script sets up a Node.js 16 environment without requiring global packages

echo "Setting up Node.js 16 environment..."
echo "Current directory: $(pwd)"
echo "Node.js version: $(node -v)"
echo "NPM version: $(npm -v)"

# Install dependencies locally (not globally)
echo "Installing dependencies..."
npm install

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Check for PostgreSQL support (if needed)
if [[ "$DATABASE_URL" == postgresql://* ]]; then
  echo "PostgreSQL database detected, installing pg package..."
  npm install pg
fi

# Create a .env file if it doesn't exist
if [ ! -f .env ]; then
  echo "Creating default .env file..."
  cat > .env << EOL
# Environment Variables
NODE_ENV=production
PORT=3000
# Generate a random string for NEXTAUTH_SECRET if needed
NEXTAUTH_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
# Set the NEXTAUTH_URL to your domain
NEXTAUTH_URL=https://$(hostname)
# Set your database URL
DATABASE_URL="file:./prisma/dev.db"
EOL
  echo ".env file created. Please update with your actual values."
fi

# Instructions for starting the server
echo ""
echo "===== SETUP COMPLETE ====="
echo ""
echo "To start the server, run:"
echo "node simple-server.js"
echo ""
echo "For background running, you can use 'nohup':"
echo "nohup node simple-server.js > output.log 2>&1 &"
echo ""
echo "To check if the server is running:"
echo "ps aux | grep node"
echo "" 