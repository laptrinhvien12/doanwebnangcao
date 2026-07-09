const express = require('express');
const router = express.Router();
const { addOrderItems, getMyOrders, updateOrderToPaid} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, addOrderItems); // protect = Bắt buộc đăng nhập
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id/pay').put(protect, updateOrderToPaid);
module.exports = router;