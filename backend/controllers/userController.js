const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Hàm tạo JWT token dựa trên ID của User
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d', // Token có hiệu lực trong 30 ngày
    });
};

// @desc    Đăng ký tài khoản mới
// @route   POST /api/users/register
const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'Email này đã được sử dụng' });
        }

        // Tạo tài khoản mới (Mật khẩu tự động băm nhờ middleware ở Model)
        const user = await User.create({
            name,
            email,
            password,
            role: role || 'user' // Có thể truyền 'admin' từ body nếu muốn tạo admin thủ công lúc dev
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        }
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// @desc    Đăng nhập người dùng & lấy token
// @route   POST /api/users/login
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        // Sử dụng phương thức matchPassword đã định nghĩa ở Model để kiểm tra
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Email hoặc mật khẩu không chính xác' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// @desc    Lấy thông tin cá nhân (Route cần bảo mật)
// @route   GET /api/users/profile
const getUserProfile = async (req, res) => {
    // req.user được gán từ middleware 'protect'
    if (req.user) {
        res.json({
            _id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role
        });
    } else {
        res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
};

module.exports = { registerUser, loginUser, getUserProfile };