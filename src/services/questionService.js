const fs = require("fs");
const { get } = require("http");
const path = require("path");

// Sử dụng process.cwd() để lấy thư mục gốc nơi chạy lệnh node
const DATA_DIR = path.join(process.cwd(), "data");

let GLOBAL_QUESTION_BANK = [];

const loadDatabase = () => {
  try {
    let count = 0;
    const allFiles = [];

    // Reset lại kho câu hỏi
    GLOBAL_QUESTION_BANK = [];

    if (fs.existsSync(DATA_DIR)) {
      const levels = fs.readdirSync(DATA_DIR);

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
                console.error(`⚠️ Lỗi cú pháp JSON ở file ${file}:`, err.message);
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
    return true;
  } catch (error) {
    console.error("❌ Lỗi load dữ liệu:", error);
    return false;
  }
};

// Hàm lấy dữ liệu (Getter)
const getQuestionsByType = (type) => {
  return GLOBAL_QUESTION_BANK.filter((q) => q.type === type);
};

const getQuestionsByTypeAndLevel = (type, level) => {
  return GLOBAL_QUESTION_BANK.filter((q) => q.type === type && q.level === level);
};

module.exports = {
  loadDatabase,
  getQuestionsByType,
  getQuestionsByTypeAndLevel,
};