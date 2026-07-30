const userService = require("../services/userService");

const userController = {
  login: async (req, res) => {
    const { username, password } = req.body;
    try {
      const result = await userService.login(username, password);
      res.json({
        status: "success",
        message: "Đăng nhập thành công!",
        data: result,
      });
    } catch (err) {
      res.status(401).json({ status: "error", message: err.message });
    }
  },

  register: async (req, res) => {
    const { name, username, password } = req.body;
    try {
      const result = await userService.register(name, username, password);
      res.json({
        status: "success",
        message: "Đăng ký tài khoản thành công!",
        data: result,
      });
    } catch (err) {
      // 400: lỗi do dữ liệu người dùng nhập sai/thiếu/trùng, không phải lỗi server
      res.status(400).json({ status: "error", message: err.message });
    }
  },
};

module.exports = userController;
