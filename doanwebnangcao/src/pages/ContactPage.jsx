import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function ContactPage() {
  return (
    <div className="page-shell">
      <Header />
      <Navbar />

      <main className="page-content container">
        <section className="page-card">
          <h1>Liên hệ với chúng tôi</h1>
          <p>
            Đội ngũ Oneway Mobile luôn sẵn sàng hỗ trợ bạn qua hotline, email và
            hệ thống cửa hàng.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default ContactPage;
