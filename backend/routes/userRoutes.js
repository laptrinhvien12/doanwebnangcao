const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

// Route công khai (Ai cũng truy cập được)
router.post('/register', registerUser);
router.post('/login', loginUser);

// Route cần đăng nhập (Sử dụng middleware 'protect')
router.get('/profile', protect, getUserProfile);

// Route ví dụ: Chỉ có Admin mới được vào xem danh sách (Kết hợp cả 'protect' và 'admin')
router.get('/admin-only-dashboard', protect, admin, (req, res) => {
    res.json({ message: 'Chào mừng Admin! Đây là dữ liệu quản trị tối mật.' });
});

module.exports = router;