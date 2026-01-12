# 🌐 CogniSphere AI

> **A sophisticated full-stack AI chatbot platform featuring multi-personality conversations, debate mode, and personalized memory - built with MERN stack and production-ready security**

![MERN Stack](https://img.shields.io/badge/Stack-MERN-success?style=flat-square) ![React 19](https://img.shields.io/badge/React-19-blue?style=flat-square) ![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=flat-square) ![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen?style=flat-square) ![AI](https://img.shields.io/badge/AI-Groq%20%7C%20Llama-orange?style=flat-square)

---

## 📋 Project Overview

**CogniSphere AI** is a production-grade conversational AI platform that demonstrates full-stack development expertise, AI integration, and enterprise-level security practices. The application provides an intelligent chatbot experience with unique features like AI-vs-AI debate mode, persistent user memory, and multiple AI personalities.

### 🎯 Key Highlights
- ✅ **Full-Stack MERN Application** - Complete end-to-end development
- ✅ **AI/ML Integration** - Groq API with Llama 3.3 70B & Vision models
- ✅ **Enterprise Security** - JWT auth, encryption, rate limiting, input sanitization
- ✅ **RESTful API Design** - Well-structured backend with middleware architecture
- ✅ **Modern Frontend** - React 19 with Vite, responsive design
- ✅ **Database Design** - MongoDB with Mongoose ORM, efficient schema design
- ✅ **Production-Ready** - Error handling, validation, security best practices

---

## 💼 Technical Skills Demonstrated

| Category | Technologies |
|----------|-------------|
| **Frontend** | React 19, Vite, Modern CSS, Responsive Design |
| **Backend** | Node.js, Express.js, RESTful APIs, Middleware |
| **Database** | MongoDB, Mongoose, Schema Design, Data Modeling |
| **AI/ML** | Groq API, LLM Integration, Prompt Engineering |
| **Security** | JWT, bcrypt, Helmet.js, Rate Limiting, Input Validation |
| **DevOps** | Environment Configuration, API Integration |
| **Tools** | Git, npm, MongoDB Compass, Postman |

---

## ✨ Core Features

### 🤖 AI Capabilities
- **Smart Conversations** - Powered by Groq's Llama 3.3 70B (70 billion parameters)
- **Image Analysis** - Vision AI using Llama 4 Scout Vision model
- **8 AI Personalities** - Professional, Friendly, Academic, Creative, Empathetic, Humorous, Analytical, Enthusiastic
- **Context-Aware Responses** - Maintains conversation context across threads

### 🎭 Unique Features
- **AI Debate Mode** - Two AI personas debate topics from different perspectives
- **Personal Memory System** - AI remembers user preferences and facts across sessions
- **Voice Input** - Speech-to-text for hands-free interaction
- **Multi-Thread Support** - Organize conversations by topic or context

### 🔐 Security & Performance
- **JWT Authentication** - Secure token-based user sessions
- **Password Encryption** - bcrypt hashing with salt rounds
- **Rate Limiting** - DDoS and brute-force protection (100 req/15min)
- **Input Sanitization** - SQL/NoSQL injection prevention
- **Security Headers** - XSS, clickjacking, and MIME-sniffing protection via Helmet.js
- **Data Validation** - Comprehensive validation using express-validator

### 💻 User Experience
- **Modern UI/UX** - Clean, intuitive interface design
- **Fully Responsive** - Mobile, tablet, and desktop optimized
- **Real-time Updates** - Fast, seamless conversation flow
- **Persistent History** - All conversations saved and retrievable

---

## 🛠️ Tech Stack

### Frontend
```
React 19, Vite, JavaScript (ES6+), CSS3, Responsive Design
```

### Backend
```
Node.js, Express.js, RESTful API, Middleware Architecture
```

### Database
```
MongoDB, Mongoose ODM, Schema Design
```

### AI & APIs
```
Groq API, Llama 3.3 70B, Llama 4 Scout Vision
```

### Security & Libraries
```
JWT (jsonwebtoken), bcrypt, Helmet.js, express-rate-limit
express-validator, express-mongo-sanitize, cors, dotenv
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- MongoDB
- Groq API Key

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd "CogniSphere AI"
```

2. **Install dependencies**
```bash
# Backend
cd Backend
npm install

# Frontend
cd ../Frontend
npm install
```

3. **Configure environment**
Create `Backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cognisphere
JWT_SECRET=your_secure_secret_key
GROQ_API_KEY=your_groq_api_key
```

4. **Run the application**
```bash
# Terminal 1 - Backend
cd Backend
npm start

# Terminal 2 - Frontend
cd Frontend
npm run dev
```

5. **Access the app**
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

---

## 📁 Project Architecture

```
CogniSphere AI/
├── Backend/
│   ├── server.js              # Express server & middleware setup
│   ├── middleware/
│   │   ├── auth.js           # JWT authentication
│   │   ├── rateLimiter.js    # Rate limiting config
│   │   └── validators.js     # Input validation
│   ├── models/               # MongoDB schemas
│   │   ├── User.js
│   │   ├── Thread.js
│   │   └── UserMemory.js
│   ├── routes/               # API endpoints
│   │   ├── auth.js           # Authentication routes
│   │   ├── chat.js           # Chat functionality
│   │   ├── debate.js         # Debate mode
│   │   └── memory.js         # Memory management
│   └── utils/
│       ├── jwt.js            # Token utilities
│       └── openai.js         # Groq API integration
│
└── Frontend/
    ├── src/
    │   ├── App.jsx           # Main application
    │   ├── Auth.jsx          # Login/Register
    │   ├── Chat.jsx          # Chat interface
    │   ├── DebateMode.jsx    # AI debate feature
    │   ├── MemoryManager.jsx # Memory management UI
    │   └── utils/api.js      # API client
    └── vite.config.js        # Build configuration
```

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Chat
- `POST /api/chat` - Send message to AI
- `GET /api/chat/history/:threadId` - Get conversation history
- `GET /api/chat/threads` - List all user threads
- `DELETE /api/chat/thread/:threadId` - Delete thread

### Debate Mode
- `POST /api/debate/start` - Initiate AI debate
- `POST /api/debate/continue` - Continue debate round

### Memory
- `POST /api/memory` - Save user memory
- `GET /api/memory` - Retrieve all memories
- `PUT /api/memory/:id` - Update memory
- `DELETE /api/memory/:id` - Delete memory

---

## 💡 Key Implementation Details

### Database Schema Design
- **User Model** - Authentication, profile data
- **Thread Model** - Conversation organization with message history
- **UserMemory Model** - Persistent key-value memory storage

### Security Implementation
- Password hashing with 10 salt rounds
- JWT tokens with 7-day expiration
- Protected routes with authentication middleware
- MongoDB query sanitization to prevent injection attacks
- Comprehensive input validation on all endpoints

### AI Integration
- Streaming responses for real-time chat experience
- Context management for coherent conversations
- Personality system implementation with custom prompts
- Error handling and fallback mechanisms

---

## 🎓 Learning Outcomes & Best Practices

✅ RESTful API design and implementation  
✅ JWT-based authentication system  
✅ MongoDB database design and optimization  
✅ React component architecture  
✅ State management in React  
✅ API integration and error handling  
✅ Security best practices (OWASP Top 10)  
✅ Environment variable management  
✅ Middleware pattern implementation  
✅ Frontend-backend integration  

---

## 📞 Contact & Links

**Developer:** [Your Name]  
**Email:** [Your Email]  
**LinkedIn:** [Your LinkedIn]  
**Portfolio:** [Your Portfolio]  

---

<div align="center">

**⭐ If you find this project interesting, please star the repository!**

*Built with passion and attention to detail* ❤️

</div>


