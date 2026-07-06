import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import { useShop } from "../context/ShopContext";

function SearchPage() {
  const location = useLocation();
  const { products } = useShop();

  const keyword = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("q") || "";
  }, [location.search]);

  const filteredProducts = products.filter((product) => {
    if (!keyword.trim()) return true;
    const normalized = keyword.toLowerCase();
    return (
      product.name.toLowerCase().includes(normalized) ||
      product.description.toLowerCase().includes(normalized) ||
      product.brand.toLowerCase().includes(normalized)
    );
  });

  return (
    <PageLayout
      title={keyword ? `Kết quả tìm kiếm cho “${keyword}”` : "Tất cả sản phẩm"}
      description="Tìm thấy các sản phẩm phù hợp với nhu cầu của bạn."
    >
      {filteredProducts.length === 0 ? (
        <p>Không tìm thấy sản phẩm nào.</p>
      ) : (
        <div className="row g-4 mt-3">
          {filteredProducts.map((product) => (
            <div key={product.id} className="col-12 col-md-6 col-lg-4">
              <div className="product-card category-product-card h-100">
                <div className="product-image-wrap">
                  <img src={product.image} alt={product.name} />
                </div>
                <div className="card-body">
                  <span className="product-chip">{product.badge}</span>
                  <h5>{product.name}</h5>
                  <p className="product-desc">{product.description}</p>
                  <div className="product-footer">
                    <h6>{product.price.toLocaleString()} VNĐ</h6>
                    <Link
                      to={`/san-pham/${product.id}`}
                      className="btn btn-orange-sm"
                    >
                      Xem chi tiết
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageLayout>
  );
}

export default SearchPage;
