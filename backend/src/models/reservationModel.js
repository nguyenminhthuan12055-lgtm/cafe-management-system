const { getConnection, sql } = require("../../config/db");

const Reservation = {
  // Lấy tất cả đặt bàn kèm thông tin bàn
  getAll: async () => {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT r.id, r.customer_name, r.phone, r.reservation_time,
             r.number_of_people, r.note, r.status, r.createdAt,
             t.id AS table_id, t.table_number, t.capacity
      FROM Reservations r
      JOIN Tables t ON r.table_id = t.id
      ORDER BY r.reservation_time DESC
    `);
    return result.recordset;
  },

  getById: async (id) => {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query("SELECT * FROM Reservations WHERE id = @id");
    return result.recordset[0];
  },

  // Tạo đặt bàn mới (khách hàng gọi API này, không cần đăng nhập)
  create: async ({ table_id, customer_name, phone, reservation_time, number_of_people, note }) => {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("table_id", sql.Int, table_id)
      .input("customer_name", sql.NVarChar, customer_name)
      .input("phone", sql.VarChar, phone)
      .input("reservation_time", sql.DateTime, new Date(reservation_time))
      .input("number_of_people", sql.Int, number_of_people)
      .input("note", sql.NVarChar, note || null).query(`
        INSERT INTO Reservations
          (table_id, customer_name, phone, reservation_time, number_of_people, note, status)
        OUTPUT INSERTED.*
        VALUES
          (@table_id, @customer_name, @phone, @reservation_time, @number_of_people, @note, 'Pending')
      `);
    return result.recordset[0];
  },

  // Cập nhật trạng thái đặt bàn: Pending | Confirmed | Cancelled | Completed
  updateStatus: async (id, status) => {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .input("status", sql.NVarChar, status).query(`
        UPDATE Reservations SET status = @status
        OUTPUT INSERTED.*
        WHERE id = @id
      `);
    return result.recordset[0];
  },

  remove: async (id) => {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query("DELETE FROM Reservations WHERE id = @id");
    return result.rowsAffected[0] > 0;
  },
};

module.exports = Reservation;
