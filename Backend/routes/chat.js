import express from "express";
import Thread from "../models/Thread.js";
import UserMemory from "../models/UserMemory.js";
import getAIResponse from "../utils/openai.js";
import { chatLimiter } from "../middleware/rateLimiter.js";
import { chatValidation, threadIdValidation, getThreadsValidation } from "../middleware/validators.js";

const router = express.Router();

// Get all threads for a specific user
router.get("/threads", async(req, res) => {
    const { userId } = req.query;
    
    try {
        const threads = await Thread.find({ userId }).sort({updatedAt: -1});
        res.json(threads);
    } catch(err) {
        console.log('Error fetching threads:', err);
        res.status(500).json({error: "Failed to fetch threads"});
    }
});

// Get a specific thread
router.get("/threads/:threadId", async(req, res) => {
    const {threadId} = req.params;
    const { userId } = req.query;

    try {
        const thread = await Thread.findOne({threadId, userId});

        if(!thread) {
            return res.status(404).json({error: "Thread not found"});
        }

        res.json(thread.messages);
    } catch(err) {
        console.log(err);
        res.status(500).json({error: "Failed to fetch chat"});
    }
});

// Delete a thread
router.delete("/threads/:threadId", async (req, res) => {
    const {threadId} = req.params;
    const { userId } = req.query;

    try {
        const deletedThread = await Thread.findOneAndDelete({threadId, userId});

        if(!deletedThread) {
            return res.status(404).json({error: "Thread not found"});
        }

        res.status(200).json({success : "Thread deleted successfully"});

    } catch(err) {
        console.log(err);
        res.status(500).json({error: "Failed to delete thread"});
    }
});

// Send a message and get AI response
router.post("/", async(req, res) => {
    const {threadId, message, userId, userEmail, image, personality = 'professional'} = req.body;
    
    console.log('\n📨 Chat request received:');
    console.log('- Message:', message);
    console.log('- Personality:', personality);
    console.log('- Has image:', !!image);
    console.log('- Image size:', image ? `${(image.length / 1024).toFixed(2)} KB` : 'N/A');

    // Message is optional if image is provided
    if(!message && !image) {
        return res.status(400).json({error: "Either message or image must be provided"});
    }

    try {
        // Get user's memory context
        let memoryContext = '';
        try {
            const userMemory = await UserMemory.findOne({ userId });
            if (userMemory && userMemory.memories.length > 0) {
                memoryContext = userMemory.getMemoriesAsText();
                console.log('- Using memory context:', userMemory.memories.length, 'memories');
            }
        } catch (memError) {
            console.log('- No memory context available');
        }
        
        let thread = await Thread.findOne({threadId, userId});

        if (!thread) {
            thread = new Thread({
                threadId,
                userId,
                userEmail,
                title: message.substring(0, 50) + (message.length > 50 ? "..." : ""),
                messages: [{role: "user", content: message}]
            });
        } else {
            thread.messages.push({role: "user", content: message});
        }

        const assistantReply = await getAIResponse(message, image, personality, memoryContext);
        
        if (!assistantReply) {
            return res.status(500).json({error: "No response from AI"});
        }

        thread.messages.push({role: "assistant", content: assistantReply});
        thread.updatedAt = new Date();

        await thread.save();
        
        res.json({reply: assistantReply});
    } catch(err) {
        console.error("Error in /chat route:", err.message);
        res.status(500).json({error: err.message || "something went wrong"});
    }
});

export default router;