const express = require("express");
const router = express.Router();
const quizController = require("../controllers/quizController");

// Định nghĩa routes
router.post("/generate-quiz-fill", quizController.generateQuizFill);
router.post("/generate-quiz-vocab", quizController.generateQuizVocab);

router.get("/reload-data", quizController.reloadData);

module.exports = router;