import React from 'react';
import Header from '../layouts/Header.jsx'; // Đảm bảo import Header
import Banner from '../components/Banner.jsx';
import CategoryList from '../components/CategoryList.jsx';
import FeaturedProducts from '../components/FeaturedProducts.jsx'; // Import component mới
import HomeBlogSection from '../components/HomeBlogSection';

// (Bạn có thể thêm Footer ở đây)
// import Footer from '../components/layouts/Footer.jsx';

export default function HomePage() {
  return (
    <div>
      {/* Header đã được MainLayout.jsx quản lý, KHÔNG cần gọi ở đây */}

      <Banner />
      <CategoryList />
      <FeaturedProducts />
      <HomeBlogSection />
      {/* <Footer /> */}
    </div>
  );
}