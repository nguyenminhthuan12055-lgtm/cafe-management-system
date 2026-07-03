const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const verifyToken = require("../middlewares/authMiddleware"); // <-- Import ổ khóa vào đây

router.get("/api/categories", orderController.getCategories);

// Chỉ ai có Token hợp lệ mới được đi qua chốt chặn verifyToken để vào tạo hóa đơn!
router.post("/api/orders", verifyToken, orderController.createOrder);

module.exports = router;
