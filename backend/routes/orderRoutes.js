const express = require('express');
const router = express.Router();
const { addOrderItems, getMyOrders, getOrders, updateOrderToPaid, updateOrderStatus } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, addOrderItems)
    .get(protect, admin, getOrders); // CHỈ ADMIN MỚI ĐƯỢC GỌI API NÀY

router.route('/myorders').get(protect, getMyOrders);
router.route('/:id/pay').put(protect, updateOrderToPaid);

router.route('/:id/status')
    .put(protect, admin, updateOrderStatus); // API MỚI CHO ADMIN

module.exports = router;