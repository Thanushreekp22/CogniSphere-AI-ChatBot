import express from "express";
import { getDebateResponse } from "../utils/openai.js";

const router = express.Router();

// Start a debate on a topic
router.post("/", async (req, res) => {
    const { topic, rounds = 5 } = req.body;
    
    if (!topic || !topic.trim()) {
        return res.status(400).json({ error: "Debate topic is required" });
    }
    
    if (rounds < 1 || rounds > 10) {
        return res.status(400).json({ error: "Rounds must be between 1 and 10" });
    }
    
    try {
        console.log(`🎭 Starting debate on: "${topic}" with ${rounds} rounds`);
        
        const debateHistory = await getDebateResponse(topic, rounds);
        
        res.json({
            topic,
            rounds,
            debate: debateHistory,
            totalArguments: debateHistory.length
        });
        
    } catch (error) {
        console.error("Debate error:", error);
        res.status(500).json({ 
            error: error.message || "Failed to generate debate" 
        });
    }
});

export default router;
