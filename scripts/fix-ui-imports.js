const fs = require('fs');
const path = require('path');

console.log('Checking and fixing UI component imports...');

// Function to ensure the src/components/ui directory exists
function ensureUIComponentsDirectory() {
  const uiDir = path.join(process.cwd(), 'src', 'components', 'ui');
  
  if (!fs.existsSync(uiDir)) {
    console.log('UI components directory does not exist, creating it...');
    fs.mkdirSync(uiDir, { recursive: true });
    return false;
  }
  return true;
}

// Function to check if a component exists and create it if it doesn't
function ensureComponent(componentName, template) {
  const componentPath = path.join(process.cwd(), 'src', 'components', 'ui', `${componentName}.tsx`);
  
  if (!fs.existsSync(componentPath)) {
    console.log(`Component ${componentName}.tsx does not exist, creating it...`);
    fs.writeFileSync(componentPath, template);
    return false;
  }
  return true;
}

// Make sure the UI components directory exists
const uiDirExists = ensureUIComponentsDirectory();

// Define templates for missing components
const alertTemplate = `"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
))
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }`;

// Check if the alert component exists and create it if it doesn't
const alertExists = ensureComponent('alert', alertTemplate);

// Create utils.ts if it doesn't exist (needed for the cn utility function)
const utilsPath = path.join(process.cwd(), 'src', 'lib');
const utilsFilePath = path.join(utilsPath, 'utils.ts');

if (!fs.existsSync(utilsPath)) {
  console.log('lib directory does not exist, creating it...');
  fs.mkdirSync(utilsPath, { recursive: true });
}

if (!fs.existsSync(utilsFilePath)) {
  console.log('utils.ts does not exist, creating it...');
  const utilsContent = `import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}`;
  fs.writeFileSync(utilsFilePath, utilsContent);
}

console.log('UI component check complete.');

// Exit with success status
process.exit(0); 