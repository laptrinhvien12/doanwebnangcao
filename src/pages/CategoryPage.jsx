import { Link } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import products from "../data/products";

function CategoryPage({ title, description, category }) {
  const filteredProducts = products.filter(
    (item) => item.category === category,
  );

  return (
    <PageLayout title={title} description={description}>
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
    </PageLayout>
  );
}

export default CategoryPage;
