const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const verifyToken = require("../middlewares/authMiddleware");

router.get("/api/categories", orderController.getCategories);

// Chỉ ai có Token hợp lệ mới được đi qua chốt chặn verifyToken để vào tạo hóa đơn!
router.post("/api/orders", verifyToken, orderController.createOrder);

// ✅ Lịch sử hóa đơn + chi tiết + cập nhật trạng thái + thống kê doanh thu
router.get("/api/orders", verifyToken, orderController.getOrderHistory);
router.get("/api/orders/report/revenue", verifyToken, orderController.getRevenueReport);
router.get("/api/orders/:id/items", verifyToken, orderController.getOrderItems);
router.put("/api/orders/:id/status", verifyToken, orderController.updateOrderStatus);

module.exports = router;
