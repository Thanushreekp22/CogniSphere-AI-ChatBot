import express from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import { generateTokens } from "../utils/jwt.js";
import { authLimiter } from "../middleware/rateLimiter.js";
import { registerValidation, loginValidation } from "../middleware/validators.js";

const router = express.Router();

// Register new user
router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ error: "User with this email already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const user = new User({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword
        });

        const savedUser = await user.save();
        
        // Generate JWT tokens
        const tokens = generateTokens(savedUser);
        
        // Return user data without password
        const userResponse = {
            id: savedUser._id,
            name: savedUser.name,
            email: savedUser.email,
            createdAt: savedUser.createdAt
        };

        res.status(201).json({ 
            message: "User registered successfully", 
            user: userResponse,
            ...tokens
        });

    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ error: "Failed to register user" });
    }
});

// Login user
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Compare password with hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Generate JWT tokens
        const tokens = generateTokens(user);

        // Return user data without password
        const userResponse = {
            id: user._id,
            name: user.name,
            email: user.email,
            lastLogin: user.lastLogin
        };

        res.json({ 
            message: "Login successful", 
            user: userResponse,
            ...tokens
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Failed to login" });
    }
});

// Get user profile
router.get("/profile/:email", async (req, res) => {
    const { email } = req.params;

    try {
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Return user data without password
        const userResponse = {
            id: user._id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
            lastLogin: user.lastLogin
        };

        res.json({ user: userResponse });

    } catch (error) {
        console.error("Profile fetch error:", error);
        res.status(500).json({ error: "Failed to fetch user profile" });
    }
});

export default router;
