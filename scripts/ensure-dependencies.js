const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Ensuring all required dependencies are installed...');

// Critical dependencies that must be available
const criticalDeps = [
  'tailwindcss',
  'autoprefixer',
  'postcss',
  'class-variance-authority',
  'clsx',
  'tailwind-merge',
  '@radix-ui/react-slot',
];

// Check if a package is installed
function isPackageInstalled(packageName) {
  try {
    const resolvedPath = require.resolve(packageName, { paths: [process.cwd()] });
    return true;
  } catch (err) {
    return false;
  }
}

// Install missing packages
function installMissingPackages(packageList) {
  if (packageList.length === 0) {
    console.log('All required packages are already installed.');
    return;
  }
  
  console.log(`Installing missing packages: ${packageList.join(', ')}`);
  
  try {
    // Force install to bypass peer dependencies issues
    execSync(`npm install --no-save ${packageList.join(' ')}`, {
      stdio: 'inherit',
      cwd: process.cwd()
    });
    console.log('Successfully installed missing packages.');
  } catch (error) {
    console.error('Failed to install packages:', error.message);
    process.exit(1);
  }
}

// Verify each package and collect missing ones
const missingPackages = [];

for (const dep of criticalDeps) {
  if (!isPackageInstalled(dep)) {
    missingPackages.push(dep);
    console.log(`Missing critical dependency: ${dep}`);
  } else {
    console.log(`✓ ${dep} is installed`);
  }
}

// Install any missing packages
if (missingPackages.length > 0) {
  installMissingPackages(missingPackages);
}

// Ensure postcss.config.mjs exists and has correct content
const postcssPath = path.join(process.cwd(), 'postcss.config.mjs');
if (!fs.existsSync(postcssPath)) {
  console.log('Creating postcss.config.mjs...');
  const postcssContent = `
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
  `.trim();
  
  fs.writeFileSync(postcssPath, postcssContent);
  console.log('Created postcss.config.mjs');
}

// Ensure tailwind.config.ts exists with correct content
const tailwindPath = path.join(process.cwd(), 'tailwind.config.ts');
if (!fs.existsSync(tailwindPath)) {
  console.log('Creating tailwind.config.ts...');
  const tailwindContent = `
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
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
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
  `.trim();
  
  fs.writeFileSync(tailwindPath, tailwindContent);
  console.log('Created tailwind.config.ts');
}

console.log('All dependencies and configuration files are ready.');
process.exit(0); 