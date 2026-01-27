require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

/* =========================================
   1. HỆ THỐNG LOAD DỮ LIỆU TỰ ĐỘNG
========================================= */
const DATA_DIR = path.join(__dirname, "data");

// Biến toàn cục chứa toàn bộ câu hỏi (In-Memory Database)
let GLOBAL_QUESTION_BANK = [];

const loadDatabase = () => {
  try {
    let count = 0;
    const allFiles = [];
    
    // 1. Quét các thư mục con (N5, N4...)
    if (fs.existsSync(DATA_DIR)) {
      const levels = fs.readdirSync(DATA_DIR); // ['N5', 'N4']

      levels.forEach(level => {
        const levelPath = path.join(DATA_DIR, level);
        
        // Chỉ xử lý nếu là thư mục
        if (fs.statSync(levelPath).isDirectory()) {
          const files = fs.readdirSync(levelPath); // ['trac_nghiem.json', ...]

          files.forEach(file => {
            if (file.endsWith(".json")) {
              // 2. Đọc nội dung từng file
              const filePath = path.join(levelPath, file);
              const fileContent = fs.readFileSync(filePath, "utf-8");
              try {
                const questions = JSON.parse(fileContent);
                if (Array.isArray(questions)) {
                  // Gộp vào kho chung
                  GLOBAL_QUESTION_BANK.push(...questions);
                  count += questions.length;
                  allFiles.push(`${level}/${file}`);
                }
              } catch (err) {
                console.error(`⚠️ Lỗi cú pháp JSON ở file ${file}:`, err.message);
              }
            }
          });
        }
      });
    }

    console.log("------------------------------------------------");
    console.log(`✅ Đã load thành công ${count} câu hỏi từ các file:`);
    console.log(allFiles.join(", "));
    console.log("------------------------------------------------");

  } catch (error) {
    console.error("❌ Lỗi load dữ liệu:", error);
  }
};

// Gọi hàm load ngay khi server khởi động
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
   3. API ENDPOINT (PHỤC VỤ FRONTEND)
========================================= */
app.post("/api/generate-quiz", (req, res) => {
  try {
    const { type = "multiple-choice", count = 5, level = "N5", topic = "General" } = req.body;

    // 1. Lọc câu hỏi từ kho chung
    let filteredQuestions = GLOBAL_QUESTION_BANK.filter(q => {
      // Bắt buộc trùng Type (trắc nghiệm vs hiragana)
      if (q.type !== type) return false;
      // Bắt buộc trùng Level
      if (q.level !== level) return false;
      
      // Lọc Topic (Nếu user chọn General thì lấy tất, ngược lại phải đúng topic)
      // Lưu ý: Trong file json bạn nên lưu topic là "Vocabulary", "Kanji"...
      if (topic !== "General" && q.topic !== topic) return false;

      return true;
    });

    // 2. Nếu không có câu nào
    if (filteredQuestions.length === 0) {
      // Fallback: Nếu không có đúng Topic, thử lấy "General" hoặc lấy tất cả cùng Level
      filteredQuestions = GLOBAL_QUESTION_BANK.filter(q => q.type === type && q.level === level);
      
      if (filteredQuestions.length === 0) {
         return res.status(404).json({ 
           success: false, 
           message: `Chưa có dữ liệu cho ${level} - ${type}` 
         });
      }
    }

    // 3. Trộn ngẫu nhiên
    const shuffled = shuffleArray(filteredQuestions);

    // 4. Lấy số lượng cần thiết
    // (Nếu là hiragana-text, ta chỉ lấy 1 bài để hiển thị, hoặc lấy mảng 1 phần tử)
    let resultData = null;

    if (type === "hiragana-text") {
      // Frontend Hiragana đang mong chờ { chars: [], meaning: "" }
      // Lấy phần tử đầu tiên sau khi shuffle
      const randomLesson = shuffled[0];
      resultData = {
        chars: randomLesson.chars,
        meaning: randomLesson.meaning
      };
      console.log(`🚀 Served request: ${level} - ${type} - ${topic} (Found ${filteredQuestions.length} items)`);
    } else {
      // Trắc nghiệm: Trả về danh sách
      resultData = shuffled.slice(0, count);
    }

    console.log(`🚀 Served request: ${level} - ${type} - ${topic} (Found ${filteredQuestions.length} items)`);
    
    res.json({ success: true, data: resultData });

  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
});

// Endpoint phụ để reload lại dữ liệu mà không cần tắt server (Tiện khi bạn thêm file json mới)
app.get("/api/reload-data", (req, res) => {
  GLOBAL_QUESTION_BANK = [];
  loadDatabase();
  res.send("Đã cập nhật dữ liệu mới!");
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});