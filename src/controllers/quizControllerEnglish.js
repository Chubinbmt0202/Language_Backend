const {getQuestionsByType, loadDatabase, getQuestionsByTypeAndLevel} = require("../services/questionService");
const {shuffleArray} = require("../utils/helpers");

const generateQuizEnglishWordForm = (req, res) => {
    try {
        // Hỗ trợ cả nhận từ Body (POST) hoặc Query (GET) để linh hoạt
        const { type, level, numQuestions } = req.body; 
        
        console.log("Yêu cầu tạo bài tập:", { type, numQuestions });

        if (!type) {
            return res.status(400).json({ error: "Tham số 'type' là bắt buộc (ví dụ: 'word_form')." });
        }

        // Lấy toàn bộ câu hỏi theo Type (và Level nếu có)
        let filteredQuestions = getQuestionsByType(type);

        if (filteredQuestions.length === 0) {
            return res.status(404).json({ 
                error: `Không tìm thấy câu hỏi cho loại '${type}'${level}.` 
            });
        }

        // Trộn ngẫu nhiên
        const shuffled = shuffleArray([...filteredQuestions]);

        // Cắt số lượng câu hỏi theo yêu cầu (mặc định là 5 nếu không gửi numQuestions)
        const limit = parseInt(numQuestions) || 5;
        const resultQuestions = shuffled.slice(0, limit);

        res.json({
            success: true,
            questions: resultQuestions,
            totalAvailable: filteredQuestions.length,
            count: resultQuestions.length
        });

    } catch (error) {
        console.error("Error generating English word form quiz:", error);
        res.status(500).json({ error: "Lỗi hệ thống khi tạo câu hỏi." });
    }
};


const generateQuizEnglishSuffixes = (req, res) => {
    try {
        const { type, numQuestions } = req.body;
        console.log("Yêu cầu tạo bài tập:", { type, numQuestions });
        if (!type) {
            return res.status(400).json({ error: "Tham số 'type' là bắt buộc (ví dụ: 'suffixes')." });
        }
        let filteredQuestions = getQuestionsByType(type);
        if (filteredQuestions.length === 0) {
            return res.status(404).json({
                error: `Không tìm thấy câu hỏi cho loại '${type}'.`
            });
        }
        const shuffled = shuffleArray([...filteredQuestions]);
        const limit = parseInt(numQuestions) || 5;
        const resultQuestions = shuffled.slice(0, limit);
        res.json({
            success: true,
            questions: resultQuestions,
            totalAvailable: filteredQuestions.length,
            count: resultQuestions.length
        });
    } catch (error) {
        console.error("Error generating English suffixes quiz:", error);
        res.status(500).json({ error: "Lỗi hệ thống khi tạo câu hỏi." });
    }
};

const generateQuizEnglishError = (req, res) => {
    try {
        const { type, numQuestions } = req.body;
        console.log("Yêu cầu tạo bài tập:", { type, numQuestions });
        if (!type) {
            return res.status(400).json({ error: "Tham số 'type' là bắt buộc (ví dụ: 'error_correction')." });
        }
        let filteredQuestions = getQuestionsByType(type);
        if (filteredQuestions.length === 0) {
            return res.status(404).json({
                error: `Không tìm thấy câu hỏi cho loại '${type}'.`
            });
        }
        const shuffled = shuffleArray([...filteredQuestions]);
        const limit = parseInt(numQuestions) || 5;
        const resultQuestions = shuffled.slice(0, limit);
        res.json({
            success: true,
            questions: resultQuestions,
            totalAvailable: filteredQuestions.length,
            count: resultQuestions.length
        });
    } catch (error) {
        console.error("Error generating English error correction quiz:", error);
        res.status(500).json({ error: "Lỗi hệ thống khi tạo câu hỏi." });
    }
};

const generateQuizEnglishConjugation = (req, res) => {
    try {
        const { type, numQuestions } = req.body;
        console.log("Yêu cầu tạo bài tập:", { type, numQuestions });
        if (!type) {
            return res.status(400).json({ error: "Tham số 'type' là bắt buộc (ví dụ: 'conjugation')." });
        }   
        let filteredQuestions = getQuestionsByType(type);
        if (filteredQuestions.length === 0) {
            return res.status(404).json({
                error: `Không tìm thấy câu hỏi cho loại '${type}'.`
            });
        }
        const shuffled = shuffleArray([...filteredQuestions]);
        const limit = parseInt(numQuestions) || 5;
        const resultQuestions = shuffled.slice(0, limit);
        res.json({
            success: true,
            questions: resultQuestions,
            totalAvailable: filteredQuestions.length,
            count: resultQuestions.length
        });
    } catch (error) {
        console.error("Error generating English conjugation quiz:", error);
        res.status(500).json({ error: "Lỗi hệ thống khi tạo câu hỏi." });
    }
};

module.exports = {
    generateQuizEnglishWordForm,
    generateQuizEnglishSuffixes,
    generateQuizEnglishError,
    generateQuizEnglishConjugation
};