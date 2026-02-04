const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const { User } = require('./DB');

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-key';

// Check if Google OAuth credentials are configured
const isGoogleOAuthConfigured = () => {
  console.log('DEBUG - Checking Google OAuth configuration:');
  console.log('GOOGLE_CLIENT_ID exists:', !!process.env.GOOGLE_CLIENT_ID);
  console.log('GOOGLE_CLIENT_SECRET exists:', !!process.env.GOOGLE_CLIENT_SECRET);
  console.log('CLIENT_ID value starts with:', process.env.GOOGLE_CLIENT_ID?.substring(0, 10));
  
  return process.env.GOOGLE_CLIENT_ID && 
         process.env.GOOGLE_CLIENT_SECRET && 
         process.env.GOOGLE_CLIENT_ID !== 'your_google_client_id_here' &&
         process.env.GOOGLE_CLIENT_SECRET !== 'your_google_client_secret_here';
};

// Configure Google Strategy only if credentials are provided
if (isGoogleOAuthConfigured()) {
  if (!process.env.GOOGLE_CALLBACK_URL) {
    console.error('FATAL: GOOGLE_CALLBACK_URL environment variable is required for Google OAuth');
    process.exit(1);
  }
  
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  }, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user already exists with this Google ID
    let user = await User.findOne({ googleId: profile.id });
    
    if (user) {
      // User exists, update last login
      user.lastLogin = new Date();
      await user.save();
      return done(null, user);
    }
    
    // Check if user exists with the same email (from regular signup)
    user = await User.findOne({ email: profile.emails[0].value });
    
    if (user) {
      // Link Google account to existing user
      user.googleId = profile.id;
      user.authProvider = 'google';
      user.profilePicture = profile.photos[0]?.value || '';
      user.lastLogin = new Date();
      await user.save();
      return done(null, user);
    }
    
    // Create new user
    const newUser = new User({
      googleId: profile.id,
      email: profile.emails[0].value,
      name: profile.displayName,
      profilePicture: profile.photos[0]?.value || '',
      authProvider: 'google',
      lastLogin: new Date()
    });
    
    await newUser.save();
    return done(null, newUser);
  } catch (error) {
    console.error('Google Auth Error:', error);
    return done(error, null);
  }
  }));
} else {
  console.log('Google OAuth not configured - skipping Google Strategy setup');
  console.log('To enable Google OAuth, set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env.local');
}

// Serialize user for session (always needed for session management)
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Deserialize user from session (always needed for session management)
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Generate JWT token for user
const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      email: user.email,
      name: user.name
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Format user data for response
const formatUserData = (user) => {
  return {
    id: user._id,
    email: user.email,
    name: user.name,
    partnerName: user.partnerName,
    weddingDate: user.weddingDate,
    budget: user.budget,
    location: user.location,
    phoneNumber: user.phoneNumber,
    profilePicture: user.profilePicture,
    authProvider: user.authProvider
  };
};

module.exports = {
  passport,
  generateToken,
  formatUserData,
  isGoogleOAuthConfigured
};