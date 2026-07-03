const Product = require("../models/productModel");

const productService = {
  getProductsList: async () => {
    // Giả sử có logic cần xử lý filter hoặc format giá ở đây
    const products = await Product.getAll();
    return products;
  },

  addProduct: async (productData) => {
    if (!productData.name || !productData.price) {
      throw new Error("Tên và giá sản phẩm không được để trống!");
    }
    return await Product.create(productData);
  },
};

module.exports = productService;
