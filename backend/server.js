const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
// Cấu hình biến môi trường từ file .env
dotenv.config();

// Khởi động kết nối tới MongoDB Compass
connectDB();

const app = express();

// Cấu hình Middleware hệ thống
app.use(cors()); // Cho phép các ứng dụng Frontend kết nối tới API
app.use(express.json()); // Bắt buộc phải có để server hiểu dữ liệu JSON gửi lên từ Body request

// Khai báo các Tuyến đường (Routes) cho Xác thực & Thành viên
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Tuyến đường mặc định kiểm tra tình trạng Server
app.get('/', (req, res) => {
    res.send('Hệ thống API Authentication đang hoạt động...');
});

// Thiết lập Port chạy ứng dụng
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server đang vận hành ổn định trên port ${PORT}`);
});