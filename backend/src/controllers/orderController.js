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
        message: `Hóa đơn #${orderId} đã được lưu vào lịch sử`,
        data: { orderId },
      });
    } catch (err) {
      res.status(500).json({ status: "error", message: err.message });
    }
  },

  // ✅ Lấy lịch sử tất cả hóa đơn
  getOrderHistory: async (req, res) => {
    try {
      const orders = await orderService.getOrderHistory();
      res.json({ status: "success", data: orders });
    } catch (err) {
      res.status(500).json({ status: "error", message: err.message });
    }
  },

  // ✅ Lấy chi tiết món ăn trong 1 hóa đơn
  getOrderItems: async (req, res) => {
    try {
      const items = await orderService.getOrderItems(req.params.id);
      res.json({ status: "success", data: items });
    } catch (err) {
      res.status(500).json({ status: "error", message: err.message });
    }
  },

  // ✅ Cập nhật trạng thái hóa đơn
  updateOrderStatus: async (req, res) => {
    try {
      const { status } = req.body;
      const order = await orderService.changeOrderStatus(req.params.id, status);
      res.json({
        status: "success",
        message: "Cập nhật trạng thái hóa đơn thành công!",
        data: order,
      });
    } catch (err) {
      res.status(400).json({ status: "error", message: err.message });
    }
  },

  // ✅ Thống kê doanh thu
  getRevenueReport: async (req, res) => {
    try {
      const stats = await orderService.getRevenueReport();
      res.json({ status: "success", data: stats });
    } catch (err) {
      res.status(500).json({ status: "error", message: err.message });
    }
  },
};

module.exports = orderController;
