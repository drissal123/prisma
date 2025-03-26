const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Permanently installing required dependencies...');

// Read the current package.json
const packageJsonPath = path.join(process.cwd(), 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Required dependencies with versions
const requiredDeps = {
  dependencies: {
    'tailwindcss': '^3.3.0',
    'autoprefixer': '^10.4.14',
    'postcss': '^8.4.27',
    'class-variance-authority': '^0.7.0',
    'clsx': '^2.0.0',
    'tailwind-merge': '^1.14.0',
    'tailwindcss-animate': '^1.0.6',
    '@radix-ui/react-slot': '^1.0.2'
  }
};

// Check if dependencies need to be added
let dependenciesChanged = false;

// Process dependencies
Object.entries(requiredDeps.dependencies).forEach(([dep, version]) => {
  if (!packageJson.dependencies[dep] && !packageJson.devDependencies[dep]) {
    console.log(`Adding ${dep}@${version} to dependencies...`);
    packageJson.dependencies[dep] = version;
    dependenciesChanged = true;
  } else {
    console.log(`✓ ${dep} is already in package.json`);
  }
});

// Save changes if needed
if (dependenciesChanged) {
  console.log('Saving updated package.json...');
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  
  console.log('Running npm install to update node_modules...');
  try {
    execSync('npm install', { stdio: 'inherit' });
    console.log('Dependencies successfully installed.');
  } catch (error) {
    console.error('Error installing dependencies:', error.message);
    process.exit(1);
  }
} else {
  console.log('No changes needed to package.json');
}

// Now make sure the postcss.config.js file exists (not .mjs)
const postcssPath = path.join(process.cwd(), 'postcss.config.js');
if (!fs.existsSync(postcssPath)) {
  console.log('Creating postcss.config.js...');
  const postcssContent = `
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
  `.trim();
  
  fs.writeFileSync(postcssPath, postcssContent);
  console.log('Created postcss.config.js');
}

// Ensure tailwind.config.js exists (not .ts)
const tailwindPath = path.join(process.cwd(), 'tailwind.config.js');
if (!fs.existsSync(tailwindPath)) {
  console.log('Creating tailwind.config.js...');
  const tailwindContent = `
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
  `.trim();
  
  fs.writeFileSync(tailwindPath, tailwindContent);
  console.log('Created tailwind.config.js');
}

console.log('All dependencies and configuration files are properly set up.');
process.exit(0); 