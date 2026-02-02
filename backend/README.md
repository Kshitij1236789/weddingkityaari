# WeddingKiTyaari Backend Server

This is the backend server for the WeddingKiTyaari wedding planning platform with MongoDB authentication.

## Features

- 🔐 **User Authentication** with JWT tokens
- 🗄️ **MongoDB Database** for persistent user data
- 💬 **Chat History Storage** in database
- 🔒 **Password Hashing** with bcrypt
- 🌐 **CORS Enabled** for frontend integration
- ✅ **Input Validation** and error handling

## Setup Instructions

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Database Setup

#### Option A: Local MongoDB
1. Install MongoDB locally from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Start MongoDB service:
   ```bash
   # Windows
   net start MongoDB
   
   # macOS/Linux
   brew services start mongodb/brew/mongodb-community
   # or
   sudo systemctl start mongod
   ```

#### Option B: MongoDB Atlas (Cloud)
1. Create free account at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get connection string
4. Update `.env` file with your Atlas connection string

### 3. Environment Configuration

Copy the `.env` file and update values:

```bash
# Required: MongoDB connection string
MONGODB_URI=mongodb://localhost:27017/weddingkityaari

# Required: JWT secret (generate a secure random string)
JWT_SECRET=your-super-secure-jwt-secret-key-replace-this

# Optional: Server configuration
PORT=3001
FRONTEND_URL=http://localhost:5178
```

**Security Note**: Generate a secure JWT secret in production:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 4. Start the Server

```bash
# Development with auto-restart
npm run dev

# Production
npm start
```

The server will start on `http://localhost:3001`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (requires auth)
- `PUT /api/auth/profile` - Update user profile (requires auth)

### Chat History
- `GET /api/chat/:mode` - Get chat history for specific mode (requires auth)
- `POST /api/chat/:mode` - Save chat history for specific mode (requires auth)

### Utility
- `GET /api/health` - Health check endpoint

## Database Schema

### Users Collection
```javascript
{
  email: String (unique, required),
  password: String (hashed, required),
  name: String (required),
  partnerName: String,
  weddingDate: Date,
  budget: Number,
  location: String,
  phoneNumber: String,
  createdAt: Date,
  lastLogin: Date
}
```

### Chat History Collection
```javascript
{
  userId: ObjectId (ref: User),
  mode: String (required),
  messages: [{
    content: String,
    sender: String (enum: ['user', 'ai']),
    timestamp: Date
  }],
  lastUpdated: Date
}
```

## Frontend Integration

The frontend will automatically connect to the backend API. Make sure both servers are running:

1. Backend: `http://localhost:3001`
2. Frontend: `http://localhost:5178`

## Security Features

- ✅ Password hashing with bcrypt (12 rounds)
- ✅ JWT tokens with 7-day expiration
- ✅ Input validation and sanitization
- ✅ MongoDB injection protection
- ✅ CORS configuration
- ✅ Error handling without data leakage

## Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
# Windows
sc query MongoDB

# macOS/Linux
brew services list | grep mongodb
# or
systemctl status mongod
```

### Port Already in Use
```bash
# Find process using port 3001
netstat -ano | findstr :3001

# Kill process (replace PID)
taskkill /PID <process_id> /F
```

### Frontend Can't Connect
1. Verify backend is running on port 3001
2. Check CORS configuration in `server.js`
3. Verify `VITE_API_URL` in frontend `.env.local`

## Development

- Server auto-restarts on file changes with `nodemon`
- Error logs include stack traces in development
- Database queries logged to console
- JWT tokens valid for 7 days in development

## Production Deployment

1. Set secure `JWT_SECRET` environment variable
2. Use MongoDB Atlas or secure MongoDB instance
3. Configure CORS for your production domain
4. Set `NODE_ENV=production`
5. Use process manager like PM2
6. Configure reverse proxy (nginx) if needed