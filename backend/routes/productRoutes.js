const express = require('express');
const router = express.Router();
const { getProducts, getProductById, createProduct, deleteProduct, updateProduct} = require('../controllers/productController');

// Import middleware phân quyền từ phần Auth
const { protect, admin } = require('../middleware/authMiddleware');

// Khai báo các route
// Cùng là '/', nhưng GET thì ai cũng xem được, POST thì phải là Admin đã đăng nhập
router.route('/')
    .get(getProducts)
    .post(protect, admin, createProduct); 

// Cùng là '/:id', GET để xem chi tiết, DELETE để xóa (yêu cầu Admin)
router.route('/:id')
    .get(getProductById)
    .put(protect, admin, updateProduct)
    .delete(protect, admin, deleteProduct);
module.exports = router;