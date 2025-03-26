const fs = require('fs');
const path = require('path');

console.log('Checking and fixing app layout file...');

// Function to ensure the src/app directory exists
function ensureAppDirectory() {
  const appDir = path.join(process.cwd(), 'src', 'app');
  
  if (!fs.existsSync(appDir)) {
    console.log('app directory does not exist, creating it...');
    fs.mkdirSync(appDir, { recursive: true });
    return false;
  }
  return true;
}

// Check if the layout.tsx file exists and fix it if needed
function ensureLayoutFile() {
  const layoutPath = path.join(process.cwd(), 'src', 'app', 'layout.tsx');
  
  if (!fs.existsSync(layoutPath)) {
    console.log('layout.tsx does not exist, creating it...');
    const layoutContent = `import type { Metadata } from "next";
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
}`;
    fs.writeFileSync(layoutPath, layoutContent);
    console.log('Created layout.tsx file');
    return false;
  }

  // Read the existing layout file to check for Tailwind imports
  const layoutContent = fs.readFileSync(layoutPath, 'utf8');
  
  // Check if the globals.css is imported
  if (!layoutContent.includes('./globals.css')) {
    console.log('Adding globals.css import to layout.tsx...');
    const updatedContent = layoutContent.replace(
      /import.*?from.*?['"](.*?)['"];/,
      match => `${match}\nimport "./globals.css";`
    );
    fs.writeFileSync(layoutPath, updatedContent);
    console.log('Updated layout.tsx with globals.css import');
  }
  
  return true;
}

// Ensure the globals.css file exists and has Tailwind imports
function ensureGlobalsCss() {
  const globalsPath = path.join(process.cwd(), 'src', 'app', 'globals.css');
  
  if (!fs.existsSync(globalsPath)) {
    console.log('globals.css does not exist, creating it...');
    const globalsContent = `@tailwind base;
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
}`;
    fs.writeFileSync(globalsPath, globalsContent);
    console.log('Created globals.css file with Tailwind imports');
    return false;
  }
  
  // Read existing globals.css to check for Tailwind imports
  const globalsContent = fs.readFileSync(globalsPath, 'utf8');
  
  // Check if Tailwind is imported
  if (!globalsContent.includes('@tailwind')) {
    console.log('Adding Tailwind imports to globals.css...');
    const updatedContent = `@tailwind base;
@tailwind components;
@tailwind utilities;

${globalsContent}`;
    fs.writeFileSync(globalsPath, updatedContent);
    console.log('Updated globals.css with Tailwind imports');
  }
  
  return true;
}

// Run the checks and fixes
const appExists = ensureAppDirectory();
const layoutExists = ensureLayoutFile();
const globalsExists = ensureGlobalsCss();

console.log('Layout file checks complete.');

// Exit with success
process.exit(0); 