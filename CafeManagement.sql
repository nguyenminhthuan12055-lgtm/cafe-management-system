USE CafeManagement;
GO

-- 1. Xóa các bảng theo thứ tự để tránh lỗi khóa ngoại (Foreign Key)
IF OBJECT_ID('OrderDetails', 'U') IS NOT NULL DROP TABLE OrderDetails;
IF OBJECT_ID('Orders', 'U') IS NOT NULL DROP TABLE Orders;
IF OBJECT_ID('Products', 'U') IS NOT NULL DROP TABLE Products;
IF OBJECT_ID('Categories', 'U') IS NOT NULL DROP TABLE Categories;
IF OBJECT_ID('Users', 'U') IS NOT NULL DROP TABLE Users;
GO

-- 2. Tạo lại các bảng
CREATE TABLE Categories (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL,
    createdAt DATETIME DEFAULT GETDATE()
);

CREATE TABLE Products (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    categoryId INT,
    status NVARCHAR(50) DEFAULT 'Active',
    createdAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (categoryId) REFERENCES Categories(id) ON DELETE SET NULL
);

CREATE TABLE Users (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role NVARCHAR(50) DEFAULT 'Staff',
    status NVARCHAR(50) DEFAULT 'Active',
    createdAt DATETIME DEFAULT GETDATE()
);

CREATE TABLE Orders (
    id INT IDENTITY(1,1) PRIMARY KEY,
    order_date DATETIME DEFAULT GETDATE(),
    total_amount DECIMAL(18,2) NOT NULL
);

CREATE TABLE OrderDetails (
    id INT IDENTITY(1,1) PRIMARY KEY,
    order_id INT FOREIGN KEY REFERENCES Orders(id) ON DELETE CASCADE,
    product_id INT FOREIGN KEY REFERENCES Products(id) ON DELETE SET NULL,
    quantity INT NOT NULL,
    price DECIMAL(18,2) NOT NULL
);
GO

-- 1. Chèn dữ liệu nhóm danh mục TRƯỚC
INSERT INTO Categories (name) VALUES 
(N'Cà Phê'),
(N'Trà Trái Cây'),
(N'Đá Xay (Ice Blended)'),
(N'Trà Sữa'),
(N'Bánh Ngọt & Khách Ăn Kèm');
GO

-- 2. Sau đó mới chèn dữ liệu thực đơn (vì lúc này đã có ID trong bảng Categories)
INSERT INTO Products (name, price, categoryId, status) VALUES 
(N'Cà Phê Sữa Đá', 29000, 1, 'Active'),
(N'Cà Phê Đen Đá', 25000, 1, 'Active'),
(N'Bạc Xỉu', 32000, 1, 'Active'),
(N'Espresso Hot', 35000, 1, 'Active'),
(N'Cappuccino', 45000, 1, 'Active'),
(N'Trà Đào Cam Sả', 39000, 2, 'Active'),
(N'Trà Vải Lục Trà', 39000, 2, 'Active'),
(N'Trà Dâu Tây Thượng Hạng', 42000, 2, 'Active'),
(N'Trà Chanh Sả Mật Ong', 35000, 2, 'Active'),
(N'Matcha Đá Xay', 49000, 3, 'Active'),
(N'Choco Cookie Đá Xay', 52000, 3, 'Active'),
(N'Cà Phê Đá Xay Caramel', 49000, 3, 'Active'),
(N'Trà Sữa Trân Châu Truyền Thống', 39000, 4, 'Active'),
(N'Trà Sữa Matcha Đậu Đỏ', 45000, 4, 'Active'),
(N'Oolong Khoai Môn Tươi', 47000, 4, 'Active'),
(N'Bánh Tiramisu', 35000, 5, 'Active'),
(N'Croissant Tỏi Đen', 28000, 5, 'Active');
GO

-- 3. Cuối cùng chèn dữ liệu người dùng
INSERT INTO Users (name, username, password, role, status) VALUES 
(N'Nguyễn Minh Thuận', 'nguyenminhthuan12055@gmail.com', 'admin123', 'Admin', 'Active'),
(N'Vương Hoàng Thiên Nhi', 'thiennhi@gmail.com', 'nhi123', 'Admin', 'Active'),
(N'Quản Trị Viên', 'admin@gmail.com', '123456', 'Admin', 'Active'),
(N'Nhân Viên A', 'staff1@gmail.com', '123456', 'Staff', 'Active');
GO
SELECT * FROM Categories;
SELECT * FROM Products;
SELECT * FROM Users;
SELECT * FROM Orders;
SELECT * FROM OrderDetails;
GO



SELECT id, order_date, total_amount
FROM Orders
ORDER BY order_date DESC;

SELECT 
    o.id AS [Mã Đơn],
    o.order_date AS [Thời Gian],
    p.name AS [Tên Món],
    od.quantity AS [Số Lượng],
    FORMAT(od.price, '#,##0') AS [Đơn Giá]
FROM Orders o
JOIN OrderDetails od ON o.id = od.order_id
JOIN Products p ON od.product_id = p.id
ORDER BY o.order_date DESC;
