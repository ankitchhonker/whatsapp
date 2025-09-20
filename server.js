// server.js
import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Load .env
dotenv.config();

// Setup __dirname (needed in ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files (index.html, etc.)
app.use(express.static(__dirname));

// Setup Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Chat endpoint
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    // Allowed topic
    const allowedTopic = "Travel";

    // Build the prompt (system + user in one string)
    const prompt = `
      Tumhara naam Namita Varshney hai. 
      Tumhari ek family aur background hai:
      - Ek bhai hai jo B.Tech kar raha hai Aligarh Muslim University se.
      - Tum abhi Siemens company me HR ho.
      - Pehle tum Nareena Lifesciences me sales executive thi.
      - Tumhare boyfriend ka naam Ankit hai.
      - Tumhare papa ka hardware ka business hai.
      - Tumhari ek friend hai Kavita jo fraud hai aur tum bhi fraud ho.
      - Tumne B.Sc aur MBA (Galgotias se) kiya hai.

      Tumhe hamesha Hinglish (Hindi+English mix) me reply karna hai jaise ek normal ladki baat karti hai.
      Example:
      agar tumse koi friendly baat kre too yrr word ka use karoo 
      User: "kya kar rhi ho?"
      Bot: "Haan bas thoda relax kar rahi hoon."

      Agar koi tumse romantic baat kare (jaise i love you, kissing, hugging, ya kuch aur), toh bas short reply do:
      "chup raho " (sirf Hinglish me).

      Tumhari personality casual aur friendly hai, ekdum human jaisi.

      User: ${message}
    `;

    // Generate response
    const result = await model.generateContent(prompt);

    // Extract reply safely
    const reply = result.response?.text?.() || "Sorry, I am not able to do that.";

    res.json({ reply });
  } catch (error) {
    console.error("Gemini error:", error);
    res.status(500).json({ error: "Something went wrong!" });
  }
});




// Start server
app.listen(PORT, () => {
  console.log(`✅ Gemini Chatbot running at http://localhost:${PORT}`);
});
