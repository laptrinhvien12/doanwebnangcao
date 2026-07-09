import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import axiosClient from "../api/axiosClient";
import { useShop } from "../context/ShopContext"; // Import useShop để lấy setUser

function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  // Lấy hàm setUser từ Context để cập nhật trạng thái đăng nhập
  const { setUser } = useShop();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Xóa lỗi cũ trước khi gửi request

    // Kiểm tra mật khẩu nhập lại có khớp không
    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không trùng khớp!");
      return;
    }

    try {
      // 1. Gửi request POST đăng ký tài khoản xuống Backend
      const { data } = await axiosClient.post("/users/register", {
        name,
        email,
        password,
      });

      // 2. Vì Backend của chúng ta tự động trả về token ngay khi đăng ký thành công,
      // nên ta lưu luôn vào localStorage để đăng nhập thẳng cho người dùng.
      localStorage.setItem("userInfo", JSON.stringify(data));

      // Cập nhật ngay lập tức state `user` trong Context
      setUser(data);

      // 3. Điều hướng người dùng về trang chủ để mua sắm luôn
      navigate("/");

    } catch (err) {
      // 4. Hiển thị lỗi từ backend (Ví dụ: Email đã tồn tại)
      setError(
        err.response?.data?.message || "Đăng ký thất bại, vui lòng thử lại."
      );
    }
  };

  return (
    <PageLayout title="Đăng ký tài khoản" description="Tạo tài khoản mới để trải nghiệm mua sắm tốt nhất tại Oneway">
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "50px 20px",
          background: "#f5f7fb",
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{
            width: "420px",
            background: "#fff",
            padding: "35px",
            borderRadius: "18px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          }}
        >
          <h2 style={{ textAlign: "center", marginBottom: "10px" }}>
            🚀 Tạo tài khoản mới
          </h2>

          <p
            style={{
              textAlign: "center",
              color: "#666",
              marginBottom: "25px",
            }}
          >
            Đăng ký nhanh chóng chỉ trong vài thao tác
          </p>

          {/* Ô nhập Họ và Tên */}
          <div style={{ marginBottom: "15px" }}>
            <label>Họ và tên</label>
            <input
              type="text"
              placeholder="Nhập họ và tên của bạn..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "12px",
                marginTop: "5px",
                borderRadius: "8px",
                border: "1px solid #ddd",
              }}
            />
          </div>

          {/* Ô nhập Email */}
          <div style={{ marginBottom: "15px" }}>
            <label>Email</label>
            <input
              type="email"
              placeholder="Nhập địa chỉ email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "12px",
                marginTop: "5px",
                borderRadius: "8px",
                border: "1px solid #ddd",
              }}
            />
          </div>

          {/* Ô nhập Mật khẩu */}
          <div style={{ marginBottom: "15px" }}>
            <label>Mật khẩu</label>
            <div
              style={{
                display: "flex",
                border: "1px solid #ddd",
                borderRadius: "8px",
                overflow: "hidden",
                marginTop: "5px",
              }}
            >
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  flex: 1,
                  padding: "12px",
                  border: "none",
                  outline: "none",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  border: "none",
                  background: "#fff",
                  padding: "0 15px",
                  cursor: "pointer",
                }}
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          {/* Ô xác nhận lại Mật khẩu */}
          <div style={{ marginBottom: "20px" }}>
            <label>Xác nhận mật khẩu</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Nhập lại mật khẩu..."
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "12px",
                marginTop: "5px",
                borderRadius: "8px",
                border: "1px solid #ddd",
              }}
            />
          </div>

          {/* Khu vực hiển thị thông báo lỗi */}
          {error && (
            <div
              style={{
                background: "#ffe5e5",
                color: "red",
                padding: "10px",
                borderRadius: "8px",
                marginBottom: "15px",
                fontSize: "14px",
              }}
            >
              {error}
            </div>
          )}

          {/* Nút Đăng ký */}
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "13px",
              background: "#ff6600",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Đăng ký ngay
          </button>

          {/* Đường dẫn quay lại trang đăng nhập */}
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <Link
              to="/login" // Bạn có thể sửa lại thành "/dang-nhap" tùy thuộc vào cấu hình Router của bạn
              style={{
                color: "#ff6600",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              ← Đã có tài khoản? Đăng nhập
            </Link>
          </div>
        </form>
      </div>
    </PageLayout>
  );
}

export default RegisterPage;