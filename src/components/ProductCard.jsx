import { Link } from "react-router-dom";
import { useShop } from "../context/ShopContext";

function ProductCard({ product }) {
  const { addToCart } = useShop();

  return (
    <div className="card product-card h-100">
      <div className="product-image-wrap">
        <img src={product.image} className="card-img-top" alt={product.name} />
      </div>

      <div className="card-body">
        <span className="product-chip">{product.badge}</span>
        <h5>{product.name}</h5>
        <p className="product-desc">{product.description}</p>

        <div className="product-footer">
          <h6>{product.price.toLocaleString()} VNĐ</h6>
          <div className="d-flex gap-2">
            <button
              className="btn btn-orange-sm"
              onClick={() => addToCart(product)}
            >
              Thêm vào giỏ
            </button>
            <Link
              to={`/san-pham/${product.id}`}
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
