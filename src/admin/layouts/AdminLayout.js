import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/TopBar';
import { jwtDecode } from 'jwt-decode';

export default function AdminLayout() {
  const token = localStorage.getItem('adminToken');

  // Kiểm tra 1: Đã đăng nhập chưa?
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  try {
    const decodedToken = jwtDecode(token);
    
    // Kiểm tra vai trò (role)
    if (decodedToken.role !== 'ADMIN') {
        localStorage.removeItem('adminToken'); // Xóa token của USER
        
        // === THAY ĐỔI Ở ĐÂY ===
        // Gửi kèm một thông báo lỗi khi chuyển hướng
        return <Navigate 
                  to="/admin/login" 
                  replace 
                  state={{ message: "Tài khoản của bạn không có quyền truy cập trang Admin." }} 
                />;
    }

  } catch (error) {
    // Nếu token bị lỗi hoặc giả mạo
    console.error("Token không hợp lệ:", error);
    localStorage.removeItem('adminToken');

    // === THAY ĐỔI Ở ĐÂY ===
    // Gửi kèm một thông báo lỗi khi chuyển hướng
    return <Navigate 
              to="/admin/login" 
              replace 
              state={{ message: "Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại." }}
            />;
  }

  // Nếu là ADMIN, cho phép vào
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-72"> 
        <Topbar />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}