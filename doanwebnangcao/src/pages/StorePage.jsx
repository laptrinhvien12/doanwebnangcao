import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function StorePage() {
  return (
    <div className="page-shell">
      <Header />
      <Navbar />

      <main className="page-content container">
        <section className="page-card">
          <h1>Hệ thống cửa hàng</h1>
          <p>
            Hệ thống cửa hàng Oneway Mobile phủ sóng nhiều khu vực tại Hà Nội và
            các tỉnh lân cận.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default StorePage;
