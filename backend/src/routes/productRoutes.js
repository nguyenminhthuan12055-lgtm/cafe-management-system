const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const verifyToken = require("../middlewares/authMiddleware");

/**
 * @swagger
 * /api/products:
 * get:
 * summary: Lấy danh sách tất cả món ăn
 * tags: [Products]
 * responses:
 * 200:
 * description: Trả về danh sách món ăn thành công.
 */
router.get("/api/products", productController.getAllProducts);

// ✅ Route còn thiếu để thêm món ăn mới
router.post("/api/products", verifyToken, productController.createProduct);

module.exports = router;
