const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const session = require('express-session');
const { connectDB, User, ChatHistory } = require('./DB');
const { passport, generateToken, formatUserData, isGoogleOAuthConfigured } = require('./googleAuth');
require('dotenv').config();

const app = express();

// Initialize database connection
connectDB();

// Middleware
app.use(express.json());
app.use(session({
  secret: process.env.JWT_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true in production with HTTPS
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5178',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'https://weddingkityaari.vercel.app' // Add your actual Vercel domain here
  ],
  credentials: true
}));

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-key';

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

// Google OAuth Routes
// Check if Google OAuth is configured before setting up routes
if (isGoogleOAuthConfigured()) {
  // Initiate Google OAuth
  app.get('/api/auth/google', 
    passport.authenticate('google', { scope: ['profile', 'email'] })
  );

  // Google OAuth callback
  app.get('/api/auth/google/callback',
    passport.authenticate('google', { failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth?error=google_auth_failed` }),
    async (req, res) => {
      try {
        // Generate JWT token
        const token = generateToken(req.user);
        const userData = formatUserData(req.user);
        
        // Redirect to frontend with token and user data
        const frontendURL = process.env.FRONTEND_URL || 'http://localhost:5173';
        const redirectURL = `${frontendURL}/auth/google/success?token=${token}&user=${encodeURIComponent(JSON.stringify(userData))}`;
        
        res.redirect(redirectURL);
      } catch (error) {
        console.error('Google callback error:', error);
        const frontendURL = process.env.FRONTEND_URL || 'http://localhost:5173';
        res.redirect(`${frontendURL}/auth?error=callback_failed`);
      }
    }
  );
} else {
  // Provide error endpoints when Google OAuth is not configured
  app.get('/api/auth/google', (req, res) => {
    res.status(501).json({ 
      error: 'Google OAuth not configured', 
      message: 'Please configure GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in environment variables' 
    });
  });
  
  app.get('/api/auth/google/callback', (req, res) => {
    const frontendURL = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendURL}/auth?error=google_oauth_not_configured`);
  });
}

// Google OAuth success endpoint (for handling redirect)
app.get('/api/auth/google/success', (req, res) => {
  res.json({ message: 'Google authentication successful' });
});

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'WeddingKiTyaari Backend API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth/*',
      chat: '/api/chat/*'
    }
  });
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

// Chat History Routes

// Get chat history for a specific mode
app.get('/api/chat/:mode', authenticateToken, async (req, res) => {
  try {
    const { mode } = req.params;
    const chatHistory = await ChatHistory.findOne({
      userId: req.user.userId,
      mode: mode
    });

    if (!chatHistory) {
      return res.json({ messages: [] });
    }

    res.json({ messages: chatHistory.messages });
  } catch (error) {
    console.error('Get chat history error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Save/Update chat history
app.post('/api/chat/:mode', authenticateToken, async (req, res) => {
  try {
    const { mode } = req.params;
    const { messages } = req.body;

    let chatHistory = await ChatHistory.findOne({
      userId: req.user.userId,
      mode: mode
    });

    if (chatHistory) {
      chatHistory.messages = messages;
      chatHistory.lastUpdated = new Date();
    } else {
      chatHistory = new ChatHistory({
        userId: req.user.userId,
        mode: mode,
        messages: messages
      });
    }

    await chatHistory.save();
    res.json({ message: 'Chat history saved successfully' });
  } catch (error) {
    console.error('Save chat history error:', error);
    res.status(500).json({ message: 'Internal server error' });
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