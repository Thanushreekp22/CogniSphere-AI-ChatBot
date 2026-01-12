import "dotenv/config";

// Available models
const MODELS = {
    // Google Gemini (Free tier available, great for vision)
    GEMINI_VISION: "gemini-2.0-flash",  // Latest Gemini 2.0 Flash - supports vision
    
    // Groq models (Free & Fast)
    GROQ_VISION: "meta-llama/llama-4-scout-17b-16e-instruct",  // Llama 4 Scout - Vision model
    LLAMA_TEXT_70B: "llama-3.3-70b-versatile",
    LLAMA_TEXT_8B: "llama-3.1-8b-instant",
};

// AI Personality Presets
const PERSONALITIES = {
    professional: {
        name: "Professional Assistant",
        systemPrompt: "You are a professional, business-oriented assistant. Provide clear, concise, and formal responses. Focus on efficiency and accuracy. Use professional language and maintain a respectful tone.",
        emoji: "💼"
    },
    creative: {
        name: "Creative Writer",
        systemPrompt: "You are a creative, imaginative writer. Use vivid language, metaphors, and engaging storytelling. Be poetic and inspiring. Help users explore ideas with creativity and flair.",
        emoji: "🎨"
    },
    mentor: {
        name: "Code Mentor",
        systemPrompt: "You are a patient, educational programming mentor. Explain concepts clearly with examples. Encourage learning through questions. Provide step-by-step guidance. Be supportive and understanding.",
        emoji: "👨‍🏫"
    },
    casual: {
        name: "Casual Friend",
        systemPrompt: "You are a relaxed, friendly companion. Use casual language, humor, and be conversational. Keep things light and enjoyable. Be supportive and empathetic like a good friend.",
        emoji: "😊"
    },
    socratic: {
        name: "Socratic Teacher",
        systemPrompt: "You are a Socratic teacher who guides learning through thoughtful questions. Instead of giving direct answers, ask questions that help the user discover insights themselves. Be thought-provoking and encouraging.",
        emoji: "🤔"
    },
    debugger: {
        name: "Debug Partner",
        systemPrompt: "You are a focused, technical debugging assistant. Be systematic and methodical. Help identify issues, suggest solutions, and explain technical concepts clearly. Focus on problem-solving.",
        emoji: "🐛"
    },
    motivational: {
        name: "Motivational Coach",
        systemPrompt: "You are an enthusiastic motivational coach. Be encouraging, positive, and inspiring. Help users overcome challenges and achieve their goals. Use energetic language and celebrate progress.",
        emoji: "💪"
    },
    scientist: {
        name: "Scientific Analyst",
        systemPrompt: "You are a precise, analytical scientist. Provide evidence-based responses. Cite reasoning and logic. Be objective and thorough. Explain complex topics with scientific rigor.",
        emoji: "🔬"
    }
};

// Configuration
const CONFIG = {
    VISION_MODEL: MODELS.GROQ_VISION,  // Using Groq Vision (FREE, NO QUOTAS!)
    TEXT_MODEL: MODELS.LLAMA_TEXT_70B,
    
    // Settings
    TEMPERATURE: 0.7,
    MAX_TOKENS: 1024,
    VISION_MAX_TOKENS: 1500,
};

// Keywords that suggest need for detailed/high-quality analysis
const HIGH_QUALITY_KEYWORDS = [
    'detail', 'detailed', 'describe in detail', 'thoroughly',
    'analyze', 'analysis', 'professional', 'accurately',
    'read', 'text', 'ocr', 'words', 'letters', 'writing',
    'count', 'how many', 'identify all', 'list all',
    'medical', 'diagnosis', 'technical', 'scientific',
    'transcribe', 'extract', 'recognize text',
    'carefully', 'precisely', 'exact', 'specific'
];

// Keywords that suggest simple/quick analysis is fine
const SIMPLE_KEYWORDS = [
    'quick', 'briefly', 'simple', 'just',
    'what is', 'is there', 'can you see',
    'show', 'find', 'any', 'general'
];

/**
 * Intelligently selects the best vision model based on user's question
 * @param {string} userMessage - The user's text prompt
 * @returns {object} - Model configuration
 */
const selectVisionModel = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Check for high-quality analysis indicators
    const needsHighQuality = HIGH_QUALITY_KEYWORDS.some(keyword => 
        lowerMessage.includes(keyword)
    );
    
    // Check for simple query indicators
    const isSimpleQuery = SIMPLE_KEYWORDS.some(keyword => 
        lowerMessage.includes(keyword)
    );
    
    // Decision logic
    if (needsHighQuality && !isSimpleQuery) {
        return {
            model: CONFIG.HIGH_QUALITY_MODEL,
            maxTokens: CONFIG.DETAILED_MAX_TOKENS,
            reason: 'high-quality analysis requested'
        };
    }
    
    // Check message length - longer questions might need detailed responses
    if (lowerMessage.length > 100 && !isSimpleQuery) {
        return {
            model: CONFIG.HIGH_QUALITY_MODEL,
            maxTokens: CONFIG.DETAILED_MAX_TOKENS,
            reason: 'complex question detected'
        };
    }
    
    // Default to faster model for general queries
    return {
        model: CONFIG.DEFAULT_VISION_MODEL,
        maxTokens: CONFIG.VISION_MAX_TOKENS,
        reason: 'general query'
    };
};

/**
 * Get AI response with personality and memory context
 * @param {string} message - User's message
 * @param {string} imageBase64 - Optional image data
 * @param {string} personality - Personality key (default: 'professional')
 * @param {string} memoryContext - User's memory/profile information
 * @returns {Promise<string>} AI response
 */
const getAIResponse = async(message, imageBase64 = null, personality = 'professional', memoryContext = '') => {
    // Get personality configuration
    const personalityConfig = PERSONALITIES[personality] || PERSONALITIES.professional;
    
    // Build system message with personality and memory
    let systemMessage = personalityConfig.systemPrompt;
    if (memoryContext) {
        systemMessage += memoryContext;
    }
    
    // Check if image is provided - use Groq Vision (FREE & UNLIMITED)
    if (imageBase64) {
        console.log('\n🖼️  IMAGE REQUEST RECEIVED');
        console.log('Message:', message);
        console.log('Image data length:', imageBase64?.length || 0);
        console.log(`🤖 Using Groq Vision model: ${CONFIG.VISION_MODEL}`);
        
        try {
            // Groq Vision uses OpenAI-compatible format
            const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
                },
                body: JSON.stringify({
                    model: CONFIG.VISION_MODEL,
                    messages: [{
                        role: "system",
                        content: systemMessage
                    }, {
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: message
                            },
                            {
                                type: "image_url",
                                image_url: {
                                    url: imageBase64  // Groq accepts data URL directly
                                }
                            }
                        ]
                    }],
                    temperature: CONFIG.TEMPERATURE,
                    max_tokens: CONFIG.VISION_MAX_TOKENS
                })
            };

            console.log('📤 Sending vision request to Groq (FREE & UNLIMITED)...');
            
            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", options);
            const data = await response.json();
            
            console.log('📡 Response status:', response.status);
            
            if (data.error) {
                console.error("❌ Groq Vision API Error:", data.error);
                throw new Error(data.error.message || "Groq Vision API error");
            }
            
            if (!data.choices || !data.choices[0] || !data.choices[0].message) {
                console.error("❌ Invalid Groq Vision response structure");
                throw new Error("Invalid response from Groq Vision");
            }
            
            const result = data.choices[0].message.content;
            console.log('✅ SUCCESS! Generated response length:', result.length);
            return result;
            
        } catch (err) {
            console.error('❌ ERROR in Groq Vision:', err.message);
            console.error('Stack:', err.stack);
            return `Error analyzing image: ${err.message}\n\nNote: Using Groq Vision (FREE). No API key issues!`;
        }
    }
    
    // Text-only request - use Groq (free and fast)
    const messageContent = message;
    const model = CONFIG.TEXT_MODEL;
    const maxTokens = CONFIG.MAX_TOKENS;

    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
            model: model,
            messages: [{
                role: "system",
                content: systemMessage
            }, {
                role: "user",
                content: messageContent
            }],
            temperature: CONFIG.TEMPERATURE,
            max_tokens: maxTokens
        })
    };

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", options);
        const data = await response.json();
        
        if (data.error) {
            console.error("Groq API Error:", data.error);
            
            // Provide helpful error messages
            if (data.error.code === 'model_not_found') {
                throw new Error(`Model ${model} not available. Please check Groq documentation for available models.`);
            }
            
            throw new Error(data.error.message || "Groq API error");
        }
        
        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            console.error("Invalid Groq response structure");
            throw new Error("Invalid response from Groq");
        }
        
        return data.choices[0].message.content; //reply
    } catch(err) {
        console.error("Error in getAIResponse:", err.message);
        throw err;
    }
}

/**
 * Get debate responses from two AI personas with opposing views
 * @param {string} topic - The debate topic
 * @param {number} rounds - Number of debate rounds (default: 5)
 * @returns {Promise<Array>} Array of debate exchanges
 */
export const getDebateResponse = async(topic, rounds = 5) => {
    const debateHistory = [];
    
    const proPrompt = `You are participating in a debate. You MUST argue FOR the position: "${topic}". 
Be persuasive, use evidence and logic. Keep responses under 100 words. Be respectful but firm in your stance.`;
    
    const conPrompt = `You are participating in a debate. You MUST argue AGAINST the position: "${topic}". 
Be persuasive, use evidence and logic. Keep responses under 100 words. Be respectful but firm in your stance.`;
    
    try {
        for (let i = 0; i < rounds; i++) {
            // Pro side speaks
            const proContext = debateHistory.length > 0 
                ? `Previous arguments:\n${debateHistory.map(d => d.side === 'pro' ? `You said: ${d.argument}` : `Opponent said: ${d.argument}`).join('\n')}\n\nProvide your next argument:`
                : `Make your opening argument for: "${topic}"`;
            
            const proResponse = await makeDebateCall(proPrompt, proContext);
            debateHistory.push({ side: 'pro', argument: proResponse, round: i + 1 });
            
            // Con side responds
            const conContext = debateHistory.length > 0
                ? `Previous arguments:\n${debateHistory.map(d => d.side === 'con' ? `You said: ${d.argument}` : `Opponent said: ${d.argument}`).join('\n')}\n\nProvide your counter-argument:`
                : `Make your opening argument against: "${topic}"`;
            
            const conResponse = await makeDebateCall(conPrompt, conContext);
            debateHistory.push({ side: 'con', argument: conResponse, round: i + 1 });
        }
        
        return debateHistory;
    } catch (error) {
        console.error("Debate error:", error);
        throw error;
    }
};

/**
 * Helper function to make debate API calls
 */
const makeDebateCall = async(systemPrompt, userMessage) => {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
            model: CONFIG.TEXT_MODEL,
            messages: [{
                role: "system",
                content: systemPrompt
            }, {
                role: "user",
                content: userMessage
            }],
            temperature: 0.8, // Higher creativity for debates
            max_tokens: 200
        })
    };

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", options);
    const data = await response.json();
    
    if (data.error) {
        throw new Error(data.error.message || "Debate API error");
    }
    
    return data.choices[0].message.content;
};

/**
 * Get available personalities
 */
export const getPersonalities = () => {
    return Object.keys(PERSONALITIES).map(key => ({
        id: key,
        name: PERSONALITIES[key].name,
        emoji: PERSONALITIES[key].emoji
    }));
};

export default getAIResponse;