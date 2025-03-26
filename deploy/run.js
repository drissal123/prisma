// Simple standalone runner
const { exec } = require('child_process');

// Function to run a command and log output
function runCommand(command) {
  return new Promise((resolve, reject) => {
    console.log(`Running: ${command}`);
    
    const process = exec(command, (error, stdout, stderr) => {
      if (stdout) console.log(stdout);
      if (stderr) console.error(stderr);
      
      if (error) {
        console.error(`Error: ${error.message}`);
        reject(error);
        return;
      }
      
      resolve();
    });
  });
}

// Main function to run everything
async function main() {
  try {
    // Make the start.sh script executable
    await runCommand('chmod +x start.sh');
    
    // Run the start script
    console.log('Starting application...');
    await runCommand('./start.sh');
    
  } catch (error) {
    console.error('Failed to start application:', error);
    
    // Fallback to direct node execution
    console.log('Attempting to start server directly...');
    await runCommand('node server.js');
  }
}

// Run the main function
main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
}); 