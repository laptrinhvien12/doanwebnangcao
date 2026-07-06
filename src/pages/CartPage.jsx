import { Link } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import { useShop } from "../context/ShopContext";

function CartPage() {
  const { cart, removeFromCart, updateCartQty, user } = useShop();

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <PageLayout
      title="Giỏ hàng"
      description="Quản lý sản phẩm bạn đã thêm vào giỏ hàng."
    >
      {cart.length === 0 ? (
        <div className="empty-state">
          <p>Giỏ hàng của bạn đang trống.</p>
          <Link to="/dien-thoai" className="btn btn-orange">
            Tiếp tục mua sắm
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-list">
            {cart.map((item) => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} />
                <div>
                  <h5>{item.name}</h5>
                  <p>{item.price.toLocaleString()} VNĐ</p>
                  <div className="qty-row">
                    <button
                      onClick={() =>
                        updateCartQty(item.id, Math.max(1, item.qty - 1))
                      }
                    >
                      -
                    </button>
                    <span>{item.qty}</span>
                    <button
                      onClick={() => updateCartQty(item.id, item.qty + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  className="btn btn-outline-orange"
                  onClick={() => removeFromCart(item.id)}
                >
                  Xóa
                </button>
              </div>
            ))}
          </div>
          <div className="summary-card">
            <h4>Tổng tiền</h4>
            <p>{total.toLocaleString()} VNĐ</p>
            {user ? (
              <Link to="/dat-hang" className="btn btn-orange w-100">
                Đặt hàng
              </Link>
            ) : (
              <Link to="/dang-nhap" className="btn btn-orange w-100">
                Đăng nhập để đặt hàng
              </Link>
            )}
          </div>
        </div>
      )}
    </PageLayout>
  );
}

export default CartPage;
