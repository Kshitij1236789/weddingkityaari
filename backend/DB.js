const mongoose = require('mongoose');

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/weddingkityaari');
    
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));
    db.once('open', () => {
      console.log('Connected to MongoDB');
    });
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

// User Schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: function() {
      return !this.googleId; // Password required only if not Google user
    },
    minlength: 6
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  // Google OAuth fields
  googleId: {
    type: String,
    unique: true,
    sparse: true // allows multiple null values
  },
  profilePicture: {
    type: String,
    default: ''
  },
  authProvider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local'
  },
  partnerName: {
    type: String,
    default: ''
  },
  weddingDate: {
    type: Date,
    default: null
  },
  budget: {
    type: Number,
    default: 0
  },
  location: {
    type: String,
    default: ''
  },
  phoneNumber: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
});

// Chat History Schema
const chatHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mode: {
    type: String,
    required: true
  },
  messages: [{
    content: String,
    sender: {
      type: String,
      enum: ['user', 'ai'],
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

// Models
const User = mongoose.model('User', userSchema);
const ChatHistory = mongoose.model('ChatHistory', chatHistorySchema);

module.exports = {
  connectDB,
  User,
  ChatHistory
};