import express from "express";
import UserMemory from "../models/UserMemory.js";

const router = express.Router();

// Get user's memory profile
router.get("/:userId", async (req, res) => {
    const { userId } = req.params;
    
    try {
        let userMemory = await UserMemory.findOne({ userId });
        
        if (!userMemory) {
            return res.json({ memories: [], totalMemories: 0 });
        }
        
        res.json({
            memories: userMemory.memories,
            totalMemories: userMemory.totalMemories,
            lastUpdated: userMemory.lastUpdated
        });
        
    } catch (error) {
        console.error("Error fetching memories:", error);
        res.status(500).json({ error: "Failed to fetch memories" });
    }
});

// Add or update a memory
router.post("/", async (req, res) => {
    const { userId, userEmail, key, value, category = 'other', importance = 3 } = req.body;
    
    if (!userId || !key || !value) {
        return res.status(400).json({ error: "userId, key, and value are required" });
    }
    
    try {
        let userMemory = await UserMemory.findOne({ userId });
        
        if (!userMemory) {
            userMemory = new UserMemory({
                userId,
                userEmail,
                memories: []
            });
        }
        
        userMemory.addMemory(key, value, category, importance);
        await userMemory.save();
        
        res.json({
            message: "Memory saved successfully",
            memory: { key, value, category, importance },
            totalMemories: userMemory.totalMemories
        });
        
    } catch (error) {
        console.error("Error saving memory:", error);
        res.status(500).json({ error: "Failed to save memory" });
    }
});

// Delete a memory
router.delete("/:userId/:key", async (req, res) => {
    const { userId, key } = req.params;
    
    try {
        const userMemory = await UserMemory.findOne({ userId });
        
        if (!userMemory) {
            return res.status(404).json({ error: "User memory not found" });
        }
        
        const initialLength = userMemory.memories.length;
        userMemory.memories = userMemory.memories.filter(
            m => m.key.toLowerCase() !== key.toLowerCase()
        );
        
        if (userMemory.memories.length === initialLength) {
            return res.status(404).json({ error: "Memory not found" });
        }
        
        userMemory.totalMemories = userMemory.memories.length;
        userMemory.lastUpdated = new Date();
        await userMemory.save();
        
        res.json({ message: "Memory deleted successfully" });
        
    } catch (error) {
        console.error("Error deleting memory:", error);
        res.status(500).json({ error: "Failed to delete memory" });
    }
});

// Get memory context for AI (formatted text)
router.get("/:userId/context", async (req, res) => {
    const { userId } = req.params;
    
    try {
        const userMemory = await UserMemory.findOne({ userId });
        
        if (!userMemory || userMemory.memories.length === 0) {
            return res.json({ context: "" });
        }
        
        const context = userMemory.getMemoriesAsText();
        res.json({ context });
        
    } catch (error) {
        console.error("Error getting memory context:", error);
        res.status(500).json({ error: "Failed to get memory context" });
    }
});

export default router;
