import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import { useShop } from "../context/ShopContext";

function AccountPage() {
  const { user, orders, logout } = useShop();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("history"); // 'profile' or 'history'

  const handleLogout = () => {
    logout();
    navigate("/"); // Đăng xuất xong thì về trang chủ
  };

  if (!user) {
    return (
      <PageLayout
        title="Tài khoản"
        description="Đăng nhập để xem thông tin cá nhân và lịch sử mua hàng."
      >
        <p>Vui lòng đăng nhập trước.</p>
      </PageLayout>
    );
  }

  // --- BỘ STYLE CHO GIAO DIỆN MỚI ---
  const styles = {
    container: {
      display: "flex",
      gap: "30px",
      alignItems: "flex-start",
      padding: "20px 0",
      maxWidth: "1200px",
      margin: "0 auto",
    },
    sidebar: {
      width: "280px",
      background: "#fff",
      borderRadius: "12px",
      border: "1px solid #e0e0e0",
      padding: "20px",
      textAlign: "center",
      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    },
    avatar: {
      width: "80px",
      height: "80px",
      borderRadius: "50%",
      background: "#ff6600",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "32px",
      fontWeight: "bold",
      margin: "0 auto 15px",
    },
    userName: {
      fontSize: "18px",
      fontWeight: "bold",
      marginBottom: "5px",
    },
    userEmail: {
      fontSize: "14px",
      color: "#666",
      marginBottom: "25px",
      wordBreak: "break-all",
    },
    navList: {
      listStyle: "none",
      padding: 0,
      margin: 0,
      textAlign: "left",
    },
    navItem: (isActive) => ({
      padding: "12px 15px",
      marginBottom: "8px",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "500",
      background: isActive ? "#fff0e6" : "transparent",
      color: isActive ? "#ff6600" : "#333",
      transition: "all 0.2s ease",
    }),
    content: {
      flex: 1,
    },
    card: {
      background: "#fff",
      borderRadius: "12px",
      border: "1px solid #e0e0e0",
      padding: "25px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    },
    cardHeader: {
      borderBottom: "1px solid #eee",
      paddingBottom: "15px",
      marginBottom: "20px",
      fontSize: "20px",
      fontWeight: "600",
    },
    // Order item styles
    orderItem: {
      border: "1px solid #eee",
      borderRadius: "10px",
      padding: "20px",
      marginBottom: "15px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      transition: "transform 0.2s ease, box-shadow 0.2s ease",
    },
    orderHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottom: "1px dashed #ddd",
      paddingBottom: "10px",
      marginBottom: "15px",
    },
    orderId: {
      fontWeight: "bold",
      fontSize: "16px",
    },
    orderDate: {
      fontSize: "13px",
      color: "#666",
    },
    orderBody: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    orderStatus: (status) => {
      let color = "#ff6600"; // Đang xử lý
      if (status === "Hoàn thành") color = "#28a745";
      if (status === "Đã hủy") color = "#dc3545";
      if (status === "Chờ thanh toán") color = "#ffc107";
      return {
        fontWeight: "bold",
        color: color,
      };
    },
    orderTotal: {
      fontWeight: "bold",
      color: "#d70018",
      fontSize: "18px",
    },
    // Profile info styles
    infoRow: {
      display: "flex",
      justifyContent: "space-between",
      padding: "15px 0",
      borderBottom: "1px solid #f0f0f0",
      fontSize: "15px",
    },
  };

  return (
    <PageLayout
      title="Tài khoản của tôi"
      description="Quản lý thông tin cá nhân và xem lại các đơn hàng đã đặt."
    >
      <div style={styles.container}>
        {/* --- SIDEBAR --- */}
        <div style={styles.sidebar}>
          <div style={styles.avatar}>{user.name.charAt(0).toUpperCase()}</div>
          <h4 style={styles.userName}>{user.name}</h4>
          <p style={styles.userEmail}>{user.email}</p>
          <ul style={styles.navList}>
            <li style={styles.navItem(activeTab === "profile")} onClick={() => setActiveTab("profile")}>
              Thông tin tài khoản
            </li>
            <li style={styles.navItem(activeTab === "history")} onClick={() => setActiveTab("history")}>
              Lịch sử mua hàng
            </li>
            <li style={styles.navItem(false)} onClick={handleLogout}>
              Đăng xuất
            </li>
          </ul>
        </div>

        {/* --- MAIN CONTENT --- */}
        <div style={styles.content}>
          {activeTab === "profile" && (
            <div style={styles.card}>
              <h3 style={styles.cardHeader}>Thông tin cá nhân</h3>
              <div style={styles.infoRow}>
                <span>Họ và tên:</span>
                <strong>{user.name}</strong>
              </div>
              <div style={styles.infoRow}>
                <span>Email:</span>
                <strong>{user.email}</strong>
              </div>
              <div style={{ ...styles.infoRow, borderBottom: "none" }}>
                <span>Vai trò:</span>
                <strong>{user.role === "admin" ? "Quản trị viên" : "Khách hàng"}</strong>
              </div>
            </div>
          )}

          {activeTab === "history" && (
            <div style={styles.card}>
              <h3 style={styles.cardHeader}>Lịch sử mua hàng</h3>
              {orders.length === 0 ? (
                <p>Bạn chưa có đơn hàng nào.</p>
              ) : (
                orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((order) => (
                  <div key={order._id} style={styles.orderItem}>
                    <div style={styles.orderHeader}>
                      <span style={styles.orderId}>Đơn hàng #{order._id.slice(-6).toUpperCase()}</span>
                      <span style={styles.orderDate}>Ngày đặt: {new Date(order.createdAt).toLocaleDateString("vi-VN")}</span>
                    </div>
                    <div style={styles.orderBody}>
                      <div>
                        <p style={{ margin: "0 0 8px 0" }}>
                          Trạng thái: <span style={styles.orderStatus(order.status)}>{order.status}</span>
                        </p>
                        <p style={{ margin: 0, fontSize: "14px", color: "#555" }}>
                          Thanh toán: {order.isPaid ? "Đã thanh toán" : "Chờ thanh toán"}
                        </p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#555" }}>Tổng tiền</p>
                        <p style={styles.orderTotal}>{order.totalPrice.toLocaleString()} VNĐ</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}

export default AccountPage;
