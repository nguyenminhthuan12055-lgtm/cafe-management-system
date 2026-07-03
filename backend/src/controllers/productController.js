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
      res.status(500).json({ status: "error", message: err.message });
    }
  },
};

module.exports = productController;
