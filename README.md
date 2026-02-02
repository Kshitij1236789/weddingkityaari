# WeddingKiTyaari - Wedding Planning Platform

A comprehensive wedding planning platform with AI assistance, built with React (frontend) and Node.js/Express (backend).

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account or local MongoDB
- OpenAI API key (for AI features)

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd weddingkityaari
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Create .env file with your configuration
   cp .env.example .env
   # Edit .env with your MongoDB URI and JWT secret
   
   npm start
   ```

3. **Frontend Setup** (in a new terminal)
   ```bash
   cd frontend
   npm install
   
   # Create .env.local file with your API keys
   # Add VITE_OPENAI_API_KEY=your_key_here
   
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

## 📁 Project Structure

```
weddingkityaari/
├── README.md                 # This file
├── frontend/                 # React + Vite frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── context/          # React context (Auth, etc.)
│   │   └── services/         # API services
│   ├── package.json
│   └── vite.config.js
└── backend/                  # Node.js + Express backend
    ├── server.js             # Main server file
    ├── package.json
    └── .env                  # Environment variables
```

## 🔧 Environment Variables

### Backend (.env)
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=3001
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env.local)
```env
VITE_OPENAI_API_KEY=your_openai_api_key
VITE_API_URL=http://localhost:3001
```

## 🎯 Features

- 🔐 User authentication & profiles
- 💍 Wedding planning tools
- 🤖 AI-powered wedding assistant
- 📱 Responsive design
- 🗄️ MongoDB data storage
- 🔒 JWT authentication

## 🛠️ Development Commands

### Backend
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

### Frontend
- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 📝 API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `GET /api/health` - Health check

## 🚀 Deployment

### Backend (Node.js)
- Deploy to Heroku, Railway, or any Node.js hosting
- Set environment variables in hosting platform
- Ensure MongoDB Atlas is configured

### Frontend (React)
- Deploy to Vercel, Netlify, or any static hosting
- Build with `npm run build`
- Set VITE_API_URL to your backend URL

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.