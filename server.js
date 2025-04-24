// Import dependencies
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Additional Middleware
app.use(cors({
    origin: [
        "https://chatbot-nine-rosy-40.vercel.app",
    ],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
}));

app.options("/receive", cors());
app.options("/receive", cors()); // Preflight request handling
   // Allow frontend requests
app.use(express.json()); // Parse JSON data

// Initialize Google AI
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

// Routes
app.get("/", (req, res) => {
    res.send("Server is running");
});

app.post("/receive", async (req, res) => {
    try { 
        const userInput = req.body.userInput;

        // Simple keyword list for nutrition-related topics
        const nutritionKeywords = [
            "calorie", "calories", "protein", "carbs", "carbohydrates", "fat", "fats",
            "nutrition", "nutrients", "vitamin", "vitamins", "mineral", "minerals",
            "diet", "fiber", "sugar", "cholesterol", "saturated fat", "macro", "macros",
            "healthy food", "nutrition facts", "nutritional value"
        ];

        const isNutritionRelated = nutritionKeywords.some(keyword =>
            userInput.toLowerCase().includes(keyword)
        );

        if (!isNutritionRelated) {
            return res.json({ response: "Please ask a nutrition-related question." });
        }

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: req.body.userInput,
            parameters: {
                temperature: 0.5,
                maxOutputTokens: 200, 
                topP: 0.8,
                topK: 40,
            },
        });

        // Check if response has the expected structure
        if (response && response.text) {
            res.json({ response: response.text });
        } else {
            console.error("Unexpected response structure:", response);
            res.status(500).json({ error: "Unexpected response from AI" });
        }
    } catch (error) {
        console.error("Error in AI processing:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

 // Preflight request handling

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
