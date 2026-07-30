const reservationService = require("../services/reservationService");

const reservationController = {
  getAllReservations: async (req, res) => {
    try {
      const reservations = await reservationService.getAllReservations();
      res.json({ status: "success", data: reservations });
    } catch (err) {
      res.status(500).json({ status: "error", message: err.message });
    }
  },

  // Khách đặt bàn - route công khai, không cần đăng nhập
  createReservation: async (req, res) => {
    try {
      const reservation = await reservationService.createReservation(req.body);
      res.json({
        status: "success",
        message: "Đặt bàn thành công! Quán sẽ liên hệ xác nhận sớm nhất.",
        data: reservation,
      });
    } catch (err) {
      res.status(400).json({ status: "error", message: err.message });
    }
  },

  updateReservationStatus: async (req, res) => {
    try {
      const { status } = req.body;
      const reservation = await reservationService.updateReservationStatus(
        req.params.id,
        status,
      );
      res.json({ status: "success", message: "Cập nhật trạng thái đặt bàn thành công!", data: reservation });
    } catch (err) {
      res.status(400).json({ status: "error", message: err.message });
    }
  },

  deleteReservation: async (req, res) => {
    try {
      await reservationService.deleteReservation(req.params.id);
      res.json({ status: "success", message: "Xóa đặt bàn thành công!" });
    } catch (err) {
      res.status(400).json({ status: "error", message: err.message });
    }
  },
};

module.exports = reservationController;
