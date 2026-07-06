import { useState } from "react";
import PageLayout from "../components/PageLayout";
import { useShop } from "../context/ShopContext";

function AdminPage() {
  const {
    user,
    products,
    categories,
    banners,
    orders,
    users,
    addProduct,
    deleteProduct,
    addCategory,
    deleteCategory,
    addBanner,
    deleteBanner,
    toggleUserLock,
    updateOrderStatus,
  } = useShop();
  const [productForm, setProductForm] = useState({
    name: "",
    price: "",
    brand: "",
    category: "",
    image: "",
    description: "",
    ram: "",
    storage: "",
  });
  const [categoryForm, setCategoryForm] = useState("");
  const [bannerForm, setBannerForm] = useState({
    title: "",
    subtitle: "",
    image: "",
  });

  if (!user || user.role !== "admin") {
    return (
      <PageLayout
        title="Trang quản trị"
        description="Chỉ admin mới có quyền truy cập."
      >
        <p>Bạn cần đăng nhập bằng tài khoản admin.</p>
      </PageLayout>
    );
  }

  const handleProductSubmit = (event) => {
    event.preventDefault();
    addProduct({
      ...productForm,
      category: productForm.category || "phones",
      image: productForm.image || "https://via.placeholder.com/240x260",
      id: Date.now(),
    });
    setProductForm({
      name: "",
      price: "",
      brand: "",
      category: "",
      image: "",
      description: "",
      ram: "",
      storage: "",
    });
  };

  const handleCategorySubmit = (event) => {
    event.preventDefault();
    addCategory(categoryForm);
    setCategoryForm("");
  };

  const handleBannerSubmit = (event) => {
    event.preventDefault();
    addBanner(bannerForm);
    setBannerForm({ title: "", subtitle: "", image: "" });
  };

  return (
    <PageLayout
      title="Trang quản trị"
      description="Quản lý sản phẩm, danh mục, đơn hàng, người dùng và banner."
    >
      <div className="admin-grid">
        <section className="admin-card">
          <h3>Quản lý sản phẩm</h3>
          <form onSubmit={handleProductSubmit} className="stacked-form">
            <input
              placeholder="Tên sản phẩm"
              value={productForm.name}
              onChange={(e) =>
                setProductForm({ ...productForm, name: e.target.value })
              }
              required
            />
            <input
              placeholder="Giá"
              value={productForm.price}
              onChange={(e) =>
                setProductForm({ ...productForm, price: e.target.value })
              }
              required
            />
            <input
              placeholder="Hãng"
              value={productForm.brand}
              onChange={(e) =>
                setProductForm({ ...productForm, brand: e.target.value })
              }
              required
            />
            <input
              placeholder="Danh mục"
              value={productForm.category}
              onChange={(e) =>
                setProductForm({ ...productForm, category: e.target.value })
              }
            />
            <input
              placeholder="Đường dẫn ảnh"
              value={productForm.image}
              onChange={(e) =>
                setProductForm({ ...productForm, image: e.target.value })
              }
            />
            <input
              placeholder="RAM"
              value={productForm.ram}
              onChange={(e) =>
                setProductForm({ ...productForm, ram: e.target.value })
              }
            />
            <input
              placeholder="Bộ nhớ"
              value={productForm.storage}
              onChange={(e) =>
                setProductForm({ ...productForm, storage: e.target.value })
              }
            />
            <textarea
              placeholder="Mô tả"
              value={productForm.description}
              onChange={(e) =>
                setProductForm({ ...productForm, description: e.target.value })
              }
            />
            <button className="btn btn-orange" type="submit">
              Thêm sản phẩm
            </button>
          </form>
          <ul className="admin-list">
            {products.map((product) => (
              <li key={product.id}>
                <span>
                  {product.name} - {product.price.toLocaleString()} VNĐ
                </span>
                <button
                  className="btn btn-outline-orange"
                  onClick={() => deleteProduct(product.id)}
                >
                  Xóa
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="admin-card">
          <h3>Quản lý danh mục</h3>
          <form onSubmit={handleCategorySubmit} className="stacked-form">
            <input
              placeholder="Tên hãng"
              value={categoryForm}
              onChange={(e) => setCategoryForm(e.target.value)}
              required
            />
            <button className="btn btn-orange" type="submit">
              Thêm hãng
            </button>
          </form>
          <ul className="admin-list">
            {categories.map((category) => (
              <li key={category.id}>
                <span>{category.name}</span>
                <button
                  className="btn btn-outline-orange"
                  onClick={() => deleteCategory(category.id)}
                >
                  Xóa
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="admin-card">
          <h3>Quản lý đơn hàng</h3>
          <ul className="admin-list">
            {orders.map((order) => (
              <li key={order.id}>
                <span>
                  {order.customer} - {order.status}
                </span>
                <button
                  className="btn btn-outline-orange"
                  onClick={() => updateOrderStatus(order.id, "Đang giao")}
                >
                  Xác nhận
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="admin-card">
          <h3>Quản lý người dùng</h3>
          <ul className="admin-list">
            {users.map((userItem) => (
              <li key={userItem.id}>
                <span>
                  {userItem.name} - {userItem.locked ? "Bị khóa" : "Hoạt động"}
                </span>
                <button
                  className="btn btn-outline-orange"
                  onClick={() => toggleUserLock(userItem.id)}
                >
                  {userItem.locked ? "Mở khóa" : "Khóa"}
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="admin-card">
          <h3>Quản lý banner</h3>
          <form onSubmit={handleBannerSubmit} className="stacked-form">
            <input
              placeholder="Tiêu đề"
              value={bannerForm.title}
              onChange={(e) =>
                setBannerForm({ ...bannerForm, title: e.target.value })
              }
              required
            />
            <input
              placeholder="Phụ đề"
              value={bannerForm.subtitle}
              onChange={(e) =>
                setBannerForm({ ...bannerForm, subtitle: e.target.value })
              }
            />
            <input
              placeholder="Đường dẫn ảnh"
              value={bannerForm.image}
              onChange={(e) =>
                setBannerForm({ ...bannerForm, image: e.target.value })
              }
            />
            <button className="btn btn-orange" type="submit">
              Thêm banner
            </button>
          </form>
          <ul className="admin-list">
            {banners.map((banner) => (
              <li key={banner.id}>
                <span>{banner.title}</span>
                <button
                  className="btn btn-outline-orange"
                  onClick={() => deleteBanner(banner.id)}
                >
                  Xóa
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </PageLayout>
  );
}

export default AdminPage;
