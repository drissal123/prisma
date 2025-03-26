#!/bin/bash

# Current timestamp for log files
TIMESTAMP=$(date +"%Y%m%d-%H%M%S")

# Kill any existing server processes
echo "Checking for existing server processes..."
pkill -f "node simple-server.js" || echo "No existing process found"

# Wait a moment for processes to terminate
sleep 2

# Create logs directory if it doesn't exist
mkdir -p logs

# Start the server in the background
echo "Starting server in background..."
nohup node simple-server.js > "logs/server-$TIMESTAMP.log" 2>&1 &

# Store the process ID
PID=$!
echo $PID > server.pid
echo "Server started with PID: $PID"
echo "Log file: logs/server-$TIMESTAMP.log"

# Verify the server started correctly
sleep 5
if ps -p $PID > /dev/null; then
  echo "Server is running successfully!"
  echo "To check logs: tail -f logs/server-$TIMESTAMP.log"
else
  echo "Server failed to start. Check the log file."
fi 