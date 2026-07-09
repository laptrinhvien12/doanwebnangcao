const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    // LIÊN KẾT ĐƠN HÀNG VỚI TÀI KHOẢN ĐANG ĐĂNG NHẬP
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    
    // DANH SÁCH MẶT HÀNG ĐÃ MUA
    orderItems: [
        {
            name: { type: String, required: true },
            qty: { type: Number, required: true },
            image: { type: String, required: true },
            price: { type: Number, required: true },
            variantName: { type: String }, // VD: "256GB - Titan Trắng"
            product: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product' }
        }
    ],
    
    // THÔNG TIN GIAO HÀNG
    shippingAddress: {
        fullName: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true },
    },
    
    // TỔNG TIỀN VÀ TRẠNG THÁI
    totalPrice: { type: Number, required: true, default: 0.0 },
    status: { type: String, default: 'Chờ xác nhận' }, // Chờ xác nhận -> Đang giao -> Hoàn thành
    isPaid: { type: Boolean, default: false }
}, {
    timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);