const fs = require('fs');
const path = require('path');

console.log('Verifying component paths...');

// Check paths that should exist
const criticalPaths = [
  'src/components/ui/alert.tsx',
  'src/components/ui/button.tsx',
  'src/components/ui/card.tsx',
  'src/components/ui/table.tsx'
];

let allPathsExist = true;

criticalPaths.forEach(componentPath => {
  const fullPath = path.join(process.cwd(), componentPath);
  const exists = fs.existsSync(fullPath);
  
  console.log(`Checking ${componentPath}: ${exists ? 'EXISTS' : 'MISSING'}`);
  
  if (!exists) {
    allPathsExist = false;
  }
});

if (!allPathsExist) {
  console.error('ERROR: Some critical component paths are missing!');
  process.exit(1);
} else {
  console.log('All critical component paths exist.');
} 