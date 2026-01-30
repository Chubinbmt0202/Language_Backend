const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(process.cwd(), "data");

let GLOBAL_QUESTION_BANK = [];

/**
 * Duyệt thư mục đệ quy, lấy tất cả file .json
 */
const getAllJsonFiles = (dirPath, arrayOfFiles = []) => {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);

    if (fs.statSync(fullPath).isDirectory()) {
      getAllJsonFiles(fullPath, arrayOfFiles);
    } else if (file.endsWith(".json")) {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
};

const loadDatabase = () => {
  try {
    GLOBAL_QUESTION_BANK = [];
    let count = 0;

    if (!fs.existsSync(DATA_DIR)) {
      console.warn("⚠️ Folder data không tồn tại");
      return false;
    }

    const jsonFiles = getAllJsonFiles(DATA_DIR);

    jsonFiles.forEach((filePath) => {
      try {
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const data = JSON.parse(fileContent);

        if (Array.isArray(data)) {
          GLOBAL_QUESTION_BANK.push(...data);
          count += data.length;
        }
      } catch (err) {
        console.error(`⚠️ Lỗi JSON ở file ${filePath}:`, err.message);
      }
    });

    console.log("------------------------------------------------");
    console.log(`✅ Đã load ${count} câu hỏi từ ${jsonFiles.length} file`);
    jsonFiles.forEach((f) =>
      console.log("📄", path.relative(DATA_DIR, f))
    );
    console.log("------------------------------------------------");

    return true;
  } catch (error) {
    console.error("❌ Lỗi load dữ liệu:", error);
    return false;
  }
};

// Getter
const getQuestionsByType = (type) => {
  return GLOBAL_QUESTION_BANK.filter((q) => q.type === type);
};

const getQuestionsByTypeAndLevel = (type, level) => {
  return GLOBAL_QUESTION_BANK.filter(
    (q) => q.type === type && q.level === level
  );
};

module.exports = {
  loadDatabase,
  getQuestionsByType,
  getQuestionsByTypeAndLevel,
};
