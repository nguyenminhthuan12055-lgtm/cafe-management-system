# ☕ Website Gọi Món & Quản Lý Đặt Bàn Cho Quán Cafe

Đồ án hệ thống gọi món (POS) và quản lý đặt bàn cho quán cafe, kiến trúc **Backend - Frontend tách biệt**, giao tiếp qua RESTful API, bảo mật bằng JWT.

## 🏗️ Kiến trúc

```
cafe-management-system/
├── backend/            # Dự án Node.js/Express (RESTful API riêng biệt)
│   ├── config/         # Cấu hình kết nối DB + Swagger
│   └── src/
│       ├── routes/         # Định tuyến API
│       ├── controllers/    # Xử lý request/response
│       ├── services/       # Nghiệp vụ (business logic)
│       ├── models/         # Truy vấn SQL Server
│       └── middlewares/    # Xác thực JWT (authMiddleware)
├── frontend/           # Dự án giao diện tĩnh (HTML/CSS/JS thuần), gọi Backend qua fetch API
│   ├── index.html       # Giao diện quản lý (đăng nhập bắt buộc): bán hàng, quản lý bàn, đặt bàn, lịch sử/doanh thu
│   └── dat-ban.html     # Trang công khai để KHÁCH tự đặt bàn (không cần đăng nhập)
├── database/
│   └── CafeManagement.sql   # Script tạo toàn bộ database + dữ liệu mẫu
└── docker-compose.yml   # Dockerize toàn bộ ứng dụng (backend + frontend)
```

Backend và Frontend là **2 dự án hoàn toàn độc lập** — Frontend không hề import code của Backend, chỉ gọi qua các endpoint `http://localhost:5000/api/...`.

## 🚀 Chức năng chính

| Nhóm | Chi tiết |
|---|---|
| **Xác thực** | Đăng nhập / Đăng ký (mã hoá mật khẩu bằng bcrypt), bảo mật bằng JWT (`Authorization: Bearer <token>`) |
| **Gọi món (POS)** | Xem thực đơn theo danh mục, **tìm kiếm món ăn/nước uống**, thêm vào giỏ hàng, chọn bàn, thanh toán → lưu hóa đơn vào SQL Server |
| **Quản lý món ăn** | Thêm / **Sửa** / **Xóa** món ăn qua menu dấu ba chấm (⋯) cạnh mỗi món |
| **Quản lý bàn** | Xem lưới trạng thái bàn (Trống / Đã đặt / Đang phục vụ), thêm/sửa/xóa bàn, đổi trạng thái |
| **Đặt bàn** | Khách tự đặt bàn tại `dat-ban.html` (không cần tài khoản); nhân viên xác nhận / hủy / hoàn tất tại giao diện quản lý |
| **Lịch sử & Doanh thu** | Xem lịch sử hóa đơn kèm trạng thái, thống kê tổng doanh thu / doanh thu hôm nay / tổng số hóa đơn |
| **Swagger** | Tài liệu API đầy đủ tại `/api-docs` |

## ⚙️ Cài đặt & chạy thử (không dùng Docker)

### 1. Chuẩn bị Database
Mở SQL Server Management Studio, chạy toàn bộ file `database/CafeManagement.sql` để tạo database + dữ liệu mẫu.

### 2. Chạy Backend
```bash
cd backend
npm install
npm run dev
```
Backend chạy tại `http://localhost:5000`. Kiểm tra file `.env` đã đúng thông tin kết nối SQL Server của bạn (đặc biệt `DB_SERVER`, `DB_PASSWORD`).

### 3. Chạy Frontend
Mở trực tiếp `frontend/index.html` bằng trình duyệt (hoặc dùng tiện ích Live Server).
Trang đặt bàn công khai cho khách: `frontend/dat-ban.html`.

### 4. Xem tài liệu API (Swagger)
Vào `http://localhost:5000/api-docs`.

##  Chạy bằng Docker (khuyến khích — đáp ứng yêu cầu "Dockerize toàn bộ ứng dụng")

```bash
docker-compose up --build
```
- Backend: `http://localhost:5000`
- Frontend: `http://localhost:8080`
- Swagger: `http://localhost:5000/api-docs`

> **Lưu ý:** cấu hình mẫu trong `docker-compose.yml` kết nối tới SQL Server đang chạy **ngay trên máy thật** của bạn (`host.docker.internal`), không phải SQL Server chạy trong Docker. Nếu muốn SQL Server cũng chạy trong container, cần thêm 1 service `sqlserver` vào `docker-compose.yml` (image `mcr.microsoft.com/mssql/server`) và đổi `DB_SERVER` tương ứng.

##  Tài khoản mẫu 

| Username | Password | Role |
|---|---|---|
| admin@gmail.com | 123456 | Admin |
| staff1@gmail.com | 123456 | Staff |



