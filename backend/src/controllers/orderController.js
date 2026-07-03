const orderService = require("../services/orderService");

const orderController = {
  // Hàm lấy danh sách danh mục món ăn
  getCategories: async (req, res) => {
    try {
      const categories = await orderService.getAllCategories();
      res.json({ status: "success", data: categories });
    } catch (err) {
      res.status(500).json({ status: "error", message: err.message });
    }
  },

  // Hàm tạo hóa đơn mới
  createOrder: async (req, res) => {
    try {
      // 1. Kiểm tra quyền hạn: Chỉ cho phép 'Staff' hoặc 'Admin' thực hiện in hóa đơn
      // (req.user do middleware verifyToken giải mã và cung cấp sẵn)
      if (req.user && req.user.role !== "Staff" && req.user.role !== "Admin") {
        return res.status(403).json({
          status: "error",
          message:
            "Phiên đăng nhập đã hết hạn hoặc không có quyền! Vui lòng đăng nhập lại.",
        });
      }

      // 2. Tiến hành xử lý thanh toán nếu quyền hợp lệ
      const orderId = await orderService.processCheckout(req.body);
      res.json({
        status: "success",
        message: `Tạo hóa đơn ${orderId} thành công trên Cơ Sở Dữ Liệu!`,
      });
    } catch (err) {
      res.status(500).json({ status: "error", message: err.message });
    }
  },
};

module.exports = orderController;
