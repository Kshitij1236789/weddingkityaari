# Render Deployment Environment Variables

To complete your Render deployment, you need to set these environment variables in your Render dashboard:

## Required Environment Variables

### 1. Database Connection
```
MONGODB_URI=your_mongodb_connection_string
```
Get this from:
- MongoDB Atlas (recommended for production)
- Or use Render's managed database

### 2. Authentication Secrets
```
JWT_SECRET=your_random_jwt_secret_key_here
```
Generate a random 32+ character string for this.

### 3. Google OAuth (Optional but recommended)
```
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=https://your-render-app-name.onrender.com/api/auth/google/callback
```

### 4. Frontend URL
```
FRONTEND_URL=https://weddingkityaari.vercel.app
```

## How to Set Environment Variables in Render

1. Go to your Render dashboard
2. Select your service
3. Go to "Environment" tab
4. Add each environment variable
5. Click "Save Changes"

## Getting Google OAuth Credentials

Follow the steps in `GOOGLE_OAUTH_SETUP.md` to:
1. Create a Google Cloud Project
2. Enable Google+ API
3. Configure OAuth consent screen
4. Create OAuth 2.0 credentials
5. Add your Render callback URL to authorized redirect URIs

## Important Notes

- Replace `your-render-app-name` with your actual Render app name
- Keep GOOGLE_CLIENT_SECRET secure and never commit it to git
- Test your deployment after setting all variables
- Check Render logs for any remaining configuration issues

## Testing Deployment

After setting up environment variables:
1. Redeploy your service in Render
2. Check the logs for "Server running on port 10000"
3. Test the health check endpoint: `https://your-render-app-name.onrender.com/api/health`
4. Test Google OAuth if configured