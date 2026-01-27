// src/routes/quiz.route.js
import express from "express";
import { generateQuiz } from "../gemini/geminiService.js";

const router = express.Router();

router.get("/generate-quiz", async (req, res) => {
    try {
        const { type, count, level, topic } = req.query;
        const quiz = await generateQuiz({ type, count: Number(count), level, topic });
        res.json(quiz);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


export default router;
