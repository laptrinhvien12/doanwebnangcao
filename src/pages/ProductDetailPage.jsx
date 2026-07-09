import { useParams, Link } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import { useShop } from "../context/ShopContext";

function ProductDetailPage() {
  const { id } = useParams();
  const { products, addToCart } = useShop();
  const product = products.find((item) => item.id === Number(id));

  if (!product) {
    return (
      <PageLayout
        title="Sản phẩm không tồn tại"
        description="Vui lòng quay lại danh sách sản phẩm."
      >
        <Link to="/dien-thoai" className="btn btn-orange mt-3">
          Quay lại cửa hàng
        </Link>
      </PageLayout>
    );
  }

  return (
    <PageLayout title={product.name} description={product.description}>
      <div className="detail-grid">
        <div className="detail-image-card">
          <img src={product.image} alt={product.name} />
        </div>
        <div className="detail-info-card">
          <span className="product-chip">{product.badge}</span>
          <h2>{product.name}</h2>
          <p className="detail-price">{product.price.toLocaleString()} VNĐ</p>
          <p>
            <strong>Hãng:</strong> {product.brand}
          </p>
          <p>
            <strong>RAM:</strong> {product.ram}
          </p>
          <p>
            <strong>Bộ nhớ:</strong> {product.storage}
          </p>
          <p>
            <strong>Đánh giá:</strong> {product.rating}/5
          </p>
          <div className="detail-actions">
            <button
              className="btn btn-orange"
              onClick={() => addToCart(product)}
            >
              Thêm vào giỏ hàng
            </button>
            <Link to="/gio-hang" className="btn btn-outline-orange">
              Mua ngay
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

export default ProductDetailPage;
