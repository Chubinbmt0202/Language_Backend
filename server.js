require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const port = process.env.PORT || 9999;

app.use(cors());
app.use(express.json());

/* =========================================
   1. HỆ THỐNG LOAD DỮ LIỆU TỰ ĐỘNG
   (Giữ nguyên vì logic này đã rất tốt)
========================================= */
const DATA_DIR = path.join(__dirname, "data");
let GLOBAL_QUESTION_BANK = [];

const loadDatabase = () => {
  try {
    let count = 0;
    const allFiles = [];

    // Reset lại kho câu hỏi trước khi load
    GLOBAL_QUESTION_BANK = [];

    if (fs.existsSync(DATA_DIR)) {
      const levels = fs.readdirSync(DATA_DIR); // ['N5', 'N4']

      levels.forEach((level) => {
        const levelPath = path.join(DATA_DIR, level);

        if (fs.statSync(levelPath).isDirectory()) {
          const files = fs.readdirSync(levelPath);

          files.forEach((file) => {
            if (file.endsWith(".json")) {
              const filePath = path.join(levelPath, file);
              const fileContent = fs.readFileSync(filePath, "utf-8");
              try {
                const questions = JSON.parse(fileContent);
                if (Array.isArray(questions)) {
                  GLOBAL_QUESTION_BANK.push(...questions);
                  count += questions.length;
                  allFiles.push(`${level}/${file}`);
                }
              } catch (err) {
                console.error(
                  `⚠️ Lỗi cú pháp JSON ở file ${file}:`,
                  err.message,
                );
              }
            }
          });
        }
      });
    }

    console.log("------------------------------------------------");
    console.log(`✅ Đã load thành công ${count} mục dữ liệu từ:`);
    console.log(allFiles.join(", "));
    console.log("------------------------------------------------");
  } catch (error) {
    console.error("❌ Lỗi load dữ liệu:", error);
  }
};

loadDatabase();

/* =========================================
   2. HÀM TIỆN ÍCH
========================================= */
const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

/* =========================================
   3. API ENDPOINT (ĐÃ CẬP NHẬT)
========================================= */

// Danh sách các loại bài tập dạng "Gõ phím"
const TYPING_GAME_TYPES = [
  "hiragana-text",
  "katakana-text",
  "kanji-text",
  "mixed-text",
];

app.post("/api/generate-quiz-fill", (req, res) => {
  try {
    const data = req.body;
    console.log("Received data:", data.type);
    if (!data.type) {
      res.status(400).json({ error: "Thiếu tham số 'type' trong yêu cầu." });
      return;
    }

    let filteredQuestions = GLOBAL_QUESTION_BANK.filter(
      (q) => q.type === data.type,
    );
    console.log(`Found ${filteredQuestions.length} questions for type '${data.type}'`);

    if (filteredQuestions.length === 0) {
      res
        .status(404)
        .json({ error: `Không tìm thấy câu hỏi cho loại '${data.type}'.` });
      return;
    }

    filteredQuestions = shuffleArray(filteredQuestions);

    const resultQuestions = filteredQuestions.slice(0, data.numQuestions || 1);
    console.log(`Generated ${resultQuestions.length} questions for type '${data.type}'`);
    res.json({
      questions: resultQuestions,
      totalAvailable: filteredQuestions.length,
      message: `✅ Đã tạo đề thi với ${resultQuestions.length} câu hỏi cho loại '${data.type}'.`,
    })
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.error("Error generating quiz-fill:", error);
  }
});


// Endpoint reload data nóng
app.get("/api/reload-data", (req, res) => {
  loadDatabase();
  res.send("✅ Đã cập nhật dữ liệu mới từ file JSON!");
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
