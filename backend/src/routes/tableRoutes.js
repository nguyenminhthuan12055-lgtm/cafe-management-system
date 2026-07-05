const express = require("express");
const router = express.Router();
const tableController = require("../controllers/tableController");
const verifyToken = require("../middlewares/authMiddleware");

// GET danh sách bàn - công khai (để trang đặt bàn của khách xem bàn trống)
router.get("/api/tables", tableController.getAllTables);

// Các thao tác quản lý bàn - chỉ nhân viên/quản trị đã đăng nhập mới được phép
router.post("/api/tables", verifyToken, tableController.createTable);
router.put("/api/tables/:id", verifyToken, tableController.updateTable);
router.put("/api/tables/:id/status", verifyToken, tableController.updateTableStatus);
router.delete("/api/tables/:id", verifyToken, tableController.deleteTable);

module.exports = router;
