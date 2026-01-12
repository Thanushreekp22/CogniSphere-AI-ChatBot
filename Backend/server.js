import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import chatRoutes from "./routes/chat.js";
import authRoutes from "./routes/auth.js";
import debateRoutes from "./routes/debate.js";
import memoryRoutes from "./routes/memory.js";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Security Middleware
app.use(helmet()); // Add security headers
app.use(mongoSanitize()); // Prevent NoSQL injection

// Increase payload limit for image uploads (10MB)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// CORS configuration - supports both development and production
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    process.env.FRONTEND_URL, // Production frontend URL
].filter(Boolean); // Remove undefined values

const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Root route
app.get("/", (req, res) => {
    res.json({ 
        message: "CogniSphere API Server",
        security: "enabled"
    });
});

// Apply routes (rate limiters are applied within each route file)
app.use("/api/chat", chatRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/debate", debateRoutes);
app.use("/api/memory", memoryRoutes);

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    connectDB();
});

const connectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            retryWrites: true,
            w: 'majority'
        });
        console.log("✅ Connected to MongoDB successfully!");
        console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
    } catch(err) {
        console.error("❌ Failed to connect to MongoDB:", err.message);
        process.exit(1); // Exit process with failure
    }
}


// app.post("/test", async (req, res) => {
//     const options = {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
//         },
//         body: JSON.stringify({
//             model: "gpt-4o-mini",
//             messages: [{
//                 role: "user",
//                 content: req.body.message
//             }]
//         })
//     };

//     try {
//         const response = await fetch("https://api.openai.com/v1/chat/completions", options);
//         const data = await response.json();
//         //console.log(data.choices[0].message.content); //reply
//         res.send(data.choices[0].message.content);
//     } catch(err) {
//         console.log(err);
//     }
// });

