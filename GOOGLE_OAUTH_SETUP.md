# Google OAuth Setup Guide

To enable Google Sign-In for your WeddingKiTyaari application, follow these steps:

## 1. Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter project name: `WeddingKiTyaari`
4. Click "Create"

## 2. Enable Google+ API

1. In the Google Cloud Console, go to "APIs & Services" → "Library"
2. Search for "Google+ API" 
3. Click on it and enable the API
4. Also enable "Google Identity Services API"

## 3. Configure OAuth Consent Screen

1. Go to "APIs & Services" → "OAuth consent screen"
2. Choose "External" (unless you have a Google Workspace account)
3. Fill in the required information:
   - **App name**: WeddingKiTyaari
   - **User support email**: your email
   - **Developer contact information**: your email
4. Add scopes: `email`, `profile`, `openid`
5. Add test users (during development)

## 4. Create OAuth 2.0 Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "+ Create Credentials" → "OAuth client ID"
3. Select "Web application"
4. Configure:
   - **Name**: WeddingKiTyaari Web Client
   - **Authorized JavaScript origins**: 
     - `http://localhost:5173` (frontend dev server)
     - `http://localhost:5174` (alternative port)
     - Your production domain
   - **Authorized redirect URIs**:
     - `http://localhost:3001/api/auth/google/callback`
     - Your production backend callback URL

5. Click "Create"
6. Copy the **Client ID** and **Client Secret**

## 5. Update Environment Variables

### Backend (.env.local)
```env
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:3001/api/auth/google/callback
JWT_SECRET=your_secure_jwt_secret_here
```

### Frontend (.env.local)
```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

## 6. Update for Production

When deploying to production:

1. Add your production domain to authorized origins and redirect URIs
2. Update the callback URL in environment variables
3. Set `cookie: { secure: true }` in express-session configuration
4. Use HTTPS for all Google OAuth flows

## 7. Test the Integration

1. Start your backend: `npm start`
2. Start your frontend: `npm run dev`
3. Click "Continue with Google" button
4. Complete OAuth flow
5. Verify user is logged in successfully

## Security Notes

- Never commit your Client Secret to version control
- Use different OAuth clients for development and production
- Regularly rotate your JWT secret
- Validate all user data from Google on the backend

## Troubleshooting

- **redirect_uri_mismatch**: Check that your callback URL exactly matches what's configured in Google Cloud Console
- **invalid_client**: Verify your Client ID and Secret are correct
- **access_blocked**: Make sure your OAuth consent screen is properly configured