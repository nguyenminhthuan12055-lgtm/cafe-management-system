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

  getById: async (id) => {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query("SELECT * FROM Products WHERE id = @id");
    return result.recordset[0];
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

  // ✅ Sửa món ăn
  update: async (id, productData) => {
    const { name, price, categoryId, status } = productData;
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .input("name", sql.NVarChar, name)
      .input("price", sql.Decimal(18, 2), price)
      .input("categoryId", sql.Int, categoryId)
      .input("status", sql.NVarChar, status || "Active").query(`
        UPDATE Products
        SET name = @name, price = @price, categoryId = @categoryId, status = @status
        OUTPUT INSERTED.*
        WHERE id = @id
      `);
    return result.recordset[0];
  },

  // ✅ Xóa món ăn
  remove: async (id) => {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query("DELETE FROM Products WHERE id = @id");
    return result.rowsAffected[0] > 0;
  },
};

module.exports = Product;
