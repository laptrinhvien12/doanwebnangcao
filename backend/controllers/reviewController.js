const Product = require('../models/Product');

// @desc    Tạo một đánh giá mới cho sản phẩm
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = async (req, res) => {
    const { rating, comment } = req.body;
    const productId = req.params.id;

    try {
        const product = await Product.findById(productId);

        if (product) {
            // Kiểm tra xem user này đã đánh giá sản phẩm này chưa
            const alreadyReviewed = product.reviews.find(
                (r) => r.user.toString() === req.user._id.toString()
            );

            if (alreadyReviewed) {
                return res.status(400).json({ message: 'Bạn đã đánh giá sản phẩm này rồi' });
            }

            // Tạo đối tượng review mới
            const review = {
                name: req.user.name,
                rating: Number(rating),
                comment,
                user: req.user._id,
            };

            // Thêm review mới vào mảng reviews của sản phẩm
            product.reviews.push(review);

            // Cập nhật lại số lượng review và điểm trung bình
            product.numReviews = product.reviews.length;
            product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

            await product.save();
            res.status(201).json({ message: 'Cảm ơn bạn đã gửi đánh giá!' });
        } else {
            res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi tạo đánh giá', error: error.message });
    }
};

// @desc    Lấy tất cả đánh giá (cho Admin)
// @route   GET /api/reviews
// @access  Private/Admin
const getAllReviews = async (req, res) => {
    try {
        // Tìm tất cả sản phẩm có chứa review
        const productsWithReviews = await Product.find({ 'reviews.0': { $exists: true } })
            .populate('reviews.user', 'name email')
            .select('name reviews');

        // Biến đổi dữ liệu để dễ xử lý ở frontend
        const allReviews = productsWithReviews.flatMap(product => 
            product.reviews.map(review => ({
                _id: review._id,
                productId: product._id,
                productName: product.name,
                user: review.user,
                userName: review.name,
                rating: review.rating,
                comment: review.comment,
                createdAt: review.createdAt,
            }))
        ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        res.status(200).json(allReviews);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi tải danh sách đánh giá', error: error.message });
    }
};

// @desc    Xóa một đánh giá (cho Admin)
// @route   DELETE /api/reviews/:productId/:reviewId
// @access  Private/Admin
const deleteReview = async (req, res) => {
    const { productId, reviewId } = req.params;

    try {
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        }

        // Lọc ra mảng reviews mới không chứa review bị xóa
        const newReviews = product.reviews.filter((r) => r._id.toString() !== reviewId);

        product.reviews = newReviews;
        product.numReviews = newReviews.length;
        product.rating = newReviews.length > 0 ? newReviews.reduce((acc, item) => item.rating + acc, 0) / newReviews.length : 0;

        await product.save();
        res.status(200).json({ message: 'Đã xóa đánh giá thành công' });

    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi xóa đánh giá', error: error.message });
    }
};

module.exports = { createProductReview, getAllReviews, deleteReview };