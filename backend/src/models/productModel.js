const { getConnection, sql } = require("../../config/db");

const Product = {
  // Lấy tất cả sản phẩm kèm danh mục
  getAll: async () => {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT p.id, p.name AS product_name, p.price, c.name AS category_name, p.status, p.categoryId
      FROM Products p
      LEFT JOIN Categories c ON p.categoryId = c.id
    `);
    return result.recordset;
  },

  // Thêm món mới
  create: async (productData) => {
    const { name, price, categoryId, status } = productData;
    const pool = await getConnection();
    return pool
      .request()
      .input("name", sql.NVarChar, name)
      .input("price", sql.Decimal(18, 2), price)
      .input("categoryId", sql.Int, categoryId)
      .input("status", sql.NVarChar, status || "Active").query(`
        INSERT INTO Products (name, price, categoryId, status)
        VALUES (@name, @price, @categoryId, @status)
      `);
  },
};

module.exports = Product;
