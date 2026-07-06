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

| Nhóm                    | Chi tiết                                                                                                                        |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| **Xác thực**            | Đăng nhập / Đăng ký (mã hoá mật khẩu bằng bcrypt), bảo mật bằng JWT (`Authorization: Bearer <token>`)                           |
| **Gọi món (POS)**       | Xem thực đơn theo danh mục, **tìm kiếm món ăn/nước uống**, thêm vào giỏ hàng, chọn bàn, thanh toán → lưu hóa đơn vào SQL Server |
| **Quản lý món ăn**      | Thêm / **Sửa** / **Xóa** món ăn qua menu dấu ba chấm (⋯) cạnh mỗi món                                                           |
| **Quản lý bàn**         | Xem lưới trạng thái bàn (Trống / Đã đặt / Đang phục vụ), thêm/sửa/xóa bàn, đổi trạng thái                                       |
| **Đặt bàn**             | Khách tự đặt bàn tại `dat-ban.html` (không cần tài khoản); nhân viên xác nhận / hủy / hoàn tất tại giao diện quản lý            |
| **Lịch sử & Doanh thu** | Xem lịch sử hóa đơn kèm trạng thái, thống kê tổng doanh thu / doanh thu hôm nay / tổng số hóa đơn                               |
| **Swagger**             | Tài liệu API đầy đủ tại `/api-docs`                                                                                             |

## ⚙️ Cài đặt & chạy thử (không dùng Docker)

### 1. Chuẩn bị Database

Mở SQL Server Management Studio, chạy toàn bộ file `database/CafeManagement.sql` để tạo database + dữ liệu mẫu (bao gồm 8 bàn mẫu, 4 tài khoản mẫu, 17 món ăn/nước uống mẫu).

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

## 🐳 Chạy bằng Docker

```bash
docker-compose up --build
```

- Backend: `http://localhost:5000`
- Frontend: `http://localhost:8080`
- Swagger: `http://localhost:5000/api-docs`

> **Lưu ý:** cấu hình mẫu trong `docker-compose.yml` kết nối tới SQL Server đang chạy **ngay trên máy thật** của bạn (`host.docker.internal`), không phải SQL Server chạy trong Docker. Nếu muốn SQL Server cũng chạy trong container, cần thêm 1 service `sqlserver` vào `docker-compose.yml` (image `mcr.microsoft.com/mssql/server`) và đổi `DB_SERVER` tương ứng.

## 🔑 Tài khoản mẫu (từ `CafeManagement.sql`)

| Username         | Password | Role  |
| ---------------- | -------- | ----- |
| admin@gmail.com  | 123456   | Admin |
| staff1@gmail.com | 123456   | Staff |

(2 tài khoản còn lại trong file SQL dùng mật khẩu riêng của thành viên nhóm.)

## 👥 Ghi chú cho cả nhóm khi làm việc chung trên GitHub

Để đáp ứng yêu cầu "Github có sự đóng góp thường xuyên - đều đặn của tất cả thành viên":

- Mỗi thành viên nên tạo nhánh riêng (`git checkout -b ten-thanh-vien/tinh-nang`) khi làm tính năng mới, rồi tạo Pull Request để merge vào `main`, thay vì tất cả cùng push thẳng vào `main`.
- Commit nhỏ, thường xuyên, message rõ ràng thay vì 1 commit khổng lồ cuối kỳ — giảng viên thường xem lịch sử commit (`git log`, tab Insights > Contributors trên GitHub) để đánh giá mức đóng góp từng người.
- Phân chia rõ: người phụ trách backend, người phụ trách frontend, người viết tài liệu/README, để mỗi người đều có commit đứng tên mình trong suốt quá trình làm, không dồn vào 1-2 buổi cuối.

## ⚠️ Bảo mật

File `backend/.env` chứa mật khẩu database và khóa bí mật JWT — **không được commit lên GitHub** (đã có sẵn trong `.gitignore`). Trước khi `git push`, luôn chạy `git status` để chắc chắn `.env` không nằm trong danh sách file được commit.
