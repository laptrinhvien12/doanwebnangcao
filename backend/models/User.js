const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        required: true, 
        enum: ['user', 'admin'], 
        default: 'user' // Mặc định tài khoản đăng ký mới là 'user'
    }
}, {
    timestamps: true
});

// Middleware của Mongoose: Tự động mã hóa mật khẩu TRƯỚC KHI LƯU vào database
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Phương thức kiểm tra mật khẩu nhập vào có khớp với mật khẩu đã mã hóa hay không
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;