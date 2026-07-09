import Header from "./Header";
import Navbar from "./Navbar";
import Footer from "./Footer";

function PageLayout({ title, description, children }) {
  return (
    <div className="page-shell">
      <Header />
      <Navbar />

      <main className="page-content container">
        <section className="page-card">
          {title && <h1>{title}</h1>}
          {description && <p className="page-description">{description}</p>}
          {children}
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default PageLayout;
