const Order = require('../models/Order');

// @desc    Tạo đơn hàng mới
// @route   POST /api/orders
// @access  Private (Phải đăng nhập mới mua được)
const addOrderItems = async (req, res) => {
    try {
        const { orderItems, shippingAddress, totalPrice } = req.body;

        if (orderItems && orderItems.length === 0) {
            return res.status(400).json({ message: 'Giỏ hàng trống' });
        } else {
            // SỬA LỖI TẠI ĐÂY: Biến đổi mảng orderItems từ Frontend gửi lên.
            // Map (ánh xạ) trường 'id' thành trường 'product' để vượt qua xác thực của Mongoose
            const formattedOrderItems = orderItems.map(item => ({
                ...item,
                product: item.id 
            }));

            const order = new Order({
                user: req.user._id, // Gắn ID user từ Token đang đăng nhập
                orderItems: formattedOrderItems, // Dùng mảng đã định dạng chuẩn
                shippingAddress,
                totalPrice
            });

            const createdOrder = await order.save();
            res.status(201).json(createdOrder);
        }
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi tạo đơn hàng', error: error.message });
    }
};

// @desc    Lấy danh sách đơn hàng của TÀI KHOẢN ĐANG ĐĂNG NHẬP
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi tải danh sách đơn hàng' });
    }
};
const updateOrderToPaid = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.isPaid = true;
            order.status = 'Đang xử lý'; // Đổi trạng thái từ Chờ xác nhận -> Đang xử lý
            
            const updatedOrder = await order.save();
            res.status(200).json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Lỗi cập nhật thanh toán', error: error.message });
    }
};

module.exports = { addOrderItems, getMyOrders, updateOrderToPaid };