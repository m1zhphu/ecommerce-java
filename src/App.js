import React from "react";
// Bỏ BrowserRouter khỏi đây (nó nên ở index.js hoặc main.jsx)
import { Routes, Route } from "react-router-dom";

// === 1. IMPORT LAYOUT ===
import MainLayout from "./layouts/MainLayout.jsx"; // Layout cho trang người dùng
import AdminLayout from "./admin/layouts/AdminLayout.js"; // Layout cho trang admin

// === 2. IMPORT CÁC TRANG NGƯỜI DÙNG ===
import HomePage from './pages/HomePage.jsx';
import ProductPage from './pages/product/ProductByCategoryPage.jsx';
import ProductDetailPage from './pages/product/ProductDetailPage.jsx';
import LoginPage from './pages/auth/LoginPage.jsx';
import RegisterPage from './pages/auth/RegisterPage.jsx';
import CartPage from './pages/cart_checkout_order/CartPage.jsx';
import CheckoutPage from './pages/cart_checkout_order/CheckoutPage.jsx';
import OrderSuccessPage from './pages/cart_checkout_order/OrderSuccessPage.jsx';
import ProfilePage from './pages/profile/ProfilePage.jsx';
import EditProfilePage from './pages/profile/EditProfilePage.jsx';
import OrderHistoryPage from './pages/cart_checkout_order/OrderHistoryPage.jsx';
import OrderDetailPage from './pages/cart_checkout_order/OrderDetailPage.jsx';
import AllProductsPage from './pages/product/AllProductsPage.jsx';
import PostDetailPage from './pages/post/PostDetailPage';
import PostListPage from './pages/post/AllPostPage.jsx';
import ContactPage from './pages/footer/ContactPage.jsx';
import SearchProductPage from "./pages/product/SearchProductPage.jsx";

// === 3. IMPORT CÁC TRANG ADMIN ===
import Dashboard from "./admin/dashboard/Dashboard.jsx"; // Sửa lại đường dẫn nếu cần
import ProductList from "./admin/product/ProductList.jsx";
import AddProduct from "./admin/product/AddProduct.jsx";
import EditProduct from "./admin/product/EditProduct.jsx";


import CategoryList from "./admin/category/CategoryList.jsx";
import AddCategory from "./admin/category/AddCategory.jsx";
import EditCategory from "./admin/category/EditCategory.jsx";

import UserList from "./admin/user/UserList.jsx";
import EditUser from "./admin/user/EditUser.jsx";
import AddUser from "./admin/user/AddUser.jsx";

import BannerList from "./admin/banner/BannerList.jsx";
import AddBanner from "./admin/banner/AddBanner.jsx";
import EditBanner from "./admin/banner/EditBanner.jsx";

import MenuList from "./admin/menu/MenuList.jsx";
import AddMenu from "./admin/menu/AddMenu";
import EditMenu from "./admin/menu/EditMenu";

import PostList from "./admin/post/PostList";
import AddPost from "./admin/post/AddPost";
import EditPost from "./admin/post/EditPost";

import OrderList from "./admin/order/OrderList.jsx"
import OrderDetail from "./admin/order/OrderDetail.jsx"

import AboutPage from './pages/footer/AboutPage.jsx';

import PrivacyPolicy from './pages/footer/PrivacyPolicy.jsx';

import TermsOfServicePage from './pages/footer/TermsOfServicePage.jsx';
// Import trang đăng nhập admin
import AdminLogin from "./admin/components/AdminLogin.jsx"; // Đặt trang login admin vào pages

// (Không cần import Register ở đây nếu nó dùng MainLayout)

export default function App() {
  return (
    
    // <BrowserRouter> nên bọc <App /> trong file index.js hoặc main.jsx
    <Routes>

      {/* === NHÓM 1: ROUTE TRANG NGƯỜI DÙNG (Dùng MainLayout) === */}
      {/* Mọi route bên trong sẽ hiển thị Header (từ MainLayout) */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} /> {/* Trang chủ: / */}
        <Route path="products/category/:categoryId" element={<ProductPage />} />
        <Route path="product/:productId" element={<ProductDetailPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="order-success" element={<OrderSuccessPage />} />
        <Route path="account/profile" element={<ProfilePage />} />
        <Route path="account/profile/edit" element={<EditProfilePage />} />
        <Route path="account/orders" element={<OrderHistoryPage />} />
        <Route path="account/orders/:orderId" element={<OrderDetailPage />} />
        <Route path="products" element={<AllProductsPage />} />
        <Route path="products/search" element={<SearchProductPage />} />
        <Route path="post/:slug" element={<PostDetailPage />} />
        <Route path="posts" element={<PostListPage />} /> 
        <Route path="contact" element={<ContactPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="privacy-policy" element={<PrivacyPolicy />} />
        <Route path="terms-of-service" element={<TermsOfServicePage />} />
      </Route>

      {/* === NHÓM 2: ROUTE TRANG ADMIN === */}
      {/* Route đăng nhập admin (nằm ngoài AdminLayout) */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Các route admin khác (dùng AdminLayout) */}
      {/* Mọi route bên trong sẽ hiển thị Sidebar (từ AdminLayout) */}
      <Route path="/admin" element={<AdminLayout />}>
        {/* Trang Dashboard mặc định khi vào /admin */}
        {/* <Route index element={<Dashboard />} /> */}
        <Route path="dashboard" element={<Dashboard />} /> {/* Hoặc /admin/dashboard */}

        <Route path="products" element={<ProductList />} />
        <Route path="add-product" element={<AddProduct />} />
        <Route path="edit-product/:id" element={<EditProduct />} />

        <Route path="categories" element={<CategoryList />} />
        <Route path="add-category" element={<AddCategory />} />
        <Route path="edit-category/:id" element={<EditCategory />} />

        <Route path="banners" element={<BannerList />} />
        <Route path="add-banner" element={<AddBanner />} />
        <Route path="edit-banner/:id" element={<EditBanner />} />

        <Route path="users" element={<UserList />} />
        <Route path="edit-user/:id" element={<EditUser />} />
        <Route path="add-user" element={<AddUser />} />
        
        <Route path="menus" element={<MenuList />} />
        <Route path="add-menu" element={<AddMenu />} />
        <Route path="edit-menu/:id" element={<EditMenu />} />

        <Route path="posts" element={<PostList />} />
        <Route path="add-post" element={<AddPost />} />
        <Route path="edit-post/:id" element={<EditPost />} />

        <Route path="orders" element={<OrderList />} />
        <Route path="orders/:orderId" element={<OrderDetail />} />
         {/* ... các route admin khác */}
      </Route>

    </Routes>
  );
}