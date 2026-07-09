import PageLayout from "../components/PageLayout";
import { useShop } from "../context/ShopContext";

function AccountPage() {
  const { user, orders } = useShop();

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

  return (
    <PageLayout
      title="Tài khoản cá nhân"
      description="Xem thông tin, đổi mật khẩu và lịch sử đặt hàng."
    >
      <div className="account-grid">
        <div className="info-card">
          <h3>Thông tin cá nhân</h3>
          <p>
            <strong>Tên:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Vai trò:</strong> {user.role}
          </p>
        </div>
        <div className="info-card">
          <h3>Lịch sử mua hàng</h3>
          {orders.length === 0 ? (
            <p>Chưa có đơn hàng nào.</p>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="order-item">
                <p>
                  <strong>Đơn #{order.id}</strong>
                </p>
                <p>Trạng thái: {order.status}</p>
                <p>Tổng: {order.total.toLocaleString()} VNĐ</p>
              </div>
            ))
          )}
        </div>
      </div>
    </PageLayout>
  );
}

export default AccountPage;
