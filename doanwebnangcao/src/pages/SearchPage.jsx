import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import axiosClient from "../api/axiosClient"; // Đảm bảo đường dẫn chính xác tới axiosClient

function SearchPage() {
  // Hook của react-router-dom để lấy các tham số sau dấu "?" trên URL (VD: ?q=iphone)
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || ""; // Lấy giá trị của tham số "q"

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // useEffect sẽ tự động chạy lại bất cứ khi nào từ khóa "query" trên thanh URL thay đổi
  useEffect(() => {
    const searchProducts = async () => {
      if (!query.trim()) {
        setProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");
      try {
        // Gọi API Backend lấy sản phẩm kèm theo từ khóa tìm kiếm
        // Backend nhận tham số là "keyword", Frontend gửi lên là "query" từ URL
        const { data } = await axiosClient.get(`/products?keyword=${encodeURIComponent(query)}`);
        setProducts(data);
        setLoading(false);
      } catch (err) {
        console.error("Lỗi tìm kiếm sản phẩm:", err);
        setError("Có lỗi xảy ra trong quá trình tìm kiếm.");
        setLoading(false);
      }
    };

    searchProducts();
  }, [query]);

  return (
    <div className="search-page">
      <Header />
      <Navbar />

      <main className="main-content container style-container" style={{ padding: "40px 15px", minHeight: "60vh" }}>
        {/* Tiêu đề trạng thái tìm kiếm */}
        <div className="search-heading" style={{ marginBottom: "30px" }}>
          <p style={{ color: "#666", fontSize: "14px", margin: 0 }}>Kết quả tìm kiếm cho:</p>
          <h2 style={{ marginTop: "5px" }}>
            “<span style={{ color: "#ff6600" }}>{query}</span>”
            <span style={{ fontSize: "16px", color: "#888", fontWeight: "normal" }}>
              {" "}
              ({products.length} sản phẩm được tìm thấy)
            </span>
          </h2>
        </div>

        {/* Xử lý các trạng thái hiển thị: Đang tải -> Lỗi -> Trống -> Có kết quả */}
        {loading ? (
          <h4 style={{ textAlign: "center", padding: "40px" }}>🕵️‍♂️ Hệ thống đang tìm kiếm sản phẩm...</h4>
        ) : error ? (
          <h4 style={{ textAlign: "center", color: "red", padding: "40px" }}>{error}</h4>
        ) : products.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", background: "#f9f9f9", borderRadius: "12px" }}>
            <span style={{ fontSize: "50px" }}>🔍</span>
            <h3 style={{ marginTop: "15px", color: "#333" }}>Không tìm thấy sản phẩm nào phù hợp</h3>
            <p style={{ color: "#777" }}>Hãy thử lại bằng từ khóa khác (ví dụ: iphone, samsung, tablet...)</p>
          </div>
        ) : (
          // Đổ danh sách sản phẩm tìm thấy ra lưới giao diện mạng lưới Bootstrap g-4
          <div className="row g-4">
            {products.map((product) => (
              <div key={product._id} className="col-12 col-md-6 col-lg-3">
                {/* Tái sử dụng linh hoạt Component ProductCard đã đồng bộ dữ liệu với MongoDB */}
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

export default SearchPage;