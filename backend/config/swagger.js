const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Hệ thống Gọi Món & Quản Lý Đặt Bàn Quán Cafe - API Documentation",
      version: "2.0.0",
      description:
        "Tài liệu API đầy đủ cho dự án gọi món, quản lý bàn, đặt bàn và hóa đơn, hỗ trợ bảo mật JWT.",
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
      // ================= AUTH =================
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
                    username: { type: "string", example: "admin@gmail.com" },
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
      "/api/auth/register": {
        post: {
          summary: "Đăng ký tài khoản mới (mặc định role Staff)",
          tags: ["Authentication"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    name: { type: "string", example: "Nguyễn Văn A" },
                    username: { type: "string", example: "nva@gmail.com" },
                    password: { type: "string", example: "123456" },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Đăng ký thành công!" },
            400: { description: "Dữ liệu không hợp lệ hoặc username đã tồn tại." },
          },
        },
      },

      // ================= PRODUCTS =================
      "/api/products": {
        get: {
          summary: "Lấy danh sách tất cả món ăn/nước uống kèm danh mục",
          tags: ["Products"],
          responses: {
            200: { description: "Trả về danh sách món ăn thành công." },
          },
        },
        post: {
          summary: "Thêm món ăn/nước uống mới (yêu cầu đăng nhập)",
          tags: ["Products"],
          security: [{ BearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    name: { type: "string", example: "Cà Phê Sữa Đá" },
                    price: { type: "number", example: 29000 },
                    categoryId: { type: "integer", example: 1 },
                    status: { type: "string", example: "Active" },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Thêm món ăn thành công!" },
            400: { description: "Dữ liệu không hợp lệ." },
          },
        },
      },
      "/api/products/{id}": {
        put: {
          summary: "Sửa thông tin món ăn/nước uống (yêu cầu đăng nhập)",
          tags: ["Products"],
          security: [{ BearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "integer" } },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    price: { type: "number" },
                    categoryId: { type: "integer" },
                    status: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Cập nhật món ăn thành công!" },
            400: { description: "Không tìm thấy món ăn hoặc dữ liệu không hợp lệ." },
          },
        },
        delete: {
          summary: "Xóa món ăn/nước uống (yêu cầu đăng nhập)",
          tags: ["Products"],
          security: [{ BearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "integer" } },
          ],
          responses: {
            200: { description: "Xóa món ăn thành công!" },
            400: { description: "Không tìm thấy món ăn." },
          },
        },
      },

      // ================= CATEGORIES =================
      "/api/categories": {
        get: {
          summary: "Lấy danh sách danh mục món ăn/nước uống",
          tags: ["Categories"],
          responses: {
            200: { description: "Trả về danh sách danh mục thành công." },
          },
        },
      },

      // ================= ORDERS =================
      "/api/orders": {
        get: {
          summary: "Lấy lịch sử tất cả hóa đơn (yêu cầu đăng nhập)",
          tags: ["Orders"],
          security: [{ BearerAuth: [] }],
          responses: {
            200: { description: "Trả về danh sách lịch sử hóa đơn." },
          },
        },
        post: {
          summary: "Tạo hóa đơn mới, lưu vào SQL Server (yêu cầu Token JWT)",
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
                    table_id: { type: "integer", example: 1, description: "Bàn gắn với hóa đơn (tùy chọn)" },
                    items: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id: { type: "integer" },
                          quantity: { type: "integer" },
                          price: { type: "number" },
                        },
                      },
                    },
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
      "/api/orders/{id}/items": {
        get: {
          summary: "Lấy chi tiết món ăn trong 1 hóa đơn (yêu cầu đăng nhập)",
          tags: ["Orders"],
          security: [{ BearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "integer" } },
          ],
          responses: {
            200: { description: "Trả về danh sách món ăn trong hóa đơn." },
          },
        },
      },
      "/api/orders/{id}/status": {
        put: {
          summary: "Cập nhật trạng thái hóa đơn (yêu cầu đăng nhập)",
          tags: ["Orders"],
          security: [{ BearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "integer" } },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: {
                      type: "string",
                      example: "Preparing",
                      description: "Pending | Preparing | Served | Paid | Cancelled",
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Cập nhật trạng thái hóa đơn thành công!" },
          },
        },
      },
      "/api/orders/report/revenue": {
        get: {
          summary: "Thống kê doanh thu theo ngày (yêu cầu đăng nhập)",
          tags: ["Orders"],
          security: [{ BearerAuth: [] }],
          responses: {
            200: { description: "Trả về thống kê doanh thu theo ngày." },
          },
        },
      },

      // ================= TABLES =================
      "/api/tables": {
        get: {
          summary: "Lấy danh sách tất cả bàn (công khai)",
          tags: ["Tables"],
          responses: {
            200: { description: "Trả về danh sách bàn thành công." },
          },
        },
        post: {
          summary: "Thêm bàn mới (yêu cầu đăng nhập)",
          tags: ["Tables"],
          security: [{ BearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    table_number: { type: "string", example: "Bàn 09" },
                    capacity: { type: "integer", example: 4 },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Thêm bàn thành công!" },
          },
        },
      },
      "/api/tables/{id}": {
        put: {
          summary: "Sửa thông tin bàn (yêu cầu đăng nhập)",
          tags: ["Tables"],
          security: [{ BearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "integer" } },
          ],
          responses: {
            200: { description: "Cập nhật bàn thành công!" },
          },
        },
        delete: {
          summary: "Xóa bàn (yêu cầu đăng nhập)",
          tags: ["Tables"],
          security: [{ BearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "integer" } },
          ],
          responses: {
            200: { description: "Xóa bàn thành công!" },
          },
        },
      },
      "/api/tables/{id}/status": {
        put: {
          summary: "Cập nhật trạng thái bàn: Available | Reserved | Occupied (yêu cầu đăng nhập)",
          tags: ["Tables"],
          security: [{ BearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "integer" } },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { status: { type: "string", example: "Occupied" } },
                },
              },
            },
          },
          responses: {
            200: { description: "Cập nhật trạng thái bàn thành công!" },
          },
        },
      },

      // ================= RESERVATIONS =================
      "/api/reservations": {
        get: {
          summary: "Lấy danh sách tất cả đặt bàn (yêu cầu đăng nhập)",
          tags: ["Reservations"],
          security: [{ BearerAuth: [] }],
          responses: {
            200: { description: "Trả về danh sách đặt bàn thành công." },
          },
        },
        post: {
          summary: "Khách đặt bàn trước (công khai, KHÔNG cần đăng nhập)",
          tags: ["Reservations"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    table_id: { type: "integer", example: 1 },
                    customer_name: { type: "string", example: "Nguyễn Văn A" },
                    phone: { type: "string", example: "0909123456" },
                    reservation_time: { type: "string", example: "2026-07-10T19:00:00" },
                    number_of_people: { type: "integer", example: 4 },
                    note: { type: "string", example: "Gần cửa sổ" },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Đặt bàn thành công!" },
            400: { description: "Bàn không đủ chỗ hoặc đang có khách." },
          },
        },
      },
      "/api/reservations/{id}/status": {
        put: {
          summary: "Cập nhật trạng thái đặt bàn: Pending | Confirmed | Cancelled | Completed (yêu cầu đăng nhập)",
          tags: ["Reservations"],
          security: [{ BearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "integer" } },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { status: { type: "string", example: "Confirmed" } },
                },
              },
            },
          },
          responses: {
            200: { description: "Cập nhật trạng thái đặt bàn thành công!" },
          },
        },
      },
      "/api/reservations/{id}": {
        delete: {
          summary: "Xóa đặt bàn (yêu cầu đăng nhập)",
          tags: ["Reservations"],
          security: [{ BearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "integer" } },
          ],
          responses: {
            200: { description: "Xóa đặt bàn thành công!" },
          },
        },
      },
    },
  },
  apis: [], // Bỏ trống mảng này vì chúng ta đã khai báo tường minh ở trên
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
