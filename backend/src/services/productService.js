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

  // ✅ Sửa món ăn
  editProduct: async (id, productData) => {
    const existing = await Product.getById(id);
    if (!existing) {
      throw new Error("Không tìm thấy món ăn này!");
    }
    if (!productData.name || !productData.price) {
      throw new Error("Tên và giá sản phẩm không được để trống!");
    }
    return await Product.update(id, productData);
  },

  // ✅ Xóa món ăn
  deleteProduct: async (id) => {
    const existing = await Product.getById(id);
    if (!existing) {
      throw new Error("Không tìm thấy món ăn này!");
    }
    return await Product.remove(id);
  },
};

module.exports = productService;
