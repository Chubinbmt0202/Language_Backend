const express = require("express");
const router = express.Router();
const quizController = require("../controllers/quizController");
const quizControllerEnglish = require("../controllers/quizControllerEnglish");

// Định nghĩa routes japanese quiz
router.post("/generate-quiz-fill", quizController.generateQuizFill);
router.post("/generate-quiz-vocab", quizController.generateQuizVocab);

// english quiz routes
router.post("/generate-quiz-wordForm", quizControllerEnglish.generateQuizEnglishWordForm);
router.post("/generate-quiz-suffixes", quizControllerEnglish.generateQuizEnglishSuffixes);
router.post("/generate-quiz-error", quizControllerEnglish.generateQuizEnglishError);
router.post("/generate-quiz-conjugation", quizControllerEnglish.generateQuizEnglishConjugation);
router.post("/generate-quiz-tense-multi", quizControllerEnglish.generateQuizEnglishTenseMulti);
router.post("/generate-quiz-tense-error", quizControllerEnglish.generateQuizEnglishTenseError);

router.get("/reload-data", quizController.reloadData);

module.exports = router;