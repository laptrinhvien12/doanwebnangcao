const Product = require('../models/Product');

// @desc    Lấy danh sách tất cả sản phẩm (Hỗ trợ tìm kiếm theo tên VÀ LỌC THEO DANH MỤC KHÔNG PHÂN BIỆT HOA THƯỜNG)
// @route   GET /api/products
// @access  Public (Ai cũng xem được)
const getProducts = async (req, res) => {
    try {
        let filter = {};

        // 1. Lọc theo danh mục
        if (req.query.category && req.query.category.trim() !== "") {
            filter.category = { 
                $regex: `^${req.query.category.trim()}$`, 
                $options: 'i' 
            };
        }

        // 2. Tìm kiếm theo từ khóa
        if (req.query.keyword && req.query.keyword.trim() !== "") {
            filter.name = {
                $regex: req.query.keyword.trim(),
                $options: 'i'
            };
        }

        // 3. Lọc theo RAM (truy vấn vào mảng variants)
        if (req.query.ram && req.query.ram.trim() !== "") {
            filter["variants.ram"] = {
                $regex: `^${req.query.ram.trim()}$`,
                $options: 'i'
            };
        }

        // 4. Lọc theo Bộ nhớ ROM (truy vấn vào mảng variants)
        if (req.query.storage && req.query.storage.trim() !== "") {
            filter["variants.storage"] = {
                $regex: `^${req.query.storage.trim()}$`,
                $options: 'i'
            };
        }

        // 5. Cấu hình Sắp xếp (Sort)
        let sortOption = {};
        if (req.query.sort === "price_asc") {
            sortOption.basePrice = 1; // 1 là tăng dần (Thấp -> Cao)
        } else if (req.query.sort === "price_desc") {
            sortOption.basePrice = -1; // -1 là giảm dần (Cao -> Thấp)
        } else {
            sortOption.createdAt = -1; // Mặc định: Sản phẩm mới nhất lên đầu
        }

        console.log("=== BỘ LỌC MONGODB ===", filter, "=== SẮP XẾP ===", sortOption);

        // Chạy query lấy dữ liệu kèm theo sort
        const products = await Product.find(filter).sort(sortOption);
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi tải danh sách sản phẩm', error: error.message });
    }
};

// @desc    Lấy thông tin chi tiết 1 sản phẩm theo ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.status(200).json(product);
        } else {
            res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        }
    } catch (error) {
        res.status(500).json({ message: 'ID sản phẩm không hợp lệ', error: error.message });
    }
};

// @desc    Thêm sản phẩm mới (Hỗ trợ nhiều biến thể: màu sắc, ram, dung lượng)
// @route   POST /api/products
// @access  Private/Admin (Chỉ Admin mới làm được)
const createProduct = async (req, res) => {
    try {
        const { name, brand, category, description, image, basePrice, variants } = req.body;

        const product = new Product({
            user: req.user._id, 
            name,
            brand,
            category,
            description,
            image,
            basePrice,          
            variants: variants || [] 
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(400).json({ message: 'Dữ liệu không hợp lệ', error: error.message });
    }
};

// @desc    Xóa sản phẩm
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            await product.deleteOne();
            res.status(200).json({ message: 'Đã xóa sản phẩm thành công' });
        } else {
            res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// @desc    Cập nhật sản phẩm
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
    try {
        const { name, brand, category, description, image, basePrice, variants } = req.body;
        const product = await Product.findById(req.params.id);

        if (product) {
            product.name = name || product.name;
            product.brand = brand || product.brand;
            product.category = category || product.category;
            product.description = description || product.description;
            product.image = image || product.image;
            product.basePrice = basePrice !== undefined ? basePrice : product.basePrice;
            product.variants = variants || product.variants; 

            const updatedProduct = await product.save();
            res.status(200).json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Dữ liệu không hợp lệ', error: error.message });
    }
};

module.exports = { getProducts, getProductById, createProduct, deleteProduct, updateProduct };