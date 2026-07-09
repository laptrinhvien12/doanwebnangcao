import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import { useShop } from "../context/ShopContext";
import axiosClient from "../api/axiosClient";

function AdminPage() {
  const { user } = useShop();
  
  const [activeTab, setActiveTab] = useState("dashboard");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  // Trạng thái kiểm tra xem Form đang là "Thêm mới" hay "Chỉnh sửa"
  const [isEditing, setIsEditing] = useState(false);
  const [editProductId, setEditProductId] = useState(null);

  // Cấu trúc dữ liệu Form hoàn chỉnh hỗ trợ mảng biến thể lồng nhau
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    category: "",
    basePrice: "",
    image: "",
    description: "",
    variants: [] // Mảng chứa các đối tượng biến thể độc lập
  });

  useEffect(() => {
    if (activeTab === "products") {
      fetchProducts();
    }
  }, [activeTab]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await axiosClient.get("/products");
      setProducts(data);
    } catch (error) {
      console.error("Lỗi tải sản phẩm:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- LOGIC XỬ LÝ BIẾN THỂ (VARIANTS) TRÊN FORM ---
  
  // Hàm thêm một dòng biến thể trống vào form
  const addVariantField = () => {
    setFormData({
      ...formData,
      variants: [
        ...formData.variants,
        // Đã thêm trường image: "" vào object khởi tạo
        { sku: "", color: "", ram: "", storage: "", price: "", oldPrice: "", countInStock: 0, image: "" }
      ]
    });
  };

  // Hàm xóa một dòng biến thể cụ thể theo vị trí index
  const removeVariantField = (index) => {
    const updatedVariants = formData.variants.filter((_, i) => i !== index);
    setFormData({ ...formData, variants: updatedVariants });
  };

  // Hàm cập nhật dữ liệu khi gõ vào từng ô nhập của biến thể
  const handleVariantInputChange = (index, e) => {
    const updatedVariants = [...formData.variants];
    // Chuyển đổi giá trị thành số đối với các trường liên quan đến tiền và kho hàng
    if (["price", "oldPrice", "countInStock"].includes(e.target.name)) {
      updatedVariants[index][e.target.name] = Number(e.target.value);
    } else {
      updatedVariants[index][e.target.name] = e.target.value;
    }
    setFormData({ ...formData, variants: updatedVariants });
  };

  // --- LOGIC CHỨC NĂNG SỬA (EDIT) ---
  const handleEditClick = (product) => {
    setIsEditing(true);
    setEditProductId(product._id);
    // Đổ ngược dữ liệu sản phẩm được chọn vào Form state
    setFormData({
      name: product.name,
      brand: product.brand,
      category: product.category,
      basePrice: product.basePrice,
      image: product.image,
      description: product.description,
      variants: product.variants || []
    });
    setShowForm(true); // Mở form lên
  };

  // --- LOGIC GỬI DỮ LIỆU (SUBMIT FORM: CẢ THÊM VÀ SỬA) ---
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        basePrice: Number(formData.basePrice)
      };

      if (isEditing) {
        // Nếu đang ở chế độ sửa -> Gọi API PUT
        await axiosClient.put(`/products/${editProductId}`, payload);
        alert("Cập nhật thông tin sản phẩm thành công!");
      } else {
        // Nếu đang ở chế độ thêm mới -> Gọi API POST
        await axiosClient.post("/products", payload);
        alert("Thêm sản phẩm mới thành công!");
      }

      // Đưa trạng thái form về mặc định sạch sẽ sau khi lưu thành công
      setShowForm(false);
      setIsEditing(false);
      setEditProductId(null);
      setFormData({ name: "", brand: "", category: "", basePrice: "", image: "", description: "", variants: [] });
      fetchProducts();
    } catch (error) {
      alert(error.response?.data?.message || "Không thể lưu thông tin sản phẩm.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa vĩnh viễn sản phẩm này?")) {
      try {
        await axiosClient.delete(`/products/${id}`);
        alert("Đã xóa sản phẩm khỏi kho hệ thống.");
        fetchProducts();
      } catch (error) {
        alert("Lỗi thao tác xóa thất bại.");
      }
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (!user || user.role !== "admin") {
    return (
      <PageLayout title="Quyền truy cập">
        <div style={{ textAlign: "center", padding: "50px" }}>
          <p style={{ color: "red", fontWeight: "bold" }}>⛔ Bạn cần tài khoản Admin để truy cập khu vực này.</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Hệ thống Quản trị Oneway">
      <div style={{ padding: "20px", display: "flex", gap: "20px", minHeight: "60vh" }}>
        
        {/* SIDEBAR NAVIGATION */}
        <div style={{ width: "230px", borderRight: "1px solid #ddd", paddingRight: "15px" }}>
          <h3>Danh mục quản lý</h3>
          <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
            <li>
              <button onClick={() => setActiveTab("dashboard")} style={{ width: "100%", padding: "10px", textAlign: "left", background: activeTab === "dashboard" ? "#ff6600" : "#f5f5f5", color: activeTab === "dashboard" ? "#fff" : "#333", border: "none", borderRadius: "5px", cursor: "pointer" }}>🏠 Tổng quan</button>
            </li>
            <li>
              <button onClick={() => setActiveTab("products")} style={{ width: "100%", padding: "10px", textAlign: "left", background: activeTab === "products" ? "#ff6600" : "#f5f5f5", color: activeTab === "products" ? "#fff" : "#333", border: "none", borderRadius: "5px", cursor: "pointer" }}>📱 Quản lý Sản phẩm</button>
            </li>
          </ul>
        </div>

        {/* MAIN WORKSPACE CONTENT */}
        <div style={{ flex: 1 }}>
          
          {activeTab === "dashboard" && (
            <div>
              <h2>Xin chào, {user.name} 👋</h2>
              <p>Email quản trị hệ thống: {user.email}</p>
            </div>
          )}

          {activeTab === "products" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                <h2>Kho Hàng Sản Phẩm</h2>
                <button 
                  className="btn btn-orange" 
                  onClick={() => {
                    setShowForm(!showForm);
                    if(showForm) { // Nếu đóng form thì reset luôn trạng thái Edit về mặc định
                      setIsEditing(false);
                      setFormData({ name: "", brand: "", category: "", basePrice: "", image: "", description: "", variants: [] });
                    }
                  }}
                >
                  {showForm ? "Đóng Giao Diện Form" : "+ Thêm Sản Phẩm Mới"}
                </button>
              </div>

              {/* NÂNG CẤP FORM: HỖ TRỢ ĐỒNG THỜI THÊM/SỬA VÀ THÊM BIẾN THỂ */}
              {showForm && (
                <form onSubmit={handleSubmitForm} style={{ background: "#f9f9f9", padding: "25px", borderRadius: "12px", marginBottom: "25px", border: "1px solid #e0e0e0" }}>
                  <h4 style={{ color: "#ff6600", marginBottom: "15px" }}>
                    {isEditing ? `📝 Đang chỉnh sửa sản phẩm: ${formData.name}` : "🚀 Đăng ký sản phẩm mới"}
                  </h4>
                  
                  {/* Thông tin cốt lõi của sản phẩm */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "20px" }}>
                    <input type="text" name="name" placeholder="Tên sản phẩm chính (VD: iPhone 15 Pro Max)" value={formData.name} onChange={handleInputChange} required style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }} />
                    <input type="number" name="basePrice" placeholder="Giá sàn hiển thị từ... (VD: 28990000)" value={formData.basePrice} onChange={handleInputChange} required style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }} />
                    <input type="text" name="brand" placeholder="Thương hiệu hãng sản xuất (VD: Apple)" value={formData.brand} onChange={handleInputChange} required style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }} />
                    <select name="category" value={formData.category} onChange={handleInputChange} required style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}>
                      <option value="">-- Thuộc nhóm danh mục sản phẩm --</option>
                      <option value="Smartphone">Điện thoại</option>
                      <option value="Tablet">Máy tính bảng</option>
                      <option value="Laptop">Laptop / Macbook</option>
                    </select>
                    <input type="text" name="image" placeholder="URL Đường dẫn ảnh đại diện sản phẩm" value={formData.image} onChange={handleInputChange} required style={{ gridColumn: "span 2", padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }} />
                    <textarea name="description" placeholder="Nội dung mô tả thông số nổi bật..." value={formData.description} onChange={handleInputChange} required rows="3" style={{ gridColumn: "span 2", padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }} />
                  </div>

                  {/* KHU VỰC QUẢN LÝ DANH SÁCH BIẾN THỂ */}
                  <div style={{ borderTop: "2px dashed #ddd", paddingTop: "15px", marginBottom: "20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                      <h5>Cấu hình chi tiết các biến thể (Màu sắc, Dung lượng, Giá chi tiết, Ảnh màu)</h5>
                      <button type="button" onClick={addVariantField} style={{ background: "#28a745", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}>
                        + Thêm Một Phiên Bản Biến Thể
                      </button>
                    </div>

                    {formData.variants.length === 0 ? (
                      <p style={{ color: "#888", fontStyle: "italic" }}>Sản phẩm này chưa có biến thể cấu hình nào. Hãy bấm thêm nếu muốn phân loại chi tiết giống Oneway.</p>
                    ) : (
                      formData.variants.map((variant, index) => (
                        // Đã thay đổi gridTemplateColumns để thêm 1 cột hiển thị ô nhập Ảnh (tổng 8 cột 1fr và 1 cột auto)
                        <div key={index} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr auto", gap: "10px", background: "#fff", padding: "12px", borderRadius: "8px", marginBottom: "10px", border: "1px solid #e0e0e0", alignItems: "center" }}>
                          <input type="text" name="sku" placeholder="Mã SKU" value={variant.sku} onChange={(e) => handleVariantInputChange(index, e)} required style={{ padding: "6px", borderRadius: "4px", border: "1px solid #ccc", fontSize: "13px" }} />
                          <input type="text" name="color" placeholder="Màu sắc" value={variant.color} onChange={(e) => handleVariantInputChange(index, e)} required style={{ padding: "6px", borderRadius: "4px", border: "1px solid #ccc", fontSize: "13px" }} />
                          <input type="text" name="ram" placeholder="RAM" value={variant.ram} onChange={(e) => handleVariantInputChange(index, e)} style={{ padding: "6px", borderRadius: "4px", border: "1px solid #ccc", fontSize: "13px" }} />
                          <input type="text" name="storage" placeholder="Bộ nhớ ROM" value={variant.storage} onChange={(e) => handleVariantInputChange(index, e)} required style={{ padding: "6px", borderRadius: "4px", border: "1px solid #ccc", fontSize: "13px" }} />
                          <input type="number" name="price" placeholder="Giá bán" value={variant.price} onChange={(e) => handleVariantInputChange(index, e)} required style={{ padding: "6px", borderRadius: "4px", border: "1px solid #ccc", fontSize: "13px" }} />
                          <input type="number" name="oldPrice" placeholder="Giá gốc cũ" value={variant.oldPrice} onChange={(e) => handleVariantInputChange(index, e)} style={{ padding: "6px", borderRadius: "4px", border: "1px solid #ccc", fontSize: "13px" }} />
                          <input type="number" name="countInStock" placeholder="Kho" value={variant.countInStock} onChange={(e) => handleVariantInputChange(index, e)} required style={{ padding: "6px", borderRadius: "4px", border: "1px solid #ccc", fontSize: "13px" }} />
                          {/* Đã thêm ô nhập link ảnh cho từng biến thể màu */}
                          <input type="text" name="image" placeholder="Link ảnh màu này" value={variant.image || ""} onChange={(e) => handleVariantInputChange(index, e)} style={{ padding: "6px", borderRadius: "4px", border: "1px solid #ccc", fontSize: "13px" }} />
                          
                          <button type="button" onClick={() => removeVariantField(index)} style={{ background: "#dc3545", color: "white", border: "none", padding: "6px 10px", borderRadius: "4px", cursor: "pointer" }}>✖</button>
                        </div>
                      ))
                    )}
                  </div>

                  <button type="submit" className="btn btn-orange" style={{ width: "100%", padding: "12px", fontSize: "16px" }}>
                    {isEditing ? "💾 Áp Dụng Thay Đổi & Cập Nhật" : "➕ Phát Hành Đăng Sản Phẩm"}
                  </button>
                </form>
              )}

              {/* BẢNG HIỂN THỊ DANH SÁCH HOÀN CHỈNH */}
              {loading ? <p>Hệ thống đang đồng bộ dữ liệu kho...</p> : (
                <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
                  <thead>
                    <tr style={{ background: "#ff6600", color: "#fff" }}>
                      <th style={{ padding: "12px", border: "1px solid #ddd" }}>Hình ảnh</th>
                      <th style={{ padding: "12px", border: "1px solid #ddd" }}>Tên SP</th>
                      <th style={{ padding: "12px", border: "1px solid #ddd" }}>Thương hiệu</th>
                      <th style={{ padding: "12px", border: "1px solid #ddd" }}>Giá cơ bản</th>
                      <th style={{ padding: "12px", border: "1px solid #ddd" }}>Số biến thể</th>
                      <th style={{ padding: "12px", border: "1px solid #ddd" }}>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.length === 0 ? (
                      <tr><td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>Kho hàng rỗng.</td></tr>
                    ) : (
                      products.map(product => (
                        <tr key={product._id} style={{ borderBottom: "1px solid #ddd", textAlign: "center" }}>
                          <td style={{ padding: "10px" }}><img src={product.image} alt={product.name} style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "6px" }} /></td>
                          <td style={{ padding: "10px", fontWeight: "50px" }}>{product.name}</td>
                          <td style={{ padding: "10px" }}>{product.brand}</td>
                          <td style={{ padding: "10px", color: "red", fontWeight: "bold" }}>{product.basePrice?.toLocaleString()} đ</td>
                          <td style={{ padding: "10px" }}><span style={{ background: "#eee", padding: "3px 8px", borderRadius: "10px", fontSize: "13px" }}>{product.variants?.length || 0} phiên bản</span></td>
                          <td style={{ padding: "10px" }}>
                            <button onClick={() => handleEditClick(product)} style={{ background: "#ffc107", color: "#000", border: "none", padding: "5px 12px", borderRadius: "4px", cursor: "pointer", marginRight: "8px", fontWeight: "bold" }}>Sửa</button>
                            <button onClick={() => handleDelete(product._id)} style={{ background: "#dc3545", color: "white", border: "none", padding: "5px 12px", borderRadius: "4px", cursor: "pointer" }}>Xóa</button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
          )}

        </div>
      </div>
    </PageLayout>
  );
}

export default AdminPage;