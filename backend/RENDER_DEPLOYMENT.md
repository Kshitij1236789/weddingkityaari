# Render Deployment Configuration for WeddingKiTyaari Backend

This backend is configured to deploy on Render.com

## Environment Variables Required on Render:

1. **MONGODB_URI** - Your MongoDB connection string
2. **JWT_SECRET** - Secret key for JWT tokens  
3. **FRONTEND_URL** - Your frontend domain (will be your Vercel domain)
4. **PORT** - Render will set this automatically

## Deployment Steps:

1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Select the backend directory as the root
4. Set build command: `npm install`
5. Set start command: `npm start`
6. Add environment variables in Render dashboard
7. Deploy!

## Important Notes:

- Make sure to update FRONTEND_URL with your actual Vercel domain
- The MongoDB URI should point to your MongoDB Atlas cluster
- Keep JWT_SECRET secure and different from development