const Order = require("../models/orderModel");

const orderService = {
  getAllCategories: async () => {
    return await Order.getCategories();
  },

  processCheckout: async (orderData) => {
    const { total_amount, items, table_id } = orderData;
    if (!items || items.length === 0) {
      throw new Error("Giỏ hàng trống, không thể tạo hóa đơn!");
    }
    return await Order.createOrderWithDetails(total_amount, items, table_id);
  },

  // ✅ Lấy lịch sử đơn hàng (phục vụ trang quản lý)
  getOrderHistory: async () => {
    return await Order.getAllOrders();
  },

  getOrderItems: async (orderId) => {
    return await Order.getOrderDetails(orderId);
  },

  // ✅ Cập nhật trạng thái đơn hàng
  changeOrderStatus: async (id, status) => {
    const validStatuses = ["Pending", "Preparing", "Served", "Paid", "Cancelled"];
    if (!validStatuses.includes(status)) {
      throw new Error("Trạng thái hóa đơn không hợp lệ!");
    }
    return await Order.updateStatus(id, status);
  },

  // ✅ Thống kê doanh thu
  getRevenueReport: async () => {
    return await Order.getRevenueStats();
  },
};

module.exports = orderService;
