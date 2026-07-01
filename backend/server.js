const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Cấu hình Middleware
app.use(cors());
app.use(express.json()); // Cho phép server đọc dữ liệu JSON gửi lên từ client

// Đường dẫn (Route) kiểm tra server ban đầu
app.get("/", (req, res) => {
  res.json({
    message: "Chào mừng bạn đến với API Hệ thống quản lý quán Cafe!",
  });
});

// Kích hoạt server lắng nghe các yêu cầu kết nối
app.listen(PORT, () => {
  console.log(`Server đang chạy ổn định tại cổng: http://localhost:${PORT}`);
});
