const express = require('express');
const router = express.Router();
const { getAllReviews, deleteReview } = require('../controllers/reviewController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(protect, admin, getAllReviews);
router.route('/:productId/:reviewId').delete(protect, admin, deleteReview);

module.exports = router;