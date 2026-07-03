const Order = require("../models/orderModel");

const orderService = {
  getAllCategories: async () => {
    return await Order.getCategories();
  },

  processCheckout: async (orderData) => {
    const { total_amount, items } = orderData;
    if (!items || items.length === 0) {
      throw new Error("Giỏ hàng trống, không thể tạo hóa đơn!");
    }
    return await Order.createOrderWithDetails(total_amount, items);
  },
};

module.exports = orderService;
