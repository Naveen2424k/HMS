const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function listModels() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    try {
        // There isn't a direct listModels on the instance, usually it's a fetch or we just try a generation.
        // Actually, checking the docs or library source, listModels might not be exposed directly in this helper for the user's key seamlessly in all versions.
        // But let's try a simple generation with 'gemini-pro' and 'gemini-1.5-flash' to see which one works in a standalone script.

        console.log("Testing gemini-1.5-flash...");
        const modelFlash = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const resultFlash = await modelFlash.generateContent("Hello");
        console.log("gemini-1.5-flash Success:", resultFlash.response.text());
    } catch (error) {
        console.error("gemini-1.5-flash Failed:", error.message);
    }

    try {
        console.log("Testing gemini-pro...");
        const modelPro = genAI.getGenerativeModel({ model: "gemini-pro" });
        const resultPro = await modelPro.generateContent("Hello");
        console.log("gemini-pro Success:", resultPro.response.text());
    } catch (error) {
        console.error("gemini-pro Failed:", error.message);
    }
}

listModels();
