import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useShop } from "../context/ShopContext";

function Header() {
  const [keyword, setKeyword] = useState("");
  const { user, cart, logout } = useShop();
  const navigate = useNavigate();

  const handleSearch = (event) => {
    event.preventDefault();
    if (!keyword.trim()) return;
    navigate(`/tim-kiem?q=${encodeURIComponent(keyword)}`);
  };

  return (
    <header className="top-header">
      <div className="container header-inner">
        <Link to="/" className="brand-block">
          <span className="brand-mark">📱</span>
          <div>
            <h3>Oneway Mobile</h3>
            <p>Siêu thị công nghệ cam đậm</p>
          </div>
        </Link>

        <form className="search-box" onSubmit={handleSearch}>
          <span>🔍</span>
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </form>

        <div className="header-actions">
          {user ? (
            <>
              <Link to="/tai-khoan" className="btn btn-light">
                {user.name}
              </Link>
              {user.role === "admin" && (
                <Link to="/admin" className="btn btn-outline-light">
                  Admin
                </Link>
              )}
              <button className="btn btn-dark" onClick={logout}>
                Đăng xuất
              </button>
            </>
          ) : (
            <Link to="/dang-nhap" className="btn btn-light">
              Đăng nhập
            </Link>
          )}
          <Link to="/gio-hang" className="btn btn-dark">
            Giỏ hàng ({cart.length})
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
