import { createContext, useContext, useMemo, useState } from "react";
import productsData from "../data/products";

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

const defaultUsers = [
  {
    id: 1,
    name: "Admin Oneway",
    email: "admin@oneway.com",
    password: "admin123",
    role: "admin",
    locked: false,
  },
  {
    id: 2,
    name: "Nguyễn Văn A",
    email: "user@oneway.com",
    password: "user123",
    role: "user",
    locked: false,
  },
];

export function ShopProvider({ children }) {
  const [products, setProducts] = useState(productsData);
  const [categories, setCategories] = useState(initialCategories);
  const [banners, setBanners] = useState(initialBanners);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState(defaultUsers);
  const [user, setUser] = useState(null);

  const addToCart = (product, qty = 1) => {
    setCart((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);
      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + qty } : item,
        );
      }
      return [...prev, { ...product, qty }];
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

  const login = (email, password) => {
    const found = users.find(
      (item) =>
        item.email === email && item.password === password && !item.locked,
    );
    if (!found) return false;
    setUser(found);
    return true;
  };

  const logout = () => setUser(null);

  const placeOrder = (formData) => {
    if (!user || cart.length === 0) return false;
    const newOrder = {
      id: Date.now(),
      customer: user.name,
      items: cart,
      total: cart.reduce((sum, item) => sum + item.price * item.qty, 0),
      status: "Chờ xác nhận",
      ...formData,
    };
    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    return true;
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

  const toggleUserLock = (id) => {
    setUsers((prev) =>
      prev.map((userItem) =>
        userItem.id === id
          ? { ...userItem, locked: !userItem.locked }
          : userItem,
      ),
    );
  };

  const value = useMemo(
    () => ({
      products,
      categories,
      banners,
      cart,
      orders,
      users,
      user,
      addToCart,
      removeFromCart,
      updateCartQty,
      login,
      logout,
      placeOrder,
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
      toggleUserLock,
    }),
    [products, categories, banners, cart, orders, users, user],
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  return useContext(ShopContext);
}
