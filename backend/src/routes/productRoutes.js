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

router.post("/api/products", verifyToken, productController.createProduct);

// ✅ Sửa và xóa món ăn - chỉ nhân viên/quản trị đã đăng nhập
router.put("/api/products/:id", verifyToken, productController.updateProduct);
router.delete("/api/products/:id", verifyToken, productController.deleteProduct);

module.exports = router;
