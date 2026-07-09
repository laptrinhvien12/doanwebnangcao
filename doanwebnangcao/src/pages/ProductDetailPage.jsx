import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import { useShop } from "../context/ShopContext";
import StarRating from "../components/StarRating"; // Component để hiển thị sao
import ProductCard from "../components/ProductCard"; // Thêm component Card sản phẩm
import axiosClient from "../api/axiosClient"; // Đảm bảo đường dẫn chính xác tới axiosClient của bạn

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, user } = useShop(); // Lấy thông tin user

  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]); // State mới cho sản phẩm liên quan
  const [loading, setLoading] = useState(true);

  // State cho form đánh giá
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      setRelatedProducts([]); // Xóa sản phẩm liên quan cũ
      window.scrollTo(0, 0); // Cuộn lên đầu trang mỗi khi xem sản phẩm mới

      // Reset form review
      setRating(0);
      setComment("");
      setReviewError("");
      setReviewSuccess("");
      try {
        // 1. Tải thông tin sản phẩm chính
        const { data: productData } = await axiosClient.get(`/products/${id}`);
        setProduct(productData);
        
        // Mặc định chọn phiên bản biến thể đầu tiên khi vừa tải trang
        if (productData.variants && productData.variants.length > 0) {
          setSelectedVariant(productData.variants[0]);
        } else {
          setSelectedVariant(null);
        }

        // 2. Tải các sản phẩm liên quan dựa trên danh mục
        if (productData.category) {
          const { data: categoryProducts } = await axiosClient.get(`/products?category=${productData.category}`);
          // Lọc bỏ sản phẩm hiện tại và chỉ lấy 4 sản phẩm đầu tiên
          const filteredProducts = categoryProducts
            .filter(p => p._id !== productData._id)
            .slice(0, 4);
          setRelatedProducts(filteredProducts);
        }

      } catch (error) {
        console.error("Lỗi khi tải chi tiết sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductData();
  }, [id]); // Chạy lại khi ID sản phẩm thay đổi

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

  // Xử lý gửi đánh giá
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError("");
    setReviewSuccess("");

    if (rating === 0 || comment.trim() === "") {
      setReviewError("Vui lòng cho điểm và viết bình luận.");
      return;
    }

    try {
      await axiosClient.post(`/products/${id}/reviews`, { rating, comment });
      setReviewSuccess("Cảm ơn bạn đã gửi đánh giá! Đánh giá của bạn sẽ được hiển thị sau khi tải lại trang.");
      // Reset form
      setRating(0);
      setComment("");
      // Tùy chọn: có thể fetch lại product để cập nhật ngay lập tức
    } catch (error) {
      setReviewError(error.response?.data?.message || "Gửi đánh giá thất bại.");
    }
  };

  // Sắp xếp review mới nhất lên đầu
  const sortedReviews = product?.reviews ? [...product.reviews].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) : [];

  return (
    <PageLayout title={product.name}>
      <div className="container" style={{ padding: "30px 15px", background: "#f8f9fa" }}>
        
        {/* TÊN SẢN PHẨM PHÍA TRÊN CÙNG */}
        <div style={{ marginBottom: "20px", borderBottom: "1px solid #e0e0e0", paddingBottom: "15px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#333" }}>{product.name}</h1>
          <div style={{ display: "flex", alignItems: "center", gap: "15px", marginTop: "8px" }}>
            <StarRating rating={product.rating} />
            <span style={{ color: "#ff6600", fontWeight: "500" }}>{product.numReviews} đánh giá</span>
            <span style={{ fontSize: "14px", color: "#666" }}>Thương hiệu: <strong style={{ color: "#ff6600" }}>{product.brand}</strong></span>
          </div>
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

        {/* KHU VỰC ĐÁNH GIÁ VÀ BÌNH LUẬN */}
        <div style={{ background: "#fff", padding: "25px", borderRadius: "12px", border: "1px solid #e0e0e0", marginTop: "40px" }}>
          <h3 style={{ fontSize: "18px", fontWeight: "bold", borderBottom: "2px solid #ff6600", paddingBottom: "8px", marginBottom: "25px" }}>
            Khách hàng đánh giá
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "30px" }}>
            {/* Cột trái: Form viết đánh giá */}
            <div>
              <h4 style={{ fontSize: "16px", marginBottom: "15px" }}>Viết đánh giá của bạn</h4>
              {user ? (
                <form onSubmit={handleReviewSubmit}>
                  <div style={{ marginBottom: "15px" }}>
                    <label style={{ fontWeight: "500", display: "block", marginBottom: "5px" }}>Cho điểm sản phẩm</label>
                    <StarRating rating={rating} onRating={setRating} isInteractive={true} />
                  </div>
                  <div style={{ marginBottom: "15px" }}>
                    <label style={{ fontWeight: "500", display: "block", marginBottom: "5px" }}>Bình luận của bạn</label>
                    <textarea
                      rows="4"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Sản phẩm dùng rất tốt, pin trâu, màn hình đẹp..."
                      style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
                    ></textarea>
                  </div>
                  {reviewError && <p style={{ color: "red", fontSize: "14px" }}>{reviewError}</p>}
                  {reviewSuccess && <p style={{ color: "green", fontSize: "14px" }}>{reviewSuccess}</p>}
                  <button type="submit" className="btn btn-orange">Gửi đánh giá</button>
                </form>
              ) : (
                <div style={{ background: "#fff7ef", padding: "15px", borderRadius: "8px", border: "1px solid #ffd4aa" }}>
                  Vui lòng <Link to="/login" style={{ color: "#ff6600", fontWeight: "bold" }}>đăng nhập</Link> để gửi đánh giá của bạn.
                </div>
              )}
            </div>

            {/* Cột phải: Danh sách các đánh giá đã có */}
            <div style={{ maxHeight: "500px", overflowY: "auto", paddingRight: "10px" }}>
              {sortedReviews.length === 0 ? (
                <p>Chưa có đánh giá nào cho sản phẩm này.</p>
              ) : (
                sortedReviews.map((review) => (
                  <div key={review._id} style={{ borderBottom: "1px solid #eee", paddingBottom: "15px", marginBottom: "15px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                      <div style={{
                        width: "40px", height: "40px", borderRadius: "50%", background: "#ff6600", color: "#fff",
                        display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "18px"
                      }}>
                        {review.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <strong style={{ display: "block" }}>{review.name}</strong>
                        <span style={{ fontSize: "12px", color: "#888" }}>{new Date(review.createdAt).toLocaleDateString("vi-VN")}</span>
                      </div>
                    </div>
                    <div style={{ marginBottom: "8px" }}>
                      <StarRating rating={review.rating} />
                    </div>
                    <p style={{ margin: 0, fontSize: "15px", color: "#333" }}>{review.comment}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* SẢN PHẨM LIÊN QUAN */}
        {relatedProducts.length > 0 && (
          <div style={{ background: "#fff", padding: "25px", borderRadius: "12px", border: "1px solid #e0e0e0", marginTop: "40px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "bold", borderBottom: "2px solid #ff6600", paddingBottom: "8px", marginBottom: "25px" }}>
              Sản phẩm có thể bạn sẽ thích
            </h3>
            <div className="row g-4">
              {relatedProducts.map((p) => (
                <div key={p._id} className="col-12 col-md-6 col-lg-3">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </PageLayout>
  );
}

export default ProductDetailPage;