#!/bin/bash

echo "Fixing Apache web server configuration..."

# 1. Stop Node.js application if running
echo "Stopping any running Node.js applications..."
pkill -f "node simple-server.js" || echo "No Node.js processes found"

# 2. Check for .htaccess file in web root and back it up if it exists
if [ -f ~/public_html/.htaccess ]; then
  echo "Backing up .htaccess file..."
  cp ~/public_html/.htaccess ~/public_html/.htaccess.bak.$(date +"%Y%m%d%H%M%S")
  
  # 3. Remove or comment out the proxy rules that might be causing issues
  echo "Removing proxy rules from .htaccess..."
  sed -i '/RewriteRule.*localhost:3000/d' ~/public_html/.htaccess
  sed -i '/RewriteEngine On/d' ~/public_html/.htaccess
  
  echo ".htaccess file fixed."
else
  echo "No .htaccess file found in public_html."
fi

# 4. Check if there's a custom error page that might help identify issues
if [ -f ~/public_html/error_log ]; then
  echo "Last 5 lines of error_log:"
  tail -5 ~/public_html/error_log
fi

echo "Apache should now be restored. If problems persist, please contact InMotion Hosting support."
echo "You can still run your Node.js app separately without affecting the main website."

# Create proper instructions for future use
cat > ~/public_html/node/NODE-README.txt << EOL
NODE.JS APPLICATION USAGE

To start the Node.js application on a specific port without affecting the main website:
1. Edit the .env file and change the port:
   nano .env
   Change PORT=3000 to PORT=8080 (or another available port)

2. Start the application:
   ./start-background.sh

3. Access your application at:
   https://yourdomain.com:8080 (note the port number)

Note: You may need to ask InMotion support to open this port in the firewall.

To stop the application:
   ./stop.sh
EOL

echo "Created instructions file at ~/public_html/node/NODE-README.txt" 