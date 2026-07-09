import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CompanyPage from "./pages/CompanyPage";
import StorePage from "./pages/StorePage";
import ContactPage from "./pages/ContactPage";
import CareerPage from "./pages/CareerPage";
import PhonesPage from "./pages/PhonesPage";
import LaptopPage from "./pages/LaptopPage";
import UsedPage from "./pages/UsedPage";
import TabletPage from "./pages/TabletPage";
import SmartDevicePage from "./pages/SmartDevicePage";
import SmartHomePage from "./pages/SmartHomePage";
import AccessoryPage from "./pages/AccessoryPage";
import AudioPage from "./pages/AudioPage";
import CategoryPage from "./pages/CategoryPage";
import DealPage from "./pages/DealPage";
import PromoPage from "./pages/PromoPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import AccountPage from "./pages/AccountPage";
import AdminPage from "./pages/AdminPage";
import SearchPage from "./pages/SearchPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gioi-thieu" element={<CompanyPage />} />
        <Route path="/he-thong-cua-hang" element={<StorePage />} />
        <Route path="/lien-he" element={<ContactPage />} />
        <Route path="/tuyen-dung" element={<CareerPage />} />
        <Route path="/dien-thoai" element={<PhonesPage />} />
        <Route path="/macbook" element={<LaptopPage />} />
        <Route path="/may-cu" element={<UsedPage />} />
        <Route path="/may-tinh-bang" element={<TabletPage />} />
        <Route path="/dong-ho-thong-minh" element={<SmartDevicePage />} />
        <Route path="/nha-thong-minh" element={<SmartHomePage />} />
        <Route path="/phu-kien" element={<AccessoryPage />} />
        <Route path="/am-thanh" element={<AudioPage />} />
        <Route path="/deal-hoi" element={<DealPage />} />
        <Route path="/khuyen-mai" element={<PromoPage />} />
        <Route path="/danh-muc/:categoryName" element={<CategoryPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/dang-nhap" element={<LoginPage />} />
        <Route path="/dang-ky" element={<RegisterPage />} />
        <Route path="/gio-hang" element={<CartPage />} />
        <Route path="/thanh-toan" element={<CheckoutPage />} />
        <Route path="/tai-khoan" element={<AccountPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/tim-kiem" element={<SearchPage />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
