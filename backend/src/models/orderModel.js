const { getConnection, sql } = require("../../config/db");

const Order = {
  // Lấy tất cả danh mục để làm dropdown lọc món ăn
  getCategories: async () => {
    const pool = await getConnection();
    const result = await pool
      .request()
      .query("SELECT id, name FROM Categories");
    return result.recordset;
  },

  // Tạo hóa đơn bằng Transaction (Xử lý an toàn dữ liệu)
  createOrderWithDetails: async (total_amount, items) => {
    const pool = await getConnection();
    const transaction = new sql.Transaction(pool);

    await transaction.begin();
    try {
      // 1. Chèn vào bảng Orders
      const orderRequest = new sql.Request(transaction);
      const orderResult = await orderRequest.input(
        "total_amount",
        sql.Decimal(18, 2),
        total_amount,
      ).query(`
          INSERT INTO Orders (total_amount)
          VALUES (@total_amount);
          SELECT SCOPE_IDENTITY() AS order_id;
        `);

      const orderId = orderResult.recordset[0].order_id;

      // 2. Chèn danh sách món ăn vào bảng OrderDetails
      for (const item of items) {
        const detailRequest = new sql.Request(transaction);
        await detailRequest
          .input("order_id", sql.Int, orderId)
          .input("product_id", sql.Int, item.id)
          .input("quantity", sql.Int, item.quantity)
          .input("price", sql.Decimal(18, 2), item.price).query(`
            INSERT INTO OrderDetails (order_id, product_id, quantity, price)
            VALUES (@order_id, @product_id, @quantity, @price)
          `);
      }

      await transaction.commit();
      return orderId;
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};

module.exports = Order;
