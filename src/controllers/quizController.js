const { getQuestionsByType, loadDatabase, getQuestionsByTypeAndLevel } = require("../services/questionService");
const { shuffleArray } = require("../utils/helpers");

const generateQuizFill = (req, res) => {
  try {
    const data = req.body;
    console.log("Received data type:", data.type);

    if (!data.type) {
      return res.status(400).json({ error: "Thiếu tham số 'type' trong yêu cầu." });
    }

    let filteredQuestions = getQuestionsByType(data.type);
    console.log(`Found ${filteredQuestions.length} questions for type '${data.type}'`);

    if (filteredQuestions.length === 0) {
      return res.status(404).json({ error: `Không tìm thấy câu hỏi cho loại '${data.type}'.` });
    }

    // Xáo trộn
    filteredQuestions = shuffleArray(filteredQuestions);

    const resultQuestions = filteredQuestions.slice(0, data.numQuestions || 1);
    
    console.log(`Generated ${resultQuestions.length} questions for type '${data.type}'`);
    
    res.json({
      questions: resultQuestions,
      totalAvailable: filteredQuestions.length,
      message: `✅ Đã tạo đề thi với ${resultQuestions.length} câu hỏi cho loại '${data.type}'.`,
    });
  } catch (error) {
    console.error("Error generating quiz-fill:", error);
    res.status(500).json({ error: error.message });
  }
};

const reloadData = (req, res) => {
  loadDatabase();
  res.send("✅ Đã cập nhật dữ liệu mới từ file JSON!");
};

const generateQuizVocab = (req, res) => {
  try { 
    const data = req.body;
    console.log("Received data for vocab quiz:", data);

    let filteredQuestions = getQuestionsByTypeAndLevel(data.type, data.level);
    console.log(`Found ${filteredQuestions.length} vocab questions for type '${data.type}' and level '${data.level}'`);

    if (filteredQuestions.length === 0) {
      return res.status(404).json({ error: `Không tìm thấy câu hỏi cho loại '${data.type}' và cấp độ '${data.level}'.` });
    }

    filteredQuestions = shuffleArray(filteredQuestions);

    const resultQuestions = filteredQuestions.slice(0, data.numQuestions || 1);
    
    console.log(`Generated ${resultQuestions.length} questions for type '${data.type}' and level '${data.level}'`);
    
    res.json({
      questions: resultQuestions,
      totalAvailable: filteredQuestions.length,
      message: `✅ Đã tạo đề thi với ${resultQuestions.length} câu hỏi cho loại '${data.type}'.`,
    });
    
  } catch (error) {
    console.error("Lỗi quần què gì đó trong phần bài tập từ vựng:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  generateQuizFill,
  reloadData,
  generateQuizVocab,
};