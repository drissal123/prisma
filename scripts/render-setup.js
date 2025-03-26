const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('RENDER SETUP: Running comprehensive setup for Render.com deployment...');

/**
 * STEP 1: Install and properly configure tailwindcss and related packages
 */
function installDependencies() {
  console.log('\n--- STEP 1: Installing dependencies ---');
  
  // These should be installed as regular dependencies, not dev dependencies
  const deps = [
    'tailwindcss@^3.3.0',
    'autoprefixer@^10.4.14',
    'postcss@^8.4.27',
    'tailwindcss-animate@^1.0.6'
  ];
  
  try {
    console.log(`Installing: ${deps.join(', ')}`);
    execSync(`npm install ${deps.join(' ')} --save`, { 
      stdio: 'inherit',
      cwd: process.cwd()
    });
    console.log('Dependencies installed successfully');
  } catch (error) {
    console.error('Failed to install dependencies:', error.message);
    // Continue anyway as the dependencies might already be installed
  }
}

/**
 * STEP 2: Create necessary configuration files
 */
function createConfigFiles() {
  console.log('\n--- STEP 2: Creating configuration files ---');
  
  // Create postcss.config.js
  const postcssPath = path.join(process.cwd(), 'postcss.config.js');
  const postcssContent = `
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`.trim();
  
  fs.writeFileSync(postcssPath, postcssContent);
  console.log('Created postcss.config.js');
  
  // Create tailwind.config.js
  const tailwindPath = path.join(process.cwd(), 'tailwind.config.js');
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
}`.trim();
  
  fs.writeFileSync(tailwindPath, tailwindContent);
  console.log('Created tailwind.config.js');
}

/**
 * STEP 3: Set up the app directory and layout files
 */
function setupAppFiles() {
  console.log('\n--- STEP 3: Setting up app files ---');
  
  // Ensure app directory exists
  const appDir = path.join(process.cwd(), 'src', 'app');
  if (!fs.existsSync(appDir)) {
    console.log('Creating src/app directory');
    fs.mkdirSync(appDir, { recursive: true });
  }
  
  // Create globals.css
  const globalsPath = path.join(appDir, 'globals.css');
  const globalsContent = `
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;

    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;

    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;

    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;

    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;

    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;

    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;

    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;

    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;

    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;

    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;

    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;

    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;

    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;

    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;

    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;

    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;

    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}`.trim();
  
  fs.writeFileSync(globalsPath, globalsContent);
  console.log('Created globals.css');
  
  // Create layout.tsx
  const layoutPath = path.join(appDir, 'layout.tsx');
  const layoutContent = `
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Next.js Application",
  description: "Built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}`.trim();
  
  fs.writeFileSync(layoutPath, layoutContent);
  console.log('Created layout.tsx');
}

/**
 * STEP 4: Verify UI components exist
 */
function verifyUIComponents() {
  console.log('\n--- STEP 4: Verifying UI components ---');
  
  const componentsDir = path.join(process.cwd(), 'src', 'components');
  const uiDir = path.join(componentsDir, 'ui');
  
  // Ensure directories exist
  if (!fs.existsSync(componentsDir)) {
    console.log('Creating src/components directory');
    fs.mkdirSync(componentsDir, { recursive: true });
  }
  
  if (!fs.existsSync(uiDir)) {
    console.log('Creating src/components/ui directory');
    fs.mkdirSync(uiDir, { recursive: true });
  }
  
  // Components to check
  const components = ['alert', 'button', 'card', 'table'];
  
  components.forEach(component => {
    const componentPath = path.join(uiDir, `${component}.tsx`);
    if (!fs.existsSync(componentPath)) {
      console.log(`Missing UI component: ${component}.tsx`);
      // You would typically call a function here to create the component
      // We'll rely on the fix-ui-imports.js script to do this
    } else {
      console.log(`UI component exists: ${component}.tsx`);
    }
  });
}

/**
 * STEP 5: Create or update lib/utils.ts
 */
function setupLibUtils() {
  console.log('\n--- STEP 5: Setting up utils.ts ---');
  
  const libDir = path.join(process.cwd(), 'src', 'lib');
  if (!fs.existsSync(libDir)) {
    console.log('Creating src/lib directory');
    fs.mkdirSync(libDir, { recursive: true });
  }
  
  const utilsPath = path.join(libDir, 'utils.ts');
  const utilsContent = `
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}`.trim();
  
  fs.writeFileSync(utilsPath, utilsContent);
  console.log('Created utils.ts');
}

/**
 * STEP 6: Ensure the correct node_modules resolution
 */
function ensureNodeModulesResolution() {
  console.log('\n--- STEP 6: Ensuring node_modules resolution ---');
  
  try {
    // Test that we can resolve tailwindcss
    require.resolve('tailwindcss');
    console.log('✓ Successfully resolved tailwindcss module');
  } catch (error) {
    console.error('Failed to resolve tailwindcss module. This may cause build errors.');
    
    // Try running npm install again to fix
    try {
      console.log('Attempting to fix by running npm install again...');
      execSync('npm install', { stdio: 'inherit' });
      console.log('Finished npm install');
    } catch (installError) {
      console.error('Failed to run npm install:', installError.message);
    }
  }
}

// Run all setup steps
installDependencies();
createConfigFiles();
setupAppFiles();
verifyUIComponents();
setupLibUtils();
ensureNodeModulesResolution();

console.log('\nRENDER SETUP: Setup complete! Your application should now be ready for deployment on Render.com.');
process.exit(0); 