import { createContext, useContext, useMemo, useState, useEffect } from "react";
import productsData from "../data/products";
import axiosClient from "../api/axiosClient"; // Import axiosClient để gọi API đặt hàng

const ShopContext = createContext();

const initialCategories = [
  { id: 1, name: "Apple" },
  { id: 2, name: "Samsung" },
  { id: 3, name: "Xiaomi" },
  { id: 4, name: "Nokia" },
  { id: 5, name: "JBL" },
  { id: 6, name: "Aqara" },
  { id: 7, name: "Anker" },
];

const initialBanners = [
  {
    id: 1,
    title: "Flash Sale tháng này",
    subtitle: "Giảm đến 30% cho các mẫu flagship",
    image: "https://via.placeholder.com/600x250",
  },
  {
    id: 2,
    title: "Phụ kiện công nghệ",
    subtitle: "Mua sắm tiện lợi với giá tốt nhất",
    image: "https://via.placeholder.com/600x250",
  },
];

export function ShopProvider({ children }) {
  const [products, setProducts] = useState(productsData);
  const [categories, setCategories] = useState(initialCategories);
  const [banners, setBanners] = useState(initialBanners);
  const [orders, setOrders] = useState([]);
  
  // Khởi tạo state user đồng bộ từ localStorage
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("userInfo");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // 1. Khởi tạo Giỏ hàng từ LocalStorage (Giúp ấn F5 không mất hàng)
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cartItems");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // 2. Mỗi khi giỏ hàng (cart) thay đổi, tự động lưu lại vào LocalStorage
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, qty = 1) => {
    setCart((prev) => {
      // 1. CHUẨN HÓA DỮ LIỆU: Bắt trúng ID, Giá và Phiên bản dù đến từ nguồn nào
      const safeId = product.id || product._id;
      const safePrice = product.price || product.basePrice || 0;
      const safeVariant = product.variantName || "Tiêu chuẩn";

      // 2. Tìm xem sản phẩm (Cùng ID và Cùng phiên bản) đã có trong giỏ chưa
      const existingItem = prev.find(
        (item) => (item.id || item._id) === safeId && (item.variantName || "Tiêu chuẩn") === safeVariant
      );

      if (existingItem) {
        // Nếu ĐÃ CÓ: Chỉ tăng số lượng
        return prev.map((item) =>
          (item.id || item._id) === safeId && (item.variantName || "Tiêu chuẩn") === safeVariant
            ? { ...item, qty: item.qty + qty }
            : item
        );
      }

      // 3. Nếu CHƯA CÓ: Thêm mới vào giỏ hàng và ép kiểu đúng tên thuộc tính
      return [
        ...prev,
        {
          ...product,
          id: safeId,               // Fix triệt để lỗi gộp chung sản phẩm
          price: safePrice,         // Fix triệt để lỗi tính tổng tiền bị NaN
          variantName: safeVariant, // Đảm bảo luôn có tên cấu hình
          qty: qty,
        },
      ];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateCartQty = (productId, qty) => {
    setCart((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, qty } : item)),
    );
  };

  const logout = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
  };

  // 3. Hàm tạo đơn hàng (Chỉ lưu vào DB, chưa thanh toán)
  const placeOrder = async (shippingAddress) => {
    if (!user) {
      alert("Vui lòng đăng nhập để đặt hàng!");
      return null;
    }
    if (cart.length === 0) {
      alert("Giỏ hàng của bạn đang trống!");
      return null;
    }

    try {
      const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
      
      // Gửi request POST xuống Backend
      const response = await axiosClient.post("/orders", {
        orderItems: cart,
        shippingAddress,
        totalPrice
      });

      // Trả về dữ liệu đơn hàng (Chứa ID để popup QR dùng)
      return response.data;
    } catch (error) {
      console.error("Lỗi đặt hàng:", error);
      alert("Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.");
      return null;
    }
  };

  // 4. Hàm xác nhận thanh toán (Khi khách bấm Đã chuyển khoản)
  const payOrder = async (orderId) => {
    try {
      await axiosClient.put(`/orders/${orderId}/pay`);
      setCart([]); // Thanh toán xong mới xóa sạch giỏ hàng
      return true;
    } catch (error) {
      console.error("Lỗi xác nhận thanh toán:", error);
      return false;
    }
  };

  const updateOrderStatus = (id, status) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === id ? { ...order, status } : order)),
    );
  };

  const addProduct = (product) => {
    const newProduct = {
      ...product,
      id: Date.now(),
      badge: "Mới",
      price: Number(product.price),
    };
    setProducts((prev) => [newProduct, ...prev]);
  };

  const updateProduct = (id, changes) => {
    setProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...changes } : item)),
    );
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((item) => item.id !== id));
  };

  const addCategory = (name) => {
    setCategories((prev) => [...prev, { id: Date.now(), name }]);
  };

  const updateCategory = (id, name) => {
    setCategories((prev) =>
      prev.map((item) => (item.id === id ? { ...item, name } : item)),
    );
  };

  const deleteCategory = (id) => {
    setCategories((prev) => prev.filter((item) => item.id !== id));
  };

  const addBanner = (banner) => {
    setBanners((prev) => [...prev, { ...banner, id: Date.now() }]);
  };

  const updateBanner = (id, changes) => {
    setBanners((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...changes } : item)),
    );
  };

  const deleteBanner = (id) => {
    setBanners((prev) => prev.filter((item) => item.id !== id));
  };

  const value = useMemo(
    () => ({
      products,
      categories,
      banners,
      cart,
      orders,
      user,
      setUser,
      addToCart,
      removeFromCart,
      updateCartQty,
      logout,
      placeOrder,
      payOrder, // Đã bổ sung hàm thanh toán vào đây
      updateOrderStatus,
      addProduct,
      updateProduct,
      deleteProduct,
      addCategory,
      updateCategory,
      deleteCategory,
      addBanner,
      updateBanner,
      deleteBanner,
    }),
    [products, categories, banners, cart, orders, user],
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  return useContext(ShopContext);
}