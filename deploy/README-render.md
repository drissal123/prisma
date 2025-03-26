# Deploying to Render.com

This guide will walk you through deploying your Next.js application to Render.com.

## Option 1: Deploy via GitHub

### Prerequisites
- Your code pushed to a GitHub repository
- A Render.com account

### Steps

1. **Log in to Render**
   - Go to [dashboard.render.com](https://dashboard.render.com) and log in to your account

2. **Create a New Web Service**
   - Click "New" and select "Web Service"
   - Connect your GitHub account if you haven't already
   - Select the repository with your Next.js application

3. **Configure Your Service**
   - **Name**: Choose a name for your service (e.g., "response-api")
   - **Runtime**: Select "Node"
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Node Version**: Set to 16.x (or higher if available)
   - **Free Plan**: Select the free instance type

4. **Set Environment Variables**
   - Click "Advanced" and add the following environment variables:
     - `NEXTAUTH_URL`: The URL of your Render app (will be available after creation)
     - `NEXTAUTH_SECRET`: A random string for session encryption
     - `DATABASE_URL`: Your database connection string (see database options below)

5. **Deploy**
   - Click "Create Web Service"
   - Render will build and deploy your application automatically

## Option 2: Deploy via ZIP Upload

If you prefer not to use GitHub, you can deploy directly from your local code:

1. **Prepare Your Application**
   - Make sure your application is ready for deployment
   - Create a ZIP file of your project (excluding node_modules and .next folders)

2. **Create a New Web Service**
   - Click "New" and select "Web Service"
   - Select "Deploy from your computer" option

3. **Upload Your Code**
   - Upload the ZIP file of your project
   - Configure the service as described in Option 1

## Setting Up a Database

Render doesn't provide a free database, but you can use:

### Option A: Render PostgreSQL (Paid)
- Create a PostgreSQL database in Render
- Use the connection string provided by Render

### Option B: Free External Database
1. **Create a free database:**
   - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Free tier)
   - [PlanetScale](https://planetscale.com/) (Free tier for MySQL)
   - [ElephantSQL](https://www.elephantsql.com/) (Free tier for PostgreSQL)

2. **Get your connection string** from the provider

3. **Update your Prisma schema** to match your database type

## After Deployment

1. **Update NEXTAUTH_URL**
   - Once your service is deployed, you'll get a URL like `https://your-app.onrender.com`
   - Go to the Environment tab and update NEXTAUTH_URL to this value

2. **Set up your database**
   - Run database migrations via Render's shell or using Prisma:
     ```
     npx prisma generate
     npx prisma db push
     ```

3. **Check logs**
   - Go to the Logs tab to see if there are any issues

## Troubleshooting

- **Build Failures**: Check the logs for specific errors
- **Runtime Errors**: View logs and check environment variables
- **Database Connection**: Verify your DATABASE_URL is correct and the database is accessible

## Render Blueprint (Optional)

You can also use the included `render.yaml` file for deployment:
1. Push this file to your GitHub repository
2. In Render, click "Blueprint" when creating a new service
3. Select your repository and follow the prompts 