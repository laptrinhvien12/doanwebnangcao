import { Link } from "react-router-dom";

function Navbar() {
  const categories = [
    {
      label: "📱 Điện thoại",
      to: "/dien-thoai",
      items: [
        { label: "iPhone", to: "/dien-thoai" },
        { label: "Samsung", to: "/dien-thoai" },
        { label: "Xiaomi", to: "/dien-thoai" },
      ],
    },
    {
      label: "💻 Laptop",
      to: "/macbook",
      items: [
        { label: "MacBook", to: "/macbook" },
        { label: "Laptop gaming", to: "/macbook" },
      ],
    },
    {
      label: "🖥️ Máy cũ",
      to: "/may-cu",
      items: [
        { label: "Máy cũ giá tốt", to: "/may-cu" },
        { label: "Máy cũ chất lượng", to: "/may-cu" },
      ],
    },
    {
      label: "📋 Máy tính bảng",
      to: "/may-tinh-bang",
      items: [
        { label: "iPad", to: "/may-tinh-bang" },
        { label: "Tablet học tập", to: "/may-tinh-bang" },
      ],
    },
    {
      label: "⌚ Smart device",
      to: "/dong-ho-thong-minh",
      items: [
        { label: "Đồng hồ thông minh", to: "/dong-ho-thong-minh" },
        { label: "Tai nghe", to: "/phu-kien" },
      ],
    },
    {
      label: "🏠 Nhà thông minh",
      to: "/nha-thong-minh",
      items: [
        { label: "Camera thông minh", to: "/nha-thong-minh" },
        { label: "Thiết bị tự động", to: "/nha-thong-minh" },
      ],
    },
    {
      label: "🎧 Phụ kiện",
      to: "/phu-kien",
      items: [
        { label: "Sạc nhanh", to: "/phu-kien" },
        { label: "Ốp lưng", to: "/phu-kien" },
      ],
    },
    {
      label: "🔊 Âm thanh",
      to: "/am-thanh",
      items: [
        { label: "Loa Bluetooth", to: "/am-thanh" },
        { label: "Tai nghe", to: "/am-thanh" },
      ],
    },
  ];

  return (
    <nav className="navbar-custom">
      <div className="container navbar-inner">
        {categories.map((category) => (
          <div key={category.label} className="nav-dropdown">
            <Link to={category.to} className="nav-pill nav-trigger">
              <span>{category.label}</span>
              <span>▾</span>
            </Link>

            <div className="nav-dropdown-menu">
              {category.items.map((item) => (
                <Link
                  key={item.to + item.label}
                  to={item.to}
                  className="dropdown-link"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </nav>
  );
}

export default Navbar;
