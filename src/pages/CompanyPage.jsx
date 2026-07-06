import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function CompanyPage() {
  return (
    <div className="page-shell">
      <Header />
      <Navbar />

      <main className="page-content container">
        <section className="page-card">
          <h1>Giới thiệu công ty</h1>
          <p>
            Oneway Mobile là đơn vị chuyên cung cấp các sản phẩm công nghệ như
            điện thoại, laptop, máy tính bảng và phụ kiện chất lượng cao.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default CompanyPage;
