import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import axiosClient from "../api/axiosClient";

function CategoryPage() {
  const { categoryName } = useParams(); 

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // CÁC STATE CHO BỘ LỌC VÀ SẮP XẾP
  const [sort, setSort] = useState("");
  const [ram, setRam] = useState("");
  const [storage, setStorage] = useState("");

  const getCategoryTitle = (cat) => {
    if (!cat) return "Sản phẩm";
    switch (cat.toLowerCase()) {
      case "smartphone": return "Điện thoại di động";
      case "tablet": return "Máy tính bảng";
      case "laptop": return "Laptop & Macbook";
      case "used": return "Máy cũ giá tốt";
      case "smartdevice": return "Đồng hồ thông minh";
      case "smarthome": return "Nhà thông minh";
      case "accessory": return "Phụ kiện công nghệ";
      case "audio": return "Thiết bị âm thanh";
      default: return "Bộ sưu tập sản phẩm";
    }
  };

  useEffect(() => {
    const fetchProductsByCategory = async () => {
      if (!categoryName) return;
      
      setLoading(true);
      setError("");
      try {
        // Nối các tham số bộ lọc vào API URL
        let apiUrl = `/products?category=${encodeURIComponent(categoryName.trim())}`;
        
        if (sort) apiUrl += `&sort=${sort}`;
        if (ram) apiUrl += `&ram=${encodeURIComponent(ram)}`;
        if (storage) apiUrl += `&storage=${encodeURIComponent(storage)}`;

        const { data } = await axiosClient.get(apiUrl);
        setProducts(data);
        setLoading(false);
      } catch (err) {
        console.error("Lỗi kết nối API danh mục:", err);
        setError("Không thể đồng bộ danh sách sản phẩm thuộc nhóm này.");
        setLoading(false);
      }
    };

    // Hàm này sẽ tự động chạy lại mỗi khi categoryName, sort, ram, hoặc storage bị thay đổi
    fetchProductsByCategory();
  }, [categoryName, sort, ram, storage]);

  return (
    <div className="category-page">
      <Header />
      <Navbar />

      <main className="main-content container" style={{ padding: "40px 15px", minHeight: "60vh" }}>
        
        <div className="category-heading" style={{ marginBottom: "20px" }}>
          <h2 style={{ display: "inline-block", borderBottom: "3px solid #ff6600", paddingBottom: "5px" }}>
            {getCategoryTitle(categoryName)}
          </h2>
          <p style={{ color: "#666", marginTop: "10px" }}>Tìm thấy <strong>{products.length}</strong> sản phẩm</p>
        </div>

        {/* ================= THANH CÔNG CỤ LỌC & SẮP XẾP ================= */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "15px", alignItems: "center", background: "#fff", padding: "15px 20px", borderRadius: "10px", border: "1px solid #e0e0e0", boxShadow: "0 2px 10px rgba(0,0,0,0.02)", marginBottom: "30px" }}>
          
          <div style={{ display: "flex", gap: "15px", alignItems: "center", flex: 1 }}>
            <span style={{ fontWeight: "600", color: "#333" }}>📍 Lọc theo:</span>
            
            <select value={ram} onChange={(e) => setRam(e.target.value)} style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #ddd", outline: "none", cursor: "pointer", fontSize: "14px", background: "#f8f9fa" }}>
              <option value="">Tất cả RAM</option>
              <option value="4GB">RAM 4GB</option>
              <option value="8GB">RAM 8GB</option>
              <option value="12GB">RAM 12GB</option>
              <option value="16GB">RAM 16GB</option>
            </select>

            <select value={storage} onChange={(e) => setStorage(e.target.value)} style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #ddd", outline: "none", cursor: "pointer", fontSize: "14px", background: "#f8f9fa" }}>
              <option value="">Tất cả Dung lượng</option>
              <option value="64GB">64GB</option>
              <option value="128GB">128GB</option>
              <option value="256GB">256GB</option>
              <option value="512GB">512GB</option>
              <option value="1TB">1TB</option>
            </select>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontWeight: "600", color: "#333" }}>🔃 Sắp xếp:</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)} style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #ff6600", outline: "none", cursor: "pointer", fontSize: "14px", color: "#ff6600", fontWeight: "bold" }}>
              <option value="">Nổi bật nhất</option>
              <option value="price_asc">Giá: Thấp đến Cao</option>
              <option value="price_desc">Giá: Cao đến Thấp</option>
            </select>
          </div>

        </div>
        {/* ============================================================== */}

        {loading ? (
          <h4 style={{ textAlign: "center", padding: "40px" }}>Hệ thống đang tải dữ liệu...</h4>
        ) : error ? (
          <h4 style={{ textAlign: "center", color: "red", padding: "40px" }}>{error}</h4>
        ) : products.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", background: "#f9f9f9", borderRadius: "12px" }}>
            <h3 style={{ color: "#333" }}>Không có sản phẩm nào khớp với bộ lọc</h3>
            <p style={{ color: "#777" }}>Hãy thử điều chỉnh lại mức dung lượng RAM hoặc ROM.</p>
            <button onClick={() => { setRam(""); setStorage(""); setSort(""); }} className="btn btn-outline-orange mt-3">Xóa bộ lọc</button>
          </div>
        ) : (
          <div className="row g-4">
            {products.map((product) => (
              <div key={product._id} className="col-12 col-md-6 col-lg-3">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default CategoryPage;