const sql = require("mssql");
require("dotenv").config();

// Cấu hình thông tin kết nối từ cơ sở dữ liệu hoặc file .env
const config = {
  user: process.env.DB_USER || "sa",
  password: process.env.DB_PASSWORD, // Mật khẩu SQL Server của bạn
  server: process.env.DB_SERVER || "localhost",
  database: process.env.DB_DATABASE || "CafeManagement", // ✅ sửa DB_NAME -> DB_DATABASE cho khớp .env
  options: {
    encrypt: false, // Để false nếu chạy dưới local (localhost)
    trustServerCertificate: true, // Bắt buộc khi dùng SQL Server trên máy cục bộ
  },
};

// Khởi tạo Connection Pool toàn cục
let poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then((pool) => {
    console.log("🔌 Kết nối SQL Server thành công!");
    return pool;
  })
  .catch((err) => {
    console.error("❌ Lỗi kết nối SQL Server chi tiết: ", err);
    process.exit(1);
  });

// Hàm lấy đối tượng kết nối
async function getConnection() {
  return poolPromise;
}

// Bắt buộc phải export đúng cấu trúc object để file server.js đọc được
module.exports = {
  getConnection,
  sql,
};
