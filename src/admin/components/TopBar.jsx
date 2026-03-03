import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
// 1. Import thêm icon LogOut
import { User, Bell, Search, LogOut } from "lucide-react";

export default function Topbar() {
  // 2. State để quản lý việc mở/đóng dropdown
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  
  // 3. Logic để đóng dropdown khi click ra ngoài
  const dropdownRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    // Lắng nghe click
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Dọn dẹp listener
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);


  // 4. Hàm xử lý Đăng xuất
  const handleLogout = () => {
    // Xóa token khỏi localStorage
    localStorage.removeItem('adminToken');
    
    // Đóng dropdown
    setIsDropdownOpen(false);
    
    // Chuyển hướng về trang đăng nhập
    navigate('/admin/login');
  };

  return (
    <header className="h-16 bg-white flex items-center justify-between px-6 shadow-md sticky top-0 z-20">
      {/* Left: Search */}
      <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full w-1/3 max-w-md">
        <Search size={18} className="text-gray-400" />
        <input
          type="text"
          placeholder="Tìm kiếm..."
          className="bg-transparent outline-none w-full text-gray-700 placeholder-gray-400"
        />
      </div>

      {/* Right: Notification + Profile */}
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-full hover:bg-gray-100 transition">
          <Bell size={20} className="text-gray-600" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* === CẬP NHẬT PHẦN PROFILE === */}
        {/* 5. Bọc trong div relative và gán ref */}
        <div className="relative" ref={dropdownRef}>
          {/* Nút kích hoạt dropdown */}
          <div
            className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 px-3 py-1 rounded-full transition"
            // 6. Thêm onClick để bật/tắt dropdown
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <span className="text-gray-700 font-medium">Admin</span>
            <User size={24} className="text-gray-600" />
          </div>

          {/* 7. Menu Dropdown (chỉ hiển thị khi isDropdownOpen = true) */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-30 ring-1 ring-black ring-opacity-5">
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
              >
                <LogOut size={16} className="text-gray-600" />
                Đăng xuất
              </button>
              {/* (Bạn có thể thêm các link khác ở đây, ví dụ: "Hồ sơ") */}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}