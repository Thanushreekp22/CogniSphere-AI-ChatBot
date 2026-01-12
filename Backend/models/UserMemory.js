import mongoose from "mongoose";

const MemoryItemSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true
    },
    value: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['personal', 'preference', 'skill', 'goal', 'fact', 'other'],
        default: 'other'
    },
    importance: {
        type: Number,
        min: 1,
        max: 5,
        default: 3
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastUsed: {
        type: Date,
        default: Date.now
    },
    useCount: {
        type: Number,
        default: 0
    }
});

const UserMemorySchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    userEmail: {
        type: String,
        required: true
    },
    memories: [MemoryItemSchema],
    totalMemories: {
        type: Number,
        default: 0
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

// Method to add or update memory
UserMemorySchema.methods.addMemory = function(key, value, category = 'other', importance = 3) {
    const existingMemoryIndex = this.memories.findIndex(m => m.key.toLowerCase() === key.toLowerCase());
    
    if (existingMemoryIndex > -1) {
        // Update existing memory
        this.memories[existingMemoryIndex].value = value;
        this.memories[existingMemoryIndex].category = category;
        this.memories[existingMemoryIndex].importance = importance;
        this.memories[existingMemoryIndex].lastUsed = new Date();
        this.memories[existingMemoryIndex].useCount += 1;
    } else {
        // Add new memory
        this.memories.push({ key, value, category, importance });
        this.totalMemories += 1;
    }
    
    this.lastUpdated = new Date();
};

// Method to get all memories as formatted text for AI
UserMemorySchema.methods.getMemoriesAsText = function() {
    if (this.memories.length === 0) return '';
    
    // Sort by importance and recent usage
    const sortedMemories = this.memories.sort((a, b) => {
        return (b.importance * b.useCount) - (a.importance * a.useCount);
    });
    
    const memoryText = sortedMemories.map(m => 
        `- ${m.key}: ${m.value}`
    ).join('\n');
    
    return `\n[User Profile - Remember these facts about the user]\n${memoryText}\n`;
};

// Method to increment use count for relevant memories
UserMemorySchema.methods.useMemory = function(key) {
    const memory = this.memories.find(m => m.key.toLowerCase() === key.toLowerCase());
    if (memory) {
        memory.useCount += 1;
        memory.lastUsed = new Date();
    }
};

export default mongoose.model("UserMemory", UserMemorySchema);
