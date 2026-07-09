import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import { useShop } from "../context/ShopContext";

function CheckoutPage() {
  const { user, cart, placeOrder } = useShop();
  const navigate = useNavigate();
  const [form, setForm] = useState({ address: "", phone: "", payment: "COD" });

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!user || cart.length === 0) return;
    const ok = placeOrder(form);
    if (ok) {
      navigate("/tai-khoan");
    }
  };

  return (
    <PageLayout
      title="Đặt hàng"
      description="Nhập thông tin nhận hàng và xác nhận đơn hàng."
    >
      <form className="auth-card" onSubmit={handleSubmit}>
        <label>
          Địa chỉ nhận hàng
          <input
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            required
          />
        </label>
        <label>
          Số điện thoại
          <input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            required
          />
        </label>
        <label>
          Phương thức thanh toán
          <select
            value={form.payment}
            onChange={(e) => setForm({ ...form, payment: e.target.value })}
          >
            <option value="COD">Thanh toán khi nhận hàng</option>
            <option value="Bank">Chuyển khoản</option>
            <option value="Card">Thẻ</option>
          </select>
        </label>
        <button className="btn btn-orange" type="submit">
          Xác nhận đơn hàng
        </button>
      </form>
    </PageLayout>
  );
}

export default CheckoutPage;
