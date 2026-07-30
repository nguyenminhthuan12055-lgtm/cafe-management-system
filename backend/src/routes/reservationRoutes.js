const express = require("express");
const router = express.Router();
const reservationController = require("../controllers/reservationController");
const verifyToken = require("../middlewares/authMiddleware");

// ✅ Khách đặt bàn - KHÔNG cần đăng nhập (đúng tinh thần "khách tự đặt bàn qua web")
router.post("/api/reservations", reservationController.createReservation);

// Xem/quản lý danh sách đặt bàn - chỉ nhân viên/quản trị đã đăng nhập
router.get("/api/reservations", verifyToken, reservationController.getAllReservations);
router.put("/api/reservations/:id/status", verifyToken, reservationController.updateReservationStatus);
router.delete("/api/reservations/:id", verifyToken, reservationController.deleteReservation);

module.exports = router;
