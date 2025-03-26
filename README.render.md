# Deploying to Render.com

This guide helps you deploy your Next.js application to Render.com and fixes the common "Module not found" errors.

## Deployment Steps

### 1. Create a Web Service

1. Log in to your Render.com account
2. Click on "New" and select "Web Service" 
3. Connect to your GitHub repository "drissal123/prisma"
4. Select the repository

### 2. Configuration

Set the following:

- **Name**: Choose a name for your service
- **Environment**: Node
- **Region**: Choose nearest to your users
- **Branch**: main (or your default branch)
- **Build Command**: `npm install && npx prisma generate && node scripts/fix-ui-imports.js && node scripts/prebuild.js && npm run build`
- **Start Command**: `node server.js`

### 3. Environment Variables

Add these environment variables:

- `NODE_ENV`: `production`
- `DATABASE_URL`: Your database connection string
- `NEXTAUTH_SECRET`: A secure random string for session encryption
- `NEXTAUTH_URL`: Your Render deployment URL (e.g., https://your-app-name.onrender.com)

### 4. Advanced Options (Optional)

- Set `NODE_VERSION` if needed
- Configure any other environment-specific settings

### 5. Deploy

Click "Create Web Service" and Render will start the deployment process.

## Troubleshooting

### Module not found: Can't resolve '@/components/ui/alert'

This error occurs because the module path can't be resolved during build. Our scripts handle this by:

1. Verifying all UI components exist before build
2. Creating missing components if needed
3. Ensuring proper TypeScript path resolution

### Checking Deployment Logs

If you still encounter issues:

1. Go to your Web Service dashboard on Render
2. Click on "Logs" in the top navigation
3. Look for errors related to module resolution
4. Check the output of the pre-build scripts

### Manual Verification

You can also run the verification scripts locally:

```bash
node scripts/fix-ui-imports.js
node scripts/prebuild.js
```

## Important Files

- `scripts/fix-ui-imports.js`: Creates missing UI components
- `scripts/prebuild.js`: Verifies component paths and workspace structure
- `server.js`: Custom server for production
- `render.yaml`: Deployment configuration

## Next Steps

After successful deployment:

1. Configure your database (if using an external database)
2. Set up authentication providers if using NextAuth.js
3. Test all application functionality 