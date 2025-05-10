rp// Import dependencies
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
        "https://v0-nutri-scan-plum-scanner-page.vercel.app",
        "http://localhost:3000" // Add this line
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
            'hy', 'hi', 'hello', 'hey', 'Namaste',
        
            // Basic nutrition-related terms
            'calorie', 'calories', 'protein', 'carbs', 'carbohydrates', 'fat', 'fats',
            'nutrition', 'nutrients', 'vitamin', 'vitamins', 'mineral', 'minerals',
            'diet', 'fiber', 'sugar', 'cholesterol', 'saturated fat', 'macro', 'macros',
            'healthy food', 'nutrition facts', 'nutritional value',
        
            // Conversational health-check queries
            'is apple good for health', 'apple is good for health', 'apple is good for health or not',
            'banana is good for health', 'is banana healthy', 'banana is good for health or not',
            'is milk healthy', 'milk is good for health', 'milk is good for health or not',
            'is rice good for health', 'rice is good for health', 'rice is good for health or not',
            'is egg healthy', 'egg is good for health or not',
            'is peanut butter good for weight gain', 'is olive oil good for heart',
            'is avocado keto friendly', 'is watermelon low carb', 'is tofu high protein',
            'is chicken good for diabetics', 'can I eat apple daily', 'should I avoid sugar',
            'is this healthy', 'is this unhealthy', 'is this food healthy', 'is it healthy',
            'is it unhealthy', 'is this healthy or not', 'is it healthy or not',
            'is this good for health', 'is this good or bad for health', 'this food is healthy or not',
            'should I eat this', 'how healthy is this', 'is it good to eat daily', 'is it safe to eat',
        
            // Dietary intent/context queries
            'how many calories in', 'macronutrients of', 'nutritional breakdown of',
            'what nutrients are in', 'carbs in', 'protein content of', 'fat content of',
            'does it have sugar', 'is it gluten free', 'is it dairy free', 'is it vegan',
        
            // Curiosity-driven questions
            'what’s in', 'nutrition info for', 'nutrition data for', 'breakdown of',
            'how healthy is', 'benefits of eating', 'should I eat',
        
            // Specific nutrient interests
            'omega 3', 'iron', 'zinc', 'calcium', 'potassium', 'sodium', 'magnesium',
            'antioxidants', 'probiotics', 'enzymes', 'natural sugar', 'artificial sweetener',
        
            // Common food items
            'apple', 'banana', 'orange', 'grapes', 'watermelon', 'mango', 'pineapple',
            'papaya', 'strawberry', 'blueberry', 'cherry', 'pomegranate', 'kiwi', 'peach',
            'plum', 'pear', 'guava', 'lemon', 'lime', 'coconut', 'avocado', 'fig', 'dates',
        
            'carrot', 'beetroot', 'spinach', 'broccoli', 'cauliflower', 'potato', 'tomato',
            'onion', 'garlic', 'cabbage', 'lettuce', 'cucumber', 'peas', 'corn', 'pumpkin',
        
            'rice', 'wheat', 'bread', 'oats', 'quinoa', 'barley', 'millet', 'maize',
        
            'milk', 'curd', 'butter', 'cheese', 'paneer', 'yogurt', 'ghee',
        
            'egg', 'chicken', 'mutton', 'fish', 'prawns', 'salmon', 'tuna',
        
            'tofu', 'soy', 'soy milk', 'almond milk', 'peanut butter', 'nuts', 'almonds',
            'cashew', 'walnut', 'pistachio', 'chia seeds', 'flaxseeds', 'sunflower seeds',
        
            'olive oil', 'mustard oil', 'coconut oil', 'ghee',
        
            'biscuit', 'chocolate', 'ice cream', 'cake', 'pastry', 'chips', 'soda', 'juice'
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
