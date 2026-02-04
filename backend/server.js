const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const { connectDB, User, ChatHistory } = require('./DB');
const { passport, generateToken, formatUserData, isGoogleOAuthConfigured } = require('./googleAuth');
require('dotenv').config();

// Validate required environment variables
const requiredEnvVars = ['FRONTEND_URL', 'JWT_SECRET', 'MONGODB_URI'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('FATAL: Missing required environment variables:', missingEnvVars);
  console.error('Please set the following environment variables:');
  missingEnvVars.forEach(envVar => console.error(`  - ${envVar}`));
  process.exit(1);
}

const app = express();

// Initialize database connection
connectDB();

// Middleware
app.use(express.json());

// Session configuration for production vs development
const sessionConfig = {
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
};

// Use MongoDB store for sessions in production
if (process.env.NODE_ENV === 'production') {
  sessionConfig.store = MongoStore.create({
    client: mongoose.connection.getClient(),
    ttl: 24 * 60 * 60, // 24 hours
    touchAfter: 24 * 3600 // lazy session update
  });
  console.log('Using MongoDB session store for production');
} else {
  console.log('Using MemoryStore for sessions (development only)');
}

app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors({
  origin: [
    process.env.FRONTEND_URL,
    /^https:\/\/.*\.vercel\.app$/ // Allow all Vercel subdomains
  ].filter(Boolean), // Remove undefined values
  credentials: true
}));

// JWT Secret - MUST be set via environment variable
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('FATAL: JWT_SECRET environment variable is required');
  process.exit(1);
}

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Routes

// Google OAuth Routes - DISABLED
// Authentication is now optional for AI features

app.get('/api/auth/google', (req, res) => {
  res.status(503).json({ 
    error: 'Google OAuth disabled', 
    message: 'Authentication is optional. You can use AI features without logging in.' 
  });
});

app.get('/api/auth/google/callback', (req, res) => {
  const frontendURL = process.env.FRONTEND_URL;
  res.redirect(`${frontendURL}?message=auth_disabled`);
});

app.get('/api/auth/google/success', (req, res) => {
  res.status(503).json({ message: 'Authentication disabled - AI features available without login' });
});

// Auth info endpoint
app.get('/api/auth', (req, res) => {
  res.json({
    message: 'WeddingKiTyaari API - Authentication Optional',
    status: 'Authentication disabled for AI features',
    ai_access: 'Available without login',
    note: 'You can explore AI wedding planning features without creating an account',
    disabled_endpoints: {
      google_auth: '/api/auth/google (disabled)',
      register: 'POST /api/auth/register (disabled)',
      login: 'POST /api/auth/login (disabled)'
    },
    available_endpoints: {
      ai_chat: 'POST /api/chat/:mode (no auth required)'
    }
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'WeddingKiTyaari Backend API',
    version: '1.0.1',
    status: 'running',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth/*',
      chat: '/api/chat/*'
    }
  });
});

// Health check endpoint with timestamp
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

// Handle static assets requests (prevent 401 errors)
app.get('/vite.svg', (req, res) => {
  res.status(404).json({ error: 'Static asset not found - this is a backend API server' });
});

app.get('/assets/*', (req, res) => {
  res.status(404).json({ error: 'Static asset not found - this is a backend API server' });
});

// Traditional Authentication Routes

// Register endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = new User({
      email,
      password: hashedPassword,
      name,
      lastLogin: new Date()
    });

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: newUser._id, 
        email: newUser.email, 
        name: newUser.name 
      }, 
      JWT_SECRET, 
      { expiresIn: '7d' }
    );

    // Return user data (without password)
    const userData = {
      id: newUser._id,
      email: newUser.email,
      name: newUser.name,
      partnerName: newUser.partnerName,
      weddingDate: newUser.weddingDate,
      budget: newUser.budget,
      location: newUser.location,
      phoneNumber: newUser.phoneNumber
    };

    res.status(201).json({
      message: 'User registered successfully',
      user: userData,
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email, 
        name: user.name 
      }, 
      JWT_SECRET, 
      { expiresIn: '7d' }
    );

    // Return user data (without password)
    const userData = {
      id: user._id,
      email: user.email,
      name: user.name,
      partnerName: user.partnerName,
      weddingDate: user.weddingDate,
      budget: user.budget,
      location: user.location,
      phoneNumber: user.phoneNumber
    };

    res.json({
      message: 'Login successful',
      user: userData,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get user profile
app.get('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userData = {
      id: user._id,
      email: user.email,
      name: user.name,
      partnerName: user.partnerName,
      weddingDate: user.weddingDate,
      budget: user.budget,
      location: user.location,
      phoneNumber: user.phoneNumber
    };

    res.json(userData);
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update user profile
app.put('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    const allowedUpdates = ['name', 'partnerName', 'weddingDate', 'budget', 'location', 'phoneNumber'];
    const updates = {};
    
    // Filter allowed updates
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user.userId, 
      updates, 
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userData = {
      id: user._id,
      email: user.email,
      name: user.name,
      partnerName: user.partnerName,
      weddingDate: user.weddingDate,
      budget: user.budget,
      location: user.location,
      phoneNumber: user.phoneNumber
    };

    res.json({
      message: 'Profile updated successfully',
      user: userData
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Logout endpoint
app.post('/api/auth/logout', authenticateToken, async (req, res) => {
  try {
    // In JWT, we don't need to do anything server-side for logout
    // The client should remove the token from storage
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Chat History Routes

// Get chat history for a specific mode (no auth required)
app.get('/api/chat/:mode', async (req, res) => {
  try {
    const { mode } = req.params;
    
    // Since no auth required, return empty messages for now
    // In future, could implement session-based storage or localStorage
    res.json({ 
      messages: [],
      note: 'Chat history not persisted without user account'
    });
  } catch (error) {
    console.error('Get chat history error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Save chat history (no auth required - temporary storage only)
app.post('/api/chat/:mode', async (req, res) => {
  try {
    const { mode } = req.params;
    const { messages } = req.body;

    // Without authentication, we can't persist chat history
    // Return success but don't save to database
    res.json({ 
      message: 'Chat processed successfully',
      note: 'Chat history not persisted without user account',
      mode: mode,
      messageCount: messages?.length || 0
    });
  } catch (error) {
    console.error('Save chat history error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// AI Chat endpoint (no authentication required)
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, mode = 'wedding_planner' } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Return a simple response for now - frontend will handle AI processing
    res.json({
      success: true,
      mode: mode,
      message: 'AI chat endpoint ready - processing handled by frontend',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('AI chat error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running', timestamp: new Date() });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});