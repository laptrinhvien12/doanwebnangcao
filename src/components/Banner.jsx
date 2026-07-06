function Banner() {
  return (
    <section className="container banner-section">
      <div className="row g-4">
        <div className="col-lg-6">
          <div className="banner-card primary">
            <img src="https://via.placeholder.com/600x250" alt="Banner promo" />
            <div className="banner-overlay">
              <span className="banner-tag">Flash Sale</span>
              <h3>Ưu đãi đến 30% cho sản phẩm mới</h3>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="banner-card secondary">
            <img src="https://via.placeholder.com/600x250" alt="Banner promo" />
            <div className="banner-overlay">
              <span className="banner-tag">Mua 1 tặng 1</span>
              <h3>Phụ kiện công nghệ cực chất</h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Banner;
