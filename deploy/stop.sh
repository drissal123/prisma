#!/bin/bash

echo "Stopping Node.js application..."

# Check if PID file exists
if [ -f server.pid ]; then
  PID=$(cat server.pid)
  echo "Found server process with PID: $PID"
  
  # Check if process is running
  if ps -p $PID > /dev/null; then
    echo "Killing process $PID..."
    kill $PID
    sleep 2
    
    # Check if it's still running and force kill if needed
    if ps -p $PID > /dev/null; then
      echo "Process still running, force killing..."
      kill -9 $PID
    fi
    
    echo "Process stopped successfully."
  else
    echo "Process is not running."
  fi
  
  # Remove PID file
  rm server.pid
else
  # No PID file, try to find by process name
  echo "No PID file found, trying to find process by name..."
  
  # Find all node processes running simple-server.js
  NODE_PIDS=$(ps aux | grep "[n]ode simple-server.js" | awk '{print $2}')
  
  if [ -n "$NODE_PIDS" ]; then
    echo "Found Node.js processes: $NODE_PIDS"
    
    # Kill each process
    for PID in $NODE_PIDS; do
      echo "Killing process $PID..."
      kill $PID
      sleep 1
    done
    
    echo "All processes stopped."
  else
    echo "No running Node.js processes found."
  fi
fi

echo "Application stopped." 