import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import { useShop } from "../context/ShopContext";
import axiosClient from "../api/axiosClient"; // Đảm bảo đường dẫn chính xác tới axiosClient của bạn

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useShop();

  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const { data } = await axiosClient.get(`/products/${id}`);
        setProduct(data);
        
        // Mặc định chọn phiên bản biến thể đầu tiên khi vừa tải trang
        if (data.variants && data.variants.length > 0) {
          setSelectedVariant(data.variants[0]);
        }
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi tải chi tiết sản phẩm:", error);
        setLoading(false);
      }
    };

    fetchProductDetail();
  }, [id]);

  if (loading) {
    return (
      <PageLayout title="Đang tải...">
        <div style={{ textAlign: "center", padding: "100px 0" }}>
          <h3>🔄 Hệ thống đang tải thông tin sản phẩm...</h3>
        </div>
      </PageLayout>
    );
  }

  if (!product) {
    return (
      <PageLayout title="Sản phẩm không tồn tại">
        <div style={{ textAlign: "center", padding: "100px 0" }}>
          <h2>⚠️ Không tìm thấy sản phẩm yêu cầu!</h2>
          <Link to="/" className="btn btn-orange mt-3">Quay lại trang chủ</Link>
        </div>
      </PageLayout>
    );
  }

  // Khai báo các biến hiển thị linh động theo biến thể được chọn
  const displayImage = selectedVariant?.image || product.image;
  const displayPrice = selectedVariant?.price || product.basePrice;
  const displayOldPrice = selectedVariant?.oldPrice || null;
  const discountPercentage = displayOldPrice ? Math.round(((displayOldPrice - displayPrice) / displayOldPrice) * 100) : 0;

  // Xử lý thêm vào giỏ hàng
  const handleAddToCart = () => {
    const itemToAdd = {
      id: product._id,
      name: product.name,
      image: displayImage,
      price: displayPrice,
      variantName: selectedVariant ? `${selectedVariant.storage} - ${selectedVariant.color}` : "Tiêu chuẩn",
      sku: selectedVariant?.sku || "SKU-MAIN",
    };
    addToCart(itemToAdd);
    alert("Đã thêm sản phẩm vào giỏ hàng thành công!");
  };

  // Xử lý nút Mua ngay
  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/gio-hang");
  };

  return (
    <PageLayout title={product.name}>
      <div className="container" style={{ padding: "30px 15px", background: "#f8f9fa" }}>
        
        {/* TÊN SẢN PHẨM PHÍA TRÊN CÙNG */}
        <div style={{ marginBottom: "20px", borderBottom: "1px solid #e0e0e0", paddingBottom: "15px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#333" }}>{product.name}</h1>
          <span style={{ fontSize: "14px", color: "#666" }}>Thương hiệu: <strong style={{ color: "#ff6600" }}>{product.brand}</strong> | Danh mục: {product.category}</span>
        </div>

        {/* KHU VỰC CHI TIẾT PHÍA TRÊN (CHIA 2 CỘT) */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "30px", marginBottom: "40px" }}>
          
          {/* CỘT TRÁI: HÌNH ẢNH SẢN PHẨM */}
          <div>
            <div style={{ background: "#fff", padding: "20px", borderRadius: "12px", border: "1px solid #e0e0e0", display: "flex", justifyContent: "center", alignItems: "center", height: "450px" }}>
              <img src={displayImage} alt={product.name} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
            </div>
            
            {/* Ảnh thư viện nhỏ ở dưới (Nếu có nhiều ảnh màu sắc thì render ra đây) */}
            {product.variants && product.variants.length > 0 && (
              <div style={{ display: "flex", gap: "10px", marginTop: "15px", overflowX: "auto", paddingBottom: "5px" }}>
                {product.variants.map((v) => v.image && (
                  <div 
                    key={v._id} 
                    onClick={() => setSelectedVariant(v)}
                    style={{ width: "70px", height: "70px", padding: "5px", background: "#fff", border: selectedVariant?._id === v._id ? "2px solid #ff6600" : "1px solid #ddd", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center" }}
                  >
                    <img src={v.image} alt={v.color} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* CỘT PHẢI: THÔNG TIN GIÁ CẢ, BIẾN THỂ, KHUYẾN MÃI */}
          <div>
            
            {/* KHU VỰC GIÁ TIỀN */}
            <div style={{ background: "#fff", padding: "15px 20px", borderRadius: "12px", border: "1px solid #e0e0e0", marginBottom: "20px" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: "15px" }}>
                <h2 style={{ color: "#d70018", fontSize: "28px", fontWeight: "bold", margin: 0 }}>
                  {displayPrice?.toLocaleString()} đ
                </h2>
                {displayOldPrice && (
                  <>
                    <span style={{ textDecoration: "line-through", color: "#888", fontSize: "16px" }}>{displayOldPrice.toLocaleString()} đ</span>
                    <span style={{ background: "#d70018", color: "#fff", padding: "2px 6px", borderRadius: "4px", fontSize: "12px", fontWeight: "bold" }}>-{discountPercentage}%</span>
                  </>
                )}
              </div>
              <p style={{ margin: "8px 0 0 0", fontSize: "13px", color: "#28a745", fontWeight: "500" }}>⭐ Giá đã bao gồm thuế VAT và bảo hành 12 tháng chính hãng</p>
            </div>

            {/* CHỌN PHIÊN BẢN BIẾN THỂ (VARIANTS) */}
            {product.variants && product.variants.length > 0 && (
              <div style={{ marginBottom: "20px" }}>
                <h4 style={{ fontSize: "15px", fontWeight: "bold", color: "#333", marginBottom: "10px" }}>Chọn cấu hình & màu sắc:</h4>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  {product.variants.map((v) => (
                    <div 
                      key={v._id}
                      onClick={() => setSelectedVariant(v)}
                      style={{
                        padding: "12px",
                        background: "#fff",
                        border: selectedVariant?._id === v._id ? "2px solid #ff6600" : "1px solid #ddd",
                        borderRadius: "8px",
                        cursor: "pointer",
                        position: "relative",
                        transition: "all 0.2s"
                      }}
                    >
                      <span style={{ fontWeight: "bold", display: "block", fontSize: "14px" }}>{v.storage} - {v.color}</span>
                      <span style={{ color: "#d70018", fontSize: "13px", fontWeight: "500" }}>{v.price?.toLocaleString()} đ</span>
                      {selectedVariant?._id === v._id && (
                        <span style={{ position: "absolute", bottom: "5px", right: "5px", fontSize: "16px", color: "#ff6600" }}>✔️</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* HỘP KHUYẾN MÃI (ĐẶC TRƯNG GIỐNG ONEWAY MOBILE) */}
            <div style={{ background: "#fff", border: "1px solid #ffcca3", borderRadius: "12px", overflow: "hidden", marginBottom: "25px" }}>
              <div style={{ background: "linear-gradient(90deg, #ff6600, #ff8533)", color: "#fff", padding: "10px 15px", fontWeight: "bold", display: "flex", alignItems: "center", gap: "8px" }}>
                🎁 QUÀ TẶNG & ƯU ĐÃI ĐI KÈM
              </div>
              <div style={{ padding: "15px", fontSize: "14px", display: "flex", flexDirection: "column", gap: "10px" }}>
                <div>🔹 Tặng bộ củ cáp sạc nhanh cao cấp chính hãng tương thích thiết bị.</div>
                <div>🔹 Giảm thêm tới 500.000đ khi thanh toán qua mã QR-Bank/Ví điện tử.</div>
                <div>🔹 Hỗ trợ mua trả góp lãi suất 0% - Thủ tục xét duyệt nhanh trong 15 phút.</div>
                <div>🔹 Trợ giá thu cũ đổi mới lên đời điện thoại, giảm trực tiếp thêm 1.000.000đ.</div>
              </div>
            </div>

            {/* CỤM NÚT THAO TÁC MUA HÀNG */}
            <div style={{ display: "flex", gap: "15px" }}>
              <button 
                onClick={handleBuyNow}
                style={{ flex: 1, padding: "15px", background: "#ff6600", color: "#fff", border: "none", borderRadius: "10px", fontSize: "16px", fontWeight: "bold", cursor: "pointer", transition: "background 0.2s" }}
              >
                MUA NGAY
                <span style={{ display: "block", fontSize: "11px", fontWeight: "normal", marginTop: "2px" }}>Giao hàng tận nơi hoặc nhận tại đại lý</span>
              </button>
              
              <button 
                onClick={handleAddToCart}
                style={{ width: "160px", padding: "15px", background: "#fff", color: "#ff6600", border: "2px solid #ff6600", borderRadius: "10px", fontSize: "14px", fontWeight: "bold", cursor: "pointer" }}
              >
                🛒 THÊM GIỎ HÀNG
              </button>
            </div>

          </div>
        </div>

        {/* KHU VỰC THÔNG TIN PHÍA DƯỚI (MÔ TẢ CHI TIẾT & THÔNG SỐ KỸ THUẬT) */}
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "30px" }}>
          
          {/* KHỐI TRÁI: BÀI VIẾT ĐÁNH GIÁ SẢN PHẨM */}
          <div style={{ background: "#fff", padding: "25px", borderRadius: "12px", border: "1px solid #e0e0e0" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "bold", borderBottom: "2px solid #ff6600", paddingBottom: "8px", marginBottom: "15px" }}>
              Đánh giá chi tiết sản phẩm
            </h3>
            <div style={{ lineHeight: "1.6", color: "#444", fontSize: "15px", whiteSpace: "pre-line" }}>
              {product.description}
            </div>
          </div>

          {/* KHỐI PHẢI: BẢNG THÔNG SỐ KỸ THUẬT */}
          <div style={{ background: "#fff", padding: "25px", borderRadius: "12px", border: "1px solid #e0e0e0", height: "fit-content" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "bold", borderBottom: "2px solid #ff6600", paddingBottom: "8px", marginBottom: "15px" }}>
              Thông số kỹ thuật
            </h3>
            
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
              <tbody>
                <tr style={{ background: "#f8f9fa" }}>
                  <td style={{ padding: "10px", fontWeight: "500", width: "40%", borderBottom: "1px solid #eee" }}>Màn hình</td>
                  <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>{selectedVariant?.screen || "OLED / Super Retina XDR"}</td>
                </tr>
                <tr>
                  <td style={{ padding: "10px", fontWeight: "500", borderBottom: "1px solid #eee" }}>Bộ nhớ RAM</td>
                  <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>{selectedVariant?.ram || "Chưa cập nhật"}</td>
                </tr>
                <tr style={{ background: "#f8f9fa" }}>
                  <td style={{ padding: "10px", fontWeight: "500", borderBottom: "1px solid #eee" }}>Dung lượng ổ lưu trữ</td>
                  <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>{selectedVariant?.storage || "Chưa cập nhật"}</td>
                </tr>
                <tr>
                  <td style={{ padding: "10px", fontWeight: "500", borderBottom: "1px solid #eee" }}>Phiên bản màu sắc</td>
                  <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>{selectedVariant?.color || "Tiêu chuẩn"}</td>
                </tr>
                <tr style={{ background: "#f8f9fa" }}>
                  <td style={{ padding: "10px", fontWeight: "500", borderBottom: "1px solid #eee" }}>Mã quản lý thiết bị</td>
                  <td style={{ padding: "10px", borderBottom: "1px solid #eee", color: "#666" }}>{selectedVariant?.sku || "Đang đồng bộ"}</td>
                </tr>
                <tr>
                  <td style={{ padding: "10px", fontWeight: "500", borderBottom: "1px solid #eee" }}>Tình trạng kho hàng</td>
                  <td style={{ padding: "10px", borderBottom: "1px solid #eee", color: (selectedVariant?.countInStock > 0) ? "green" : "red", fontWeight: "500" }}>
                    {selectedVariant?.countInStock > 0 ? `Còn hàng (${selectedVariant.countInStock} máy)` : "Hết hàng"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>

      </div>
    </PageLayout>
  );
}

export default ProductDetailPage;