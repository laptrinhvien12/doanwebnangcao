const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware kiểm tra xem người dùng đã đăng nhập chưa (có Token hợp lệ không)
const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Lấy token từ chuỗi "Bearer <token>"
            token = req.headers.authorization.split(' ')[1];

            // Giải mã token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Tìm user trong DB bằng id từ token và loại bỏ password khỏi kết quả trả về
            req.user = await User.findById(decoded.id).select('-password');

            next(); // Cho phép chuyển tiếp sang controller xử lý tiếp theo
        } catch (error) {
            res.status(401).json({ message: 'Không có quyền truy cập, token không hợp lệ' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Không có quyền truy cập, thiếu token' });
    }
};

// Middleware kiểm tra quyền Admin
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next(); // Nếu đúng là admin, cho phép tiếp tục
    } else {
        res.status(403).json({ message: 'Quyền truy cập bị từ chối, yêu cầu quyền Admin' });
    }
};

module.exports = { protect, admin };