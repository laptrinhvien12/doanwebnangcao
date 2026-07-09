import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import { useShop } from "../context/ShopContext";
import axiosClient from "../api/axiosClient"; // Import axiosClient đã cấu hình

function Home() {
  // Vẫn lấy banners từ Context (vì chưa có API cho Banner)
  const { banners } = useShop(); 
  
  // Tạo state lưu trữ danh sách sản phẩm từ Backend
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Dùng useEffect để gọi API ngay khi trang Home vừa load
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axiosClient.get("/products");
        setProducts(data); // Lưu dữ liệu vào state
        setLoading(false);
      } catch (err) {
        console.error("Lỗi tải sản phẩm:", err);
        setError("Không thể tải danh sách sản phẩm lúc này.");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Lấy 4 sản phẩm đầu tiên làm sản phẩm nổi bật
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
            {banners?.map((banner) => (
              // Nếu data banner cũ dùng id thì giữ nguyên banner.id, nếu là mongo thì banner._id
              <div key={banner.id || banner._id} className="col-lg-6"> 
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

          {/* Hiển thị thông báo nếu đang tải hoặc bị lỗi */}
          {loading ? (
            <h4 style={{ textAlign: "center", padding: "20px" }}>Đang tải sản phẩm...</h4>
          ) : error ? (
            <h4 style={{ textAlign: "center", color: "red", padding: "20px" }}>{error}</h4>
          ) : (
            <div className="row g-4">
              {featuredProducts.map((product) => (
                // Đổi thành product._id theo chuẩn của MongoDB
                <div key={product._id} className="col-12 col-md-6 col-lg-3">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Home;