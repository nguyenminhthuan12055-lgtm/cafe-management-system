const { getConnection, sql } = require("../../config/db");

const User = {
  // Tìm user theo username phục vụ đăng nhập
  findByUsername: async (username) => {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("username", sql.NVarChar, username)
      .query("SELECT * FROM Users WHERE username = @username");
    return result.recordset[0]; // Trả về user đầu tiên tìm thấy
  },

  // Tạo user mới phục vụ đăng ký (bảng Users có cột "name" NOT NULL nên phải truyền đủ)
  create: async (name, username, hashedPassword, role) => {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("name", sql.NVarChar, name)
      .input("username", sql.VarChar, username)
      .input("password", sql.VarChar, hashedPassword)
      .input("role", sql.NVarChar, role).query(`
        INSERT INTO Users (name, username, password, role, status)
        OUTPUT INSERTED.id, INSERTED.name, INSERTED.username, INSERTED.role
        VALUES (@name, @username, @password, @role, 'Active')
      `);
    return result.recordset[0];
  },
};

module.exports = User;
