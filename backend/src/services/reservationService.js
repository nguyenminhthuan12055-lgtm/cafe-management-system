const Reservation = require("../models/reservationModel");
const Table = require("../models/tableModel");

const reservationService = {
  getAllReservations: async () => {
    return await Reservation.getAll();
  },

  // Khách đặt bàn (public, không cần đăng nhập)
  createReservation: async (data) => {
    const { table_id, customer_name, phone, reservation_time, number_of_people } = data;

    if (!table_id || !customer_name || !phone || !reservation_time || !number_of_people) {
      throw new Error("Vui lòng nhập đầy đủ thông tin đặt bàn!");
    }
    if (number_of_people <= 0) {
      throw new Error("Số lượng khách phải lớn hơn 0!");
    }

    const table = await Table.getById(table_id);
    if (!table) {
      throw new Error("Bàn không tồn tại!");
    }
    if (table.status === "Occupied") {
      throw new Error("Bàn này đang có khách sử dụng, vui lòng chọn bàn khác!");
    }
    if (number_of_people > table.capacity) {
      throw new Error(
        `Bàn ${table.table_number} chỉ chứa tối đa ${table.capacity} người!`,
      );
    }

    const reservation = await Reservation.create(data);

    // Đánh dấu bàn đã có người đặt trước
    await Table.updateStatus(table_id, "Reserved");

    return reservation;
  },

  // Nhân viên xác nhận / hủy / hoàn tất đặt bàn
  updateReservationStatus: async (id, status) => {
    const validStatuses = ["Pending", "Confirmed", "Cancelled", "Completed"];
    if (!validStatuses.includes(status)) {
      throw new Error("Trạng thái đặt bàn không hợp lệ!");
    }

    const reservation = await Reservation.getById(id);
    if (!reservation) {
      throw new Error("Không tìm thấy đặt bàn này!");
    }

    const updated = await Reservation.updateStatus(id, status);

    // Nếu hủy hoặc hoàn tất -> trả bàn về trạng thái trống
    if (status === "Cancelled" || status === "Completed") {
      await Table.updateStatus(reservation.table_id, "Available");
    }

    return updated;
  },

  deleteReservation: async (id) => {
    const reservation = await Reservation.getById(id);
    if (!reservation) {
      throw new Error("Không tìm thấy đặt bàn này!");
    }
    await Table.updateStatus(reservation.table_id, "Available");
    return await Reservation.remove(id);
  },
};

module.exports = reservationService;
