const { getConnection, sql } = require("../../config/db");

const Table = {
  // Lấy tất cả bàn
  getAll: async () => {
    const pool = await getConnection();
    const result = await pool
      .request()
      .query("SELECT * FROM Tables ORDER BY id ASC");
    return result.recordset;
  },

  getById: async (id) => {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query("SELECT * FROM Tables WHERE id = @id");
    return result.recordset[0];
  },

  // Thêm bàn mới
  create: async (table_number, capacity) => {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("table_number", sql.NVarChar, table_number)
      .input("capacity", sql.Int, capacity).query(`
        INSERT INTO Tables (table_number, capacity, status)
        OUTPUT INSERTED.*
        VALUES (@table_number, @capacity, 'Available')
      `);
    return result.recordset[0];
  },

  // Sửa thông tin bàn (số bàn, sức chứa)
  update: async (id, table_number, capacity) => {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .input("table_number", sql.NVarChar, table_number)
      .input("capacity", sql.Int, capacity).query(`
        UPDATE Tables
        SET table_number = @table_number, capacity = @capacity
        OUTPUT INSERTED.*
        WHERE id = @id
      `);
    return result.recordset[0];
  },

  // Cập nhật trạng thái bàn: Available | Reserved | Occupied
  updateStatus: async (id, status) => {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .input("status", sql.NVarChar, status).query(`
        UPDATE Tables SET status = @status
        OUTPUT INSERTED.*
        WHERE id = @id
      `);
    return result.recordset[0];
  },

  // Xóa bàn
  remove: async (id) => {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query("DELETE FROM Tables WHERE id = @id");
    return result.rowsAffected[0] > 0;
  },
};

module.exports = Table;
