import { Link } from "react-router-dom";
import { useShop } from "../context/ShopContext";

function ProductCard({ product }) {
  const { addToCart } = useShop();

  // 1. Xử lý giá an toàn: Ưu tiên basePrice (dữ liệu Mongo), sau đó đến price (dữ liệu tĩnh cũ), nếu không có thì mặc định là 0
  const displayPrice = product.basePrice || product.price || 0;

  // 2. Xử lý ID an toàn: MongoDB sử dụng _id, trong khi dữ liệu cứng cũ dùng id
  const productId = product._id || product.id;

  return (
    <div className="card product-card h-100">
      <div className="product-image-wrap">
        <img src={product.image} className="card-img-top" alt={product.name} />
      </div>

      <div className="card-body">
        {/* Render có điều kiện: Chỉ hiển thị thẻ span nếu sản phẩm có badge */}
        {product.badge && <span className="product-chip">{product.badge}</span>}
        
        <h5>{product.name}</h5>
        <p className="product-desc">{product.description}</p>

        <div className="product-footer">
          {/* Sử dụng biến displayPrice đã được xử lý an toàn ở trên */}
          <h6>{displayPrice.toLocaleString()} VNĐ</h6>
          
          <div className="d-flex gap-2">
            <button
              className="btn btn-orange-sm"
              onClick={() => addToCart(product)}
            >
              Thêm vào giỏ
            </button>
            <Link
              // Sử dụng biến productId đã xử lý để không bị lỗi 'undefined' trên URL
              to={`/product/${productId}`} 
              className="btn btn-outline-orange"
            >
              Chi tiết
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;