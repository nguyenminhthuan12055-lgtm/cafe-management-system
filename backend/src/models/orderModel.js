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
      // ✅ Trạng thái mặc định khi tạo hóa đơn là 'Paid' — vì trong quy trình quán,
      // khách thanh toán ngay tại quầy khi in hóa đơn (không có bước chờ xử lý Pending).
      // Nếu sau này cần quy trình bếp (nhận đơn -> chế biến -> phục vụ -> thanh toán),
      // đổi lại giá trị này thành 'Pending' và dùng dropdown "Thao tác" ở trang Lịch Sử để chuyển tay.
      const orderRequest = new sql.Request(transaction);
      const orderResult = await orderRequest
        .input("total_amount", sql.Decimal(18, 2), total_amount)
        .input("table_id", sql.Int, table_id || null).query(`
          INSERT INTO Orders (total_amount, table_id, status)
          VALUES (@total_amount, @table_id, 'Paid');
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
  // Khi hóa đơn chuyển sang Paid hoặc Cancelled -> tự động trả bàn về "Available",
  // để bàn không bị kẹt mãi ở trạng thái "Occupied" sau khi khách đã thanh toán/hủy.
  updateStatus: async (id, status) => {
    const pool = await getConnection();
    const transaction = new sql.Transaction(pool);
    await transaction.begin();
    try {
      const orderRequest = new sql.Request(transaction);
      const orderResult = await orderRequest
        .input("id", sql.Int, id)
        .input("status", sql.NVarChar, status).query(`
          UPDATE Orders SET status = @status
          OUTPUT INSERTED.*
          WHERE id = @id
        `);
      const updatedOrder = orderResult.recordset[0];

      if (updatedOrder && updatedOrder.table_id && (status === "Paid" || status === "Cancelled")) {
        const tableRequest = new sql.Request(transaction);
        await tableRequest
          .input("table_id", sql.Int, updatedOrder.table_id)
          .query("UPDATE Tables SET status = 'Available' WHERE id = @table_id");
      }

      await transaction.commit();
      return updatedOrder;
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  // ✅ Thống kê doanh thu theo Ngày / Tuần / Tháng (chỉ tính hóa đơn đã THANH TOÁN)
  // Chỉ hóa đơn có status = 'Paid' mới được tính là "doanh thu thật" —
  // Pending/Preparing/Served là đơn chưa thu tiền, Cancelled là đơn hủy.
  getRevenueStats: async (period = "day") => {
    const pool = await getConnection();

    // Whitelist period để tránh nhét chuỗi lạ vào câu SQL group-by
    const validPeriods = ["day", "week", "month"];
    const safePeriod = validPeriods.includes(period) ? period : "day";

    let groupExpr;
    if (safePeriod === "week") {
      // Quy về Thứ 2 đầu tuần, không phụ thuộc cấu hình DATEFIRST của SQL Server
      groupExpr =
        "CONVERT(varchar(10), DATEADD(WEEK, DATEDIFF(WEEK, 0, order_date), 0), 120)";
    } else if (safePeriod === "month") {
      groupExpr = "CONVERT(varchar(7), order_date, 120)"; // yyyy-MM
    } else {
      groupExpr = "CONVERT(varchar(10), order_date, 120)"; // yyyy-MM-dd
    }

    const result = await pool.request().query(`
      SELECT
        ${groupExpr} AS period_label,
        COUNT(id) AS total_orders,
        SUM(total_amount) AS total_revenue
      FROM Orders
      WHERE status = 'Paid'
      GROUP BY ${groupExpr}
      ORDER BY period_label DESC
    `);
    return result.recordset;
  },

  // ✅ Tổng quan nhanh cho 3 ô thống kê đầu trang: Tổng doanh thu / Doanh thu hôm nay / Tổng số hóa đơn
  // "Hôm nay" được tính bằng GETDATE() của chính SQL Server, không dùng ngày của trình duyệt,
  // để tránh lệch ngày khi server và máy khách khác múi giờ.
  getRevenueSummary: async () => {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT
        (SELECT ISNULL(SUM(total_amount), 0) FROM Orders WHERE status = 'Paid') AS total_revenue,
        (SELECT ISNULL(SUM(total_amount), 0) FROM Orders
          WHERE status = 'Paid' AND CAST(order_date AS DATE) = CAST(GETDATE() AS DATE)) AS today_revenue,
        (SELECT COUNT(*) FROM Orders) AS total_orders,
        (SELECT COUNT(*) FROM Orders WHERE status = 'Paid') AS total_paid_orders
    `);
    return result.recordset[0];
  },
};

module.exports = Order;
