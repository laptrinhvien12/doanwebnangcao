import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="row g-4 align-items-start">
          <div className="col-lg-4">
            <div className="footer-brand">
              <h4>Oneway Mobile</h4>
              <p>
                Nơi mang đến trải nghiệm mua sắm công nghệ hiện đại, uy tín và
                tiện lợi cho mọi gia đình.
              </p>
              <div className="footer-badges">
                <span>⚡ Giao hàng nhanh</span>
                <span>🛡️ Bảo hành rõ ràng</span>
              </div>
            </div>
          </div>

          <div className="col-lg-2 col-md-6">
            <h4>Về Oneway</h4>
            <ul>
              <li>
                <Link to="/gioi-thieu">Giới thiệu công ty</Link>
              </li>
              <li>
                <Link to="/he-thong-cua-hang">Hệ thống cửa hàng</Link>
              </li>
              <li>
                <Link to="/lien-he">Liên hệ với chúng tôi</Link>
              </li>
              <li>
                <Link to="/tuyen-dung">Tuyển dụng</Link>
              </li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-6">
            <h4>Sản phẩm</h4>
            <ul>
              <li>
                <Link to="/dien-thoai">Điện thoại</Link>
              </li>
              <li>
                <Link to="/macbook">Macbook</Link>
              </li>
              <li>
                <Link to="/may-tinh-bang">Máy tính bảng</Link>
              </li>
              <li>
                <Link to="/dong-ho-thong-minh">Đồng hồ thông minh</Link>
              </li>
              <li>
                <Link to="/nha-thong-minh">Nhà thông minh</Link>
              </li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-6">
            <h4>Chính sách</h4>
            <ul>
              <li>
                <a
                  href="https://onewaymobile.vn/chinh-sach-mua-hang"
                  target="_blank"
                  rel="noreferrer"
                >
                  Chính sách mua hàng
                </a>
              </li>
              <li>
                <a
                  href="https://onewaymobile.vn/chinh-sach-bao-hanh"
                  target="_blank"
                  rel="noreferrer"
                >
                  Chính sách bảo hành
                </a>
              </li>
              <li>
                <a
                  href="https://onewaymobile.vn/chinh-sach-van-chuyen"
                  target="_blank"
                  rel="noreferrer"
                >
                  Chính sách vận chuyển
                </a>
              </li>
              <li>
                <a
                  href="https://onewaymobile.vn/chinh-sach-bao-mat"
                  target="_blank"
                  rel="noreferrer"
                >
                  Chính sách bảo mật
                </a>
              </li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-6">
            <h4>Hỗ trợ khách hàng</h4>
            <ul>
              <li>
                <a
                  href="https://onewaymobile.vn/cau-hoi-thuong-gap-khi-mua-hang-online"
                  target="_blank"
                  rel="noreferrer"
                >
                  Giải đáp mua hàng Online
                </a>
              </li>
              <li>
                <a
                  href="https://onewaymobile.vn/phuong-thuc-thanh-toan"
                  target="_blank"
                  rel="noreferrer"
                >
                  Phương thức thanh toán
                </a>
              </li>
              <li>
                <a
                  href="https://onewaymobile.vn/cau-hoi-thuong-gap-khi-mua-hang-online"
                  target="_blank"
                  rel="noreferrer"
                >
                  Câu hỏi thường gặp
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-contact mt-4">
          <h4>Tổng đài hỗ trợ (8h30 - 22h)</h4>
          <p>
            <a href="tel:02466819779">Gọi tư vấn: 0246 6819 779 (Phím 1)</a>
          </p>
          <p>
            <a href="tel:02466819779">
              Hỗ trợ kỹ thuật: 0246 6819 779 (Phím 2)
            </a>
          </p>
          <p>
            <a href="tel:02466819779">CSKH: 024 66819 779 (Phím 3)</a>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
