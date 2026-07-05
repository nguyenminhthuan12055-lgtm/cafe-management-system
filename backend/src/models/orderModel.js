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
  // ✅ Giờ nhận thêm table_id để gắn hóa đơn với 1 bàn cụ thể
  createOrderWithDetails: async (total_amount, items, table_id) => {
    const pool = await getConnection();
    const transaction = new sql.Transaction(pool);

    await transaction.begin();
    try {
      // 1. Chèn vào bảng Orders
      const orderRequest = new sql.Request(transaction);
      const orderResult = await orderRequest
        .input("total_amount", sql.Decimal(18, 2), total_amount)
        .input("table_id", sql.Int, table_id || null).query(`
          INSERT INTO Orders (total_amount, table_id, status)
          VALUES (@total_amount, @table_id, 'Pending');
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

      // 3. Nếu hóa đơn gắn với 1 bàn -> đánh dấu bàn đang được sử dụng
      if (table_id) {
        const tableRequest = new sql.Request(transaction);
        await tableRequest
          .input("table_id", sql.Int, table_id)
          .query("UPDATE Tables SET status = 'Occupied' WHERE id = @table_id");
      }

      await transaction.commit();
      return orderId;
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  // ✅ Lấy lịch sử tất cả hóa đơn kèm số bàn (phục vụ trang quản lý)
  getAllOrders: async () => {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT o.id, o.order_date, o.total_amount, o.status,
             t.table_number
      FROM Orders o
      LEFT JOIN Tables t ON o.table_id = t.id
      ORDER BY o.order_date DESC
    `);
    return result.recordset;
  },

  // ✅ Lấy chi tiết món ăn của 1 hóa đơn cụ thể
  getOrderDetails: async (orderId) => {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("orderId", sql.Int, orderId).query(`
        SELECT od.id, od.quantity, od.price, p.name AS product_name
        FROM OrderDetails od
        LEFT JOIN Products p ON od.product_id = p.id
        WHERE od.order_id = @orderId
      `);
    return result.recordset;
  },

  // ✅ Cập nhật trạng thái hóa đơn: Pending | Preparing | Served | Paid | Cancelled
  updateStatus: async (id, status) => {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .input("status", sql.NVarChar, status).query(`
        UPDATE Orders SET status = @status
        OUTPUT INSERTED.*
        WHERE id = @id
      `);
    return result.recordset[0];
  },

  // ✅ Thống kê doanh thu theo ngày (phục vụ trang báo cáo)
  getRevenueStats: async () => {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT
        CAST(order_date AS DATE) AS order_day,
        COUNT(id) AS total_orders,
        SUM(total_amount) AS total_revenue
      FROM Orders
      WHERE status != 'Cancelled'
      GROUP BY CAST(order_date AS DATE)
      ORDER BY order_day DESC
    `);
    return result.recordset;
  },
};

module.exports = Order;
