const fs = require('fs');
const path = require('path');

console.log('Running pre-build verification...');

// Check that all import paths are correctly mapped
// This focuses on the specific error you're encountering
function checkImportPaths() {
  console.log('Checking import paths...');
  
  const criticalFiles = [
    'src/app/dashboard/page.tsx'
  ];
  
  criticalFiles.forEach(filePath => {
    const fullPath = path.join(process.cwd(), filePath);
    
    if (fs.existsSync(fullPath)) {
      console.log(`Checking imports in ${filePath}...`);
      const content = fs.readFileSync(fullPath, 'utf8');
      
      // Check for @/components/ui/alert import
      if (content.includes('@/components/ui/alert')) {
        console.log(`- Found @/components/ui/alert import in ${filePath}`);
        
        // Verify that the corresponding file exists
        const alertPath = path.join(process.cwd(), 'src/components/ui/alert.tsx');
        if (!fs.existsSync(alertPath)) {
          console.error(`ERROR: @/components/ui/alert is imported but src/components/ui/alert.tsx does not exist!`);
          process.exit(1);
        }
      }
    } else {
      console.log(`File ${filePath} does not exist, skipping...`);
    }
  });
}

// Generate a report of the workspace structure
function generateWorkspaceReport() {
  const srcPath = path.join(process.cwd(), 'src');
  const componentsPath = path.join(srcPath, 'components');
  
  console.log('\nWorkspace structure report:');
  
  if (fs.existsSync(srcPath)) {
    console.log('- src/ directory exists');
    
    if (fs.existsSync(componentsPath)) {
      console.log('- src/components/ directory exists');
      
      const uiPath = path.join(componentsPath, 'ui');
      if (fs.existsSync(uiPath)) {
        console.log('- src/components/ui/ directory exists');
        
        // List UI components
        const uiComponents = fs.readdirSync(uiPath);
        console.log(`  - Found ${uiComponents.length} UI components:`);
        uiComponents.forEach(comp => {
          console.log(`    - ${comp}`);
        });
      } else {
        console.log('- src/components/ui/ directory DOES NOT exist');
      }
    } else {
      console.log('- src/components/ directory DOES NOT exist');
    }
  } else {
    console.log('- src/ directory DOES NOT exist');
  }
}

// Run checks
checkImportPaths();
generateWorkspaceReport();

console.log('\nPre-build verification complete.');
console.log('If you still encounter issues with imports, make sure all required components are properly set up.');

// Exit with success
process.exit(0); 