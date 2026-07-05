const productService = require("../services/productService");

const productController = {
  getAllProducts: async (req, res) => {
    try {
      const data = await productService.getProductsList();
      res.json({
        status: "success",
        total_items: data.length,
        data: data,
      });
    } catch (err) {
      res.status(500).json({ status: "error", message: err.message });
    }
  },

  createProduct: async (req, res) => {
    try {
      await productService.addProduct(req.body);
      res.json({ status: "success", message: "Thêm món ăn thành công!" });
    } catch (err) {
      res.status(400).json({ status: "error", message: err.message });
    }
  },

  // ✅ Sửa món ăn
  updateProduct: async (req, res) => {
    try {
      const product = await productService.editProduct(req.params.id, req.body);
      res.json({ status: "success", message: "Cập nhật món ăn thành công!", data: product });
    } catch (err) {
      res.status(400).json({ status: "error", message: err.message });
    }
  },

  // ✅ Xóa món ăn
  deleteProduct: async (req, res) => {
    try {
      await productService.deleteProduct(req.params.id);
      res.json({ status: "success", message: "Xóa món ăn thành công!" });
    } catch (err) {
      res.status(400).json({ status: "error", message: err.message });
    }
  },
};

module.exports = productController;
