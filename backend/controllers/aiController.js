const { GoogleGenerativeAI } = require("@google/generative-ai");

/**
 * Neural Nexus Chat Controller - MERN Production Ready
 */
const chatWithAI = async (req, res) => {
    try {
        const { message } = req.body;
        const apiKey = process.env.GEMINI_API_KEY;

        // Check for placeholder or missing key
        if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
            return res.json({
                text: "[DEMO MODE] Neural Link active but unauthenticated. Please add a valid GEMINI_API_KEY to your backend .env file to enable high-fidelity AI."
            });
        }

        const genAI = new GoogleGenerativeAI(apiKey);

        // High-fidelity configuration for gemini-1.5-flash
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            // generationConfig sets the tone and length for a chatbot
            generationConfig: {
                maxOutputTokens: 500,
                temperature: 0.7,
            }
        });

        // Clinical Context for the Hospital Assistant
        const prompt = `You are "Neural Nexus", the official Hospital Assistant for Medicare.
        
        Aesthetics: Elite, Institutional, Advanced, Precise.
        Tone: Professional, helpful, concise, slightly futuristic.
        
        Directives:
        1. Help with appointment scheduling guidance.
        2. Answer questions about doctors (we have 148+ specialists).
        3. Provide hospital FAQ support (Cardiology, Neurology, Emergency wings).
        4. NEVER give medical diagnoses. If asked, suggest consulting our specialists.
        5. Assist with website navigation (Dashboard, Medical Records, Billing).

        User Query: ${message}`;

        // Generating response through the Neural Nexus
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ text });

    } catch (error) {
        console.error("Neural Nexus Critical Error:", error);

        // Detailed error feedback
        const status = error.status || 500;
        const message = error.status === 404
            ? "Neural Link Error: Gemini 1.5 Flash model not found. Check API key permissions."
            : "Neural Link Error: System synchronization failure.";

        res.status(status).json({ message });
    }
};

module.exports = { chatWithAI };
