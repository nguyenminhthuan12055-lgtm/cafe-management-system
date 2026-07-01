const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { getConnection, sql } = require("./db");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Bắt buộc phải có để đọc dữ liệu JSON từ Frontend gửi lên

// ==========================================
// 1. API: Lấy danh sách món ăn (Kèm danh mục)
// ==========================================
app.get("/", async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT p.id, p.name AS product_name, p.price, c.name AS category_name, p.status, p.categoryId
      FROM Products p
      LEFT JOIN Categories c ON p.categoryId = c.id
    `);
    res.json({
      status: "success",
      total_items: result.recordset.length,
      data: result.recordset,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Lỗi khi lấy dữ liệu!",
      error: err.message,
    });
  }
});

// ==========================================
// 2. API: Lấy danh sách tất cả danh mục (Dropdown)
// ==========================================
app.get("/api/categories", async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .query("SELECT id, name FROM Categories");
    res.json({
      status: "success",
      data: result.recordset,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Lỗi hệ thống khi lấy danh mục!",
      error: err.message,
    });
  }
});

// ==========================================
// 3. API: Thêm món ăn mới
// ==========================================
app.post("/api/products", async (req, res) => {
  const { name, price, categoryId, status } = req.body;
  try {
    const pool = await getConnection();
    await pool
      .request()
      .input("name", sql.NVarChar, name)
      .input("price", sql.Decimal(18, 2), price)
      .input("categoryId", sql.Int, categoryId)
      .input("status", sql.NVarChar, status || "Active").query(`
        INSERT INTO Products (name, price, categoryId, status)
        VALUES (@name, @price, @categoryId, @status)
      `);
    res.json({ status: "success", message: "Thêm món ăn thành công!" });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Lỗi khi thêm món ăn!",
      error: err.message,
    });
  }
});

// ==========================================
// 4. API: Sửa thông tin món ăn theo ID
// ==========================================
app.put("/api/products/:id", async (req, res) => {
  const { id } = req.params;
  const { name, price, categoryId, status } = req.body;
  try {
    const pool = await getConnection();
    await pool
      .request()
      .input("id", sql.Int, id)
      .input("name", sql.NVarChar, name)
      .input("price", sql.Decimal(18, 2), price)
      .input("categoryId", sql.Int, categoryId)
      .input("status", sql.NVarChar, status).query(`
        UPDATE Products 
        SET name = @name, price = @price, categoryId = @categoryId, status = @status
        WHERE id = @id
      `);
    res.json({ status: "success", message: "Cập nhật món ăn thành công!" });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Lỗi khi cập nhật!",
      error: err.message,
    });
  }
});

// ==========================================
// 5. API: Xóa món ăn theo ID
// ==========================================
app.delete("/api/products/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await getConnection();
    await pool
      .request()
      .input("id", sql.Int, id)
      .query("DELETE FROM Products WHERE id = @id");
    res.json({ status: "success", message: "Xóa món ăn thành công!" });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Lỗi khi xóa món ăn!",
      error: err.message,
    });
  }
});

// ==========================================
// 6. API: Tạo hóa đơn mới (Kèm Transaction chi tiết)
// ==========================================
app.post("/api/orders", async (req, res) => {
  const { total_amount, items } = req.body;

  if (!items || items.length === 0) {
    return res
      .status(400)
      .json({ status: "error", message: "Giỏ hàng trống!" });
  }

  try {
    const pool = await getConnection();
    const transaction = new sql.Transaction(pool);

    await transaction.begin();
    try {
      // Bước A: Chèn vào bảng Orders (Tự động thêm ngày giờ bằng GETDATE() nếu bảng của bạn hỗ trợ)
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

      // Bước B: Duyệt qua các món trong giỏ để chèn vào OrderDetails
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

      // Hoàn tất giao dịch an toàn
      await transaction.commit();
      res.json({
        status: "success",
        message: `Tạo hóa đơn #${orderId} thành công trên SQL Server!`,
      });
    } catch (err) {
      await transaction.rollback(); // Hoàn tác nếu bất kỳ món nào bị lỗi chèn
      throw err;
    }
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Lỗi lưu hóa đơn!",
      error: err.message,
    });
  }
});

// Khởi động Server
app.listen(PORT, () => {
  console.log(`Server đang chạy tại: http://localhost:${PORT}`);
});
