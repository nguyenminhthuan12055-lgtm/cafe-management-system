const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Hệ thống Quản lý Quán Cafe - API Documentation",
      version: "1.0.0",
      description:
        "Tài liệu API đầy đủ cho dự án quản lý món ăn và hóa đơn, hỗ trợ bảo mật JWT.",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Local Server",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    // ĐỊNH NGHĨA TRỰC TIẾP API Ở ĐÂY ĐỂ TRÁNH LỖI QUÉT FILE
    paths: {
      "/": {
        get: {
          summary: "Lấy danh sách tất cả món ăn kèm danh mục",
          tags: ["Products"],
          responses: {
            200: {
              description: "Trả về danh sách món ăn thành công.",
            },
          },
        },
      },
      "/api/auth/login": {
        post: {
          summary: "Đăng nhập hệ thống lấy Token JWT",
          tags: ["Authentication"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    username: { type: "string", example: "admin" },
                    password: { type: "string", example: "123456" },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Đăng nhập thành công!" },
            401: { description: "Tài khoản hoặc mật khẩu sai." },
          },
        },
      },
      "/api/orders": {
        post: {
          summary: "Tạo hóa đơn mới (Yêu cầu Token JWT)",
          tags: ["Orders"],
          security: [{ BearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    total_amount: { type: "number", example: 120000 },
                    items: { type: "array", items: { type: "object" } },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Tạo hóa đơn thành công!" },
            403: { description: "Không có quyền truy cập." },
          },
        },
      },
    },
  },
  apis: [], // Bỏ trống mảng này vì chúng ta đã khai báo tường minh ở trên
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
