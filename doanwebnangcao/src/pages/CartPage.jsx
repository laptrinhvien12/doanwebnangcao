import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import { useShop } from "../context/ShopContext";

function CartPage() {
  const { cart, removeFromCart, updateCartQty, user } = useShop();
  const navigate = useNavigate();

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleProceedToCheckout = () => {
    if (!user) {
      alert("Vui lòng đăng nhập để tiến hành thanh toán!");
      navigate("/dang-nhap");
      return;
    }
    // Chuyển hướng sang trang thanh toán
    navigate("/thanh-toan");
  };

  if (cart.length === 0) {
    return (
      <PageLayout title="Giỏ hàng">
        <div style={{ textAlign: "center", padding: "80px 20px", minHeight: "50vh" }}>
          <h2 style={{ color: "#666" }}>🛒 Giỏ hàng của bạn đang trống</h2>
          <p>Hãy chọn thêm sản phẩm để tiến hành đặt hàng nhé.</p>
          <Link to="/" className="btn btn-orange mt-3">Quay lại trang chủ</Link>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Giỏ hàng">
      <div className="container" style={{ padding: "40px 15px", display: "grid", gridTemplateColumns: "2fr 1fr", gap: "30px", alignItems: "start" }}>
        
        {/* CỘT TRÁI: BẢNG SẢN PHẨM (GIỐNG ẢNH MẪU) */}
        <div style={{ background: "#fff", borderRadius: "12px", padding: "20px", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
          
          {/* Tiêu đề các cột */}
          <div style={{ display: "grid", gridTemplateColumns: "50px 100px 2fr 1.5fr 1fr 1.5fr", gap: "10px", paddingBottom: "15px", borderBottom: "1px solid #f0f0f0", fontWeight: "bold", textAlign: "center", color: "#333", fontSize: "14px" }}>
            <div></div> {/* Cột trống cho icon xóa */}
            <div style={{ textAlign: "left" }}>Sản phẩm</div>
            <div></div> {/* Cột phụ để tên giãn ra */}
            <div>Giá</div>
            <div>Số lượng</div>
            <div style={{ textAlign: "right" }}>Tạm tính</div>
          </div>

          {/* Danh sách Item */}
          {cart.map((item) => (
            <div key={item.id + item.variantName} style={{ display: "grid", gridTemplateColumns: "50px 100px 2fr 1.5fr 1fr 1.5fr", gap: "10px", padding: "20px 0", borderBottom: "1px solid #f0f0f0", alignItems: "center", textAlign: "center" }}>
              
              {/* Nút Xóa (Thùng rác) */}
              <div style={{ cursor: "pointer", color: "#888", fontSize: "18px" }} onClick={() => removeFromCart(item.id)}>
                🗑️
              </div>

              {/* Ảnh sản phẩm */}
              <div style={{ border: "1px solid #eee", borderRadius: "8px", padding: "5px", background: "#fff" }}>
                <img src={item.image} alt={item.name} style={{ width: "100%", height: "80px", objectFit: "contain" }} />
              </div>

              {/* Tên & Phân loại */}
              <div style={{ textAlign: "left", paddingLeft: "10px" }}>
                <Link to={`/product/${item.id}`} style={{ fontWeight: "600", color: "#333", textDecoration: "none", fontSize: "14px", display: "block", marginBottom: "5px" }}>
                  {item.name} - {item.variantName}
                </Link>
                <div style={{ color: "#ff6600", fontSize: "13px", fontWeight: "bold" }}>
                  1 x {item.price?.toLocaleString()} VNĐ
                </div>
              </div>

              {/* Đơn giá */}
              <div style={{ fontWeight: "bold", fontSize: "15px" }}>
                {item.price?.toLocaleString()} VNĐ
              </div>

              {/* Nút tăng giảm số lượng (Thiết kế bo tròn pill) */}
              <div style={{ display: "flex", justifyContent: "center" }}>
                <div style={{ display: "flex", border: "1px solid #ddd", borderRadius: "20px", overflow: "hidden", width: "90px", height: "35px" }}>
                  <button onClick={() => updateCartQty(item.id, Math.max(1, item.qty - 1))} style={{ flex: 1, background: "#fff", border: "none", cursor: "pointer", fontSize: "16px", color: "#555" }}>-</button>
                  <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", fontSize: "14px", fontWeight: "500", borderLeft: "1px solid #ddd", borderRight: "1px solid #ddd" }}>{item.qty}</div>
                  <button onClick={() => updateCartQty(item.id, item.qty + 1)} style={{ flex: 1, background: "#fff", border: "none", cursor: "pointer", fontSize: "16px", color: "#555" }}>+</button>
                </div>
              </div>

              {/* Thành tiền */}
              <div style={{ textAlign: "right", fontWeight: "bold", fontSize: "15px" }}>
                {(item.price * item.qty).toLocaleString()} VNĐ
              </div>

            </div>
          ))}

          {/* Nút tiếp tục mua hàng */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
            <Link to="/" style={{ display: "inline-block", background: "#ff8c00", color: "#fff", textDecoration: "none", padding: "10px 20px", borderRadius: "25px", fontWeight: "bold", fontSize: "14px" }}>
              ← Tiếp tục xem sản phẩm
            </Link>
          </div>
        </div>

        {/* CỘT PHẢI: KHỐI THANH TOÁN */}
        <div style={{ background: "#f8f9fa", borderRadius: "12px", padding: "25px", border: "1px solid #eee" }}>
          <h3 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "20px", color: "#333" }}>Thanh toán</h3>
          
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px", fontSize: "15px" }}>
            <span style={{ color: "#555" }}>Tạm tính</span>
            <span style={{ fontWeight: "600" }}>{totalPrice.toLocaleString()} VNĐ</span>
          </div>
          
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px", fontSize: "15px" }}>
            <span style={{ color: "#555" }}>Giảm</span>
            <span style={{ fontWeight: "600" }}>0 VNĐ</span>
          </div>
          
          <div style={{ display: "flex", justifyContent: "space-between", margin: "20px 0", fontSize: "16px", fontWeight: "bold", borderTop: "1px solid #ddd", paddingTop: "20px" }}>
            <span>Tổng cộng</span>
            <span style={{ color: "#d70018", fontSize: "18px" }}>{totalPrice.toLocaleString()} VNĐ</span>
          </div>

          {/* Input Mã Khuyến Mãi */}
          <div style={{ display: "flex", marginTop: "20px", marginBottom: "25px", border: "1px solid #ddd", borderRadius: "8px", overflow: "hidden" }}>
            <input type="text" placeholder="Mã khuyến mãi" style={{ flex: 1, padding: "12px 15px", border: "none", outline: "none", fontSize: "14px" }} />
            <button style={{ background: "#ff6600", color: "#fff", border: "none", padding: "0 20px", fontWeight: "bold", cursor: "pointer" }}>Áp dụng</button>
          </div>

          <button onClick={handleProceedToCheckout} style={{ width: "100%", background: "#ff8c00", color: "#fff", border: "none", padding: "15px", borderRadius: "25px", fontWeight: "bold", fontSize: "15px", cursor: "pointer", transition: "0.2s" }}>
            Tiến hành thanh toán
          </button>
        </div>

      </div>
    </PageLayout>
  );
}

export default CartPage;