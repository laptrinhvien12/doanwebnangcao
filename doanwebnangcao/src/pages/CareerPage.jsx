import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function CareerPage() {
  return (
    <div className="page-shell">
      <Header />
      <Navbar />

      <main className="page-content container">
        <section className="page-card">
          <h1>Tuyển dụng</h1>
          <p>
            Oneway Mobile luôn tìm kiếm những người đồng hành đam mê công nghệ
            và dịch vụ khách hàng.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default CareerPage;
