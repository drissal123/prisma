# Deploying to Render.com

Follow these steps to deploy this Next.js application to Render.com:

## 1. Create a new Web Service

- Sign in to your Render.com account
- Click on "New" and select "Web Service"
- Connect your GitHub repository "drissal123/prisma"
- Give your service a name (e.g., "prisma-nextjs")

## 2. Configuration

- **Environment**: `Node`
- **Build Command**: `npm install && npx prisma generate && npm run build`
- **Start Command**: `node server.js`

## 3. Environment Variables

Add the following environment variables:

- `NODE_ENV`: `production`
- `DATABASE_URL`: Your database connection string
- `NEXTAUTH_SECRET`: A random string for NextAuth.js
- `NEXTAUTH_URL`: Your Render.com deployment URL (e.g., https://your-app-name.onrender.com)

## 4. Advanced Settings

- If you're using a specific Node version, set it under "Advanced" using the "NODE_VERSION" environment variable

## 5. Deploy

- Click "Create Web Service"
- Render will start building and deploying your application

## Troubleshooting

If you encounter the error `Module not found: Can't resolve '@/components/ui/alert'`, try the following:

1. Make sure the build process is correctly resolving path aliases
2. Check if all files are being properly included in the build

## Post-Deployment

After deployment:

1. Test all functionality
2. Set up your database (if not already configured)
3. Configure authentication providers in NextAuth.js

## Continuous Deployment

Your app will automatically redeploy when you push changes to your GitHub repository. 