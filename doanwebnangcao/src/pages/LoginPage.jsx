import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import { useShop } from "../context/ShopContext"; 
import axiosClient from "../api/axiosClient"; // Nhập cấu hình axios đã tạo

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  // Nếu trong ShopContext bạn có hàm để cập nhật global state (ví dụ setUser), bạn có thể lấy ra ở đây
  // const { setUser } = useShop(); 

  // Đổi thành async function để làm việc với API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Xóa lỗi cũ (nếu có) trước khi gửi request mới

    try {
      // 1. Gửi request POST xuống Backend
      const { data } = await axiosClient.post("/users/login", {
        email,
        password,
      });

      // 2. Lưu chuỗi Token và thông tin user vào localStorage để duy trì đăng nhập
      localStorage.setItem("userInfo", JSON.stringify(data));

      // (Tùy chọn) Cập nhật state global nếu bạn đang dùng Context
      // if (setUser) setUser(data);

      // 3. Phân quyền điều hướng: Admin vào trang quản trị, User về trang chủ
      if (data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }

    } catch (err) {
      // 4. Bắt lỗi trả về từ Backend (Mã 401: Sai email hoặc mật khẩu)
      setError(
        err.response?.data?.message || "Đăng nhập thất bại, vui lòng thử lại."
      );
    }
  };

  return (
    <PageLayout>
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
            👋 Chào mừng trở lại
          </h2>

          <p
            style={{
              textAlign: "center",
              color: "#666",
              marginBottom: "25px",
            }}
          >
            Đăng nhập để tiếp tục mua sắm
          </p>

          <div style={{ marginBottom: "15px" }}>
            <label>Email</label>
            <input
              type="email"
              placeholder="Nhập email..."
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

          {error && (
            <div
              style={{
                background: "#ffe5e5",
                color: "red",
                padding: "10px",
                borderRadius: "8px",
                marginBottom: "15px",
              }}
            >
              {error}
            </div>
          )}

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
            }}
          >
            Đăng nhập
          </button>

          {/* Phần gợi ý tài khoản này bạn có thể ẩn đi khi đem lên production thực tế nhé */}
          <div
            style={{
              marginTop: "20px",
              padding: "12px",
              background: "#fff7ef",
              border: "1px solid #ffd4aa",
              borderRadius: "8px",
              fontSize: "14px",
            }}
          >
            <strong>Tài khoản Demo</strong>
            <p style={{ marginTop: "8px" }}>
              Admin: admin@gmail.com / adminpassword
            </p>
            <p>User: vana@gmail.com / password123</p>
          </div>

          <div style={{ textAlign: "center", marginTop: "18px" }}>
            <Link
              to="/dang-ky"
              style={{
                color: "#ff6600",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              Chưa có tài khoản? Đăng ký ngay →
            </Link>
          </div>
        </form>
      </div>
    </PageLayout>
  );
}

export default LoginPage;