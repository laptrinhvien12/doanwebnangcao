const mongoose = require('mongoose');

// Schema for one review
const reviewSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    name: { type: String, required: true }, // User's name
    rating: { type: Number, required: true }, // Rating from 1 to 5
    comment: { type: String, required: true },
}, {
    timestamps: true
});

// 1. Định nghĩa Schema cho MỘT biến thể
const variantSchema = mongoose.Schema({
    sku: { type: String, required: true }, // Mã quản lý kho (VD: IP15PM-256-TITAN)
    color: { type: String, required: true }, // Màu sắc
    ram: { type: String }, // RAM (nếu có)
    storage: { type: String }, // Dung lượng bộ nhớ (nếu có)
    price: { type: Number, required: true }, // Giá bán của CỤ THỂ biến thể này
    oldPrice: { type: Number }, // Giá gốc của biến thể này
    countInStock: { type: Number, required: true, default: 0 }, // Tồn kho của màu/dung lượng này
    image: { type: String } // Ảnh riêng cho màu này (không bắt buộc)
});

// 2. Định nghĩa Schema cho Sản phẩm chung
const productSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    name: { type: String, required: true },
    brand: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true }, // Ảnh đại diện chung ở trang chủ
    
    // Thay vì lưu giá và tồn kho ở ngoài, ta dùng giá khởi điểm để hiển thị trên web (VD: "Từ 28.990.000đ")
    basePrice: { type: Number, required: true }, 

    // Nhúng mảng các biến thể vào đây
    variants: [variantSchema],

    // Thêm các trường cho hệ thống đánh giá
    reviews: [reviewSchema],
    rating: {
        type: Number,
        required: true,
        default: 0
    },
    numReviews: {
        type: Number,
        required: true,
        default: 0
    }
}, {
    timestamps: true
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;