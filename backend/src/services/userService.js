const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userService = {
  login: async (username, password) => {
    // 1. Kiểm tra tài khoản tồn tại không
    const user = await User.findByUsername(username);
    if (!user) {
      throw new Error("Tài khoản hoặc mật khẩu không chính xác!");
    }

    // 2. So sánh mật khẩu (Hỗ trợ cả mật khẩu thuần để bạn tiện test nhanh dưới database)
    let isMatch = false;
    if (user.password.startsWith("$2a$") || user.password.startsWith("$2b$")) {
      isMatch = await bcrypt.compare(password, user.password);
    } else {
      isMatch = password === user.password; // So sánh text thuần
    }

    if (!isMatch) {
      throw new Error("Tài khoản hoặc mật khẩu không chính xác!");
    }

    // 3. Tạo JWT Token (Hết hạn trong 1 ngày)
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    return {
      token,
      user: { id: user.id, username: user.username, role: user.role, name: user.name },
    };
  },

  // Đăng ký tài khoản mới
  register: async (name, username, password) => {
    // 1. Validate dữ liệu đầu vào
    if (!name || !username || !password) {
      throw new Error("Vui lòng nhập đầy đủ họ tên, tài khoản và mật khẩu!");
    }
    if (username.length < 3) {
      throw new Error("Tên tài khoản phải có ít nhất 3 ký tự!");
    }
    if (password.length < 6) {
      throw new Error("Mật khẩu phải có ít nhất 6 ký tự!");
    }

    // 2. Kiểm tra username đã tồn tại chưa
    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      throw new Error("Tài khoản này đã tồn tại, vui lòng chọn tên khác!");
    }

    // 3. Mã hoá mật khẩu trước khi lưu (luôn hash, không lưu plaintext khi tạo mới)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Tạo user mới với vai trò mặc định là "Staff"
    const newUser = await User.create(name, username, hashedPassword, "Staff");

    // 5. Đăng ký xong thì đăng nhập luôn cho tiện, trả JWT token
    const token = jwt.sign(
      { id: newUser.id, username: newUser.username, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    return {
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        role: newUser.role,
        name: newUser.name,
      },
    };
  },
};

module.exports = userService;
