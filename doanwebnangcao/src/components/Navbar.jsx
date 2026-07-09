import { Link } from "react-router-dom";

function Navbar() {
  // Cấu trúc lại danh mục để khớp 100% với trường "category" và "brand" trong MongoDB
  const categories = [
    {
      label: "📱 Điện thoại",
      to: "/danh-muc/Smartphone",
      items: [
        { label: "iPhone", to: "/danh-muc/Smartphone?brand=Apple" },
        { label: "Samsung", to: "/danh-muc/Smartphone?brand=Samsung" },
        { label: "Xiaomi", to: "/danh-muc/Smartphone?brand=Xiaomi" },
      ],
    },
    {
      label: "💻 Laptop",
      to: "/danh-muc/Laptop",
      items: [
        { label: "MacBook", to: "/danh-muc/Laptop?brand=Apple" },
        { label: "Laptop Gaming", to: "/danh-muc/Laptop" },
      ],
    },
    {
      label: "🖥️ Máy cũ",
      to: "/danh-muc/Used",
      items: [
        { label: "Máy cũ giá tốt", to: "/danh-muc/Used" },
        { label: "Máy cũ chất lượng", to: "/danh-muc/Used" },
      ],
    },
    {
      label: "📋 Máy tính bảng",
      to: "/danh-muc/Tablet",
      items: [
        { label: "iPad", to: "/danh-muc/Tablet?brand=Apple" },
        { label: "Tablet học tập", to: "/danh-muc/Tablet" },
      ],
    },
    {
      label: "⌚ Smart device",
      to: "/danh-muc/SmartDevice",
      items: [
        { label: "Đồng hồ thông minh", to: "/danh-muc/SmartDevice" },
        { label: "Tai nghe", to: "/danh-muc/Audio" },
      ],
    },
    {
      label: "🏠 Nhà thông minh",
      to: "/danh-muc/SmartHome",
      items: [
        { label: "Camera thông minh", to: "/danh-muc/SmartHome" },
        { label: "Thiết bị tự động", to: "/danh-muc/SmartHome" },
      ],
    },
    {
      label: "🎧 Phụ kiện",
      to: "/danh-muc/Accessory",
      items: [
        { label: "Sạc nhanh", to: "/danh-muc/Accessory" },
        { label: "Ốp lưng", to: "/danh-muc/Accessory" },
      ],
    },
    {
      label: "🔊 Âm thanh",
      to: "/danh-muc/Audio",
      items: [
        { label: "Loa Bluetooth", to: "/danh-muc/Audio" },
        { label: "Tai nghe", to: "/danh-muc/Audio" },
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