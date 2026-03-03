// src/components/layouts/MainLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer.jsx';

export default function MainLayout() {
  return (
    <div className="relative min-h-screen">
      <Header />
      {/* THAY ĐỔI: Xóa padding top */}
      <main> {/* <<-- Xóa pt-16 md:pt-20 ở đây */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}