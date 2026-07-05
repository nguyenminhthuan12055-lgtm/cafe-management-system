const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Import Swagger
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger"); // Đường dẫn đến file swagger.js bạn vừa tạo

const productRoutes = require("./src/routes/productRoutes");
const orderRoutes = require("./src/routes/orderRoutes");
const userRoutes = require("./src/routes/userRoutes");
const tableRoutes = require("./src/routes/tableRoutes");
const reservationRoutes = require("./src/routes/reservationRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Kích hoạt đường dẫn xem tài liệu Swagger API
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Các Routes chính
app.use("/", productRoutes);
app.use("/", orderRoutes);
app.use("/", userRoutes);
app.use("/", tableRoutes);
app.use("/", reservationRoutes);

app.listen(PORT, () => {
  console.log(`Server đang chạy tại: http://localhost:${PORT}`);
  console.log(
    `📑 Xem tài liệu API Swagger tại: http://localhost:${PORT}/api-docs`,
  );
});
