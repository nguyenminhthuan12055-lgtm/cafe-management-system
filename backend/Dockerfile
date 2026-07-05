# Sử dụng môi trường Node.js bản ổn định
FROM node:18-alpine

# Tạo thư mục làm việc bên trong container
WORKDIR /app

# Sao chép file quản lý thư viện vào trước
COPY package*.json ./

# Cài đặt các thư viện Node.js
RUN npm install

# Sao chép toàn bộ mã nguồn Backend vào container
COPY . .

# Mở cổng 5000 của container
EXPOSE 5000

# Lệnh khởi chạy ứng dụng
CMD ["node", "server.js"]