import { Link } from "react-router-dom";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Banner from "../components/Banner";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import { useShop } from "../context/ShopContext";

function Home() {
  const { products, banners } = useShop();
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="home-page">
      <Header />
      <Navbar />

      <main className="main-content">
        <section className="container hero-section">
          <div className="hero-card">
            <div className="hero-copy">
              <span className="hero-badge">Ưu đãi mùa mới</span>
              <h1>Khám phá điện thoại đẹp, mạnh và giá tốt</h1>
              <p>
                Từ mẫu flagship sang trọng đến thiết bị tiện lợi, tất cả đều có
                mức giá hấp dẫn và bảo hành rõ ràng.
              </p>
              <div className="hero-actions">
                <a href="#" className="btn btn-orange">
                  Mua ngay
                </a>
                <a href="#" className="btn btn-outline-orange">
                  Xem khuyến mãi
                </a>
              </div>
            </div>
            <div className="hero-visual">
              <div className="hero-glow" />
              <div className="hero-phone-card">
                <span>New</span>
                <h3>iPhone 15 Pro</h3>
                <p>Giảm ngay 3 triệu</p>
              </div>
            </div>
          </div>
        </section>

        <section className="container banner-section">
          <div className="row g-4">
            {banners.map((banner) => (
              <div key={banner.id} className="col-lg-6">
                <div className="banner-card">
                  <img src={banner.image} alt={banner.title} />
                  <div className="banner-overlay">
                    <span className="banner-tag">Khuyến mãi</span>
                    <h3>{banner.title}</h3>
                    <p>{banner.subtitle}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="container section-block">
          <div className="section-heading">
            <div>
              <p className="section-kicker">Bộ sưu tập mới</p>
              <h2>Điện thoại nổi bật</h2>
            </div>
            <Link to="/dien-thoai" className="text-link">
              Xem tất cả
            </Link>
          </div>

          <div className="row g-4">
            {featuredProducts.map((product) => (
              <div key={product.id} className="col-12 col-md-6 col-lg-3">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Home;
