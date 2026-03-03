// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import UserService from '../../api/UserService'; 
import { User, LogOut, ArrowLeft, ClipboardList } from 'lucide-react'; 

export default function ProfilePage() {
    const [profile, setProfile] = useState(null); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // 1. Tải thông tin người dùng khi vào trang
    useEffect(() => {
        setLoading(true);
        setError(''); 
        
        UserService.getCurrentUser()
            .then(response => {
                const user = response.data; // <<-- NHẬN DỮ LIỆU ĐÃ ĐƯỢC MAPPING TỪ BACKEND
                
                if (user && user.username) { 
                    setProfile({
                        name: user.name || '',
                        username: user.username || '', 
                        email: user.email || '',
                        // LƯU TRỰC TIẾP TỪ DTO VÀO STATE
                        phoneNumber: user.phoneNumber || '', 
                        address: user.address || '',   
                    });
                } else {
                    console.error("API /users/me trả về dữ liệu rỗng. Xóa token.");
                    localStorage.removeItem('userToken'); 
                    navigate('/login'); 
                }
            })
            .catch(err => {
                // ... (Logic xử lý lỗi 401/403/404 giữ nguyên) ...
            })
            .finally(() => {
                setLoading(false);
            });
    }, [navigate]);

    // 2. Hàm Đăng xuất
    const handleLogout = () => {
        localStorage.removeItem('userToken');
        navigate('/login');
        window.location.reload(); 
    };

    // --- RENDER ---
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50 pt-20">
                <p className="text-xl text-gray-600 animate-pulse">Đang tải hồ sơ...</p>
            </div>
        );
    }

    if (error) {
         return (
            <div className="container mx-auto px-4 py-20 text-center pt-28">
                 <p className="text-red-600 font-semibold mb-4">{error}</p>
                 <Link to="/" className="text-blue-600 hover:underline inline-flex items-center">
                     Quay lại trang chủ
                 </Link>
            </div>
        );
    }
    
    if (!profile) { return null; }

    return (
        <div className="bg-gray-50 min-h-screen pt-24 md:pt-28">
            <div className="container mx-auto pb-16 px-4 lg:px-6">

                {/* --- HEADER TRANG (Cân bằng giữa tiêu đề và nút quay lại) --- */}
                <div className="flex justify-between items-center mb-10 md:mb-12">
                    
                    {/* Nút Quay về trang chủ (Bên trái) */}
                    <Link to="/" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors group flex-shrink-0">
                        <ArrowLeft size={16} className="mr-1.5 transition-transform duration-200 group-hover:-translate-x-1" />
                        Quay về trang chủ
                    </Link>

                    {/* TIÊU ĐỀ TRANG (Sử dụng flex-1 và text-center) */}
                    <h1 className="flex-1 text-center text-3xl md:text-4xl font-bold text-gray-900 font-serif whitespace-nowrap overflow-hidden">
                        Hồ Sơ Của Tôi
                    </h1>
                    
                    {/* Phần tử placeholder rỗng để cân bằng */}
                    <div className="w-[100px] flex-shrink-0 hidden md:block"></div> 
                </div>


                {/* Nội dung trang */}
                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6"> 
                
                    {/* Cột Trái: Menu Điều Hướng (Col-span-1) */}
                    <div className="md:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm p-4 sticky top-28">
                             {/* Avatar */}
                             <div className="flex flex-col items-center border-b pb-4 mb-4">
                                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mb-2">
                                    <User size={36} />
                                </div>
                                <p className="text-sm font-semibold text-gray-900 truncate max-w-full">{profile.name || profile.username}</p>
                                <p className="text-xs text-gray-500">{profile.email}</p>
                             </div>
                             
                             {/* Menu Links */}
                             <nav className="flex flex-col space-y-1">
                                <NavLink to="/account/profile" className={({ isActive }) => `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'}`}>
                                    <User size={16} className="inline mr-2" /> Thông tin cá nhân
                                </NavLink>
                                <NavLink to="/account/orders" className={({ isActive }) => `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'}`}>
                                    <ClipboardList size={16} className="inline mr-2" /> Lịch sử đơn hàng
                                </NavLink>
                                <button 
                                    onClick={handleLogout}
                                    className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700"
                                >
                                    <LogOut size={16} className="inline mr-2" />
                                    Đăng xuất
                                </button>
                             </nav>
                        </div>
                    </div>

                    {/* Cột Phải: Thông tin chi tiết (Col-span-3) */}
                    <div className="md:col-span-3">
                        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
                            <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-4 mb-6">
                                Thông tin chi tiết
                            </h2>
                            
                            <div className="space-y-5">
                                {/* Tên đăng nhập */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">Tên đăng nhập</label>
                                    <p className="text-base text-gray-800 mt-1">{profile.username}</p>
                                </div>
                                 {/* Họ và tên */}
                                 <div>
                                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">Họ và tên</label>
                                    <p className="text-base text-gray-800 mt-1">{profile.name || '(Chưa cập nhật)'}</p>
                                </div>
                                {/* Email */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">Email</label>
                                    <p className="text-base text-gray-800 mt-1">{profile.email || '(Chưa cập nhật)'}</p>
                                </div>
                                 {/* Số điện thoại */}
                                 <div>
                                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">Số điện thoại</label>
                                    <p className="text-base text-gray-800 mt-1">{profile.phoneNumber || '(Chưa cập nhật)'}</p> 
                                </div>
                                {/* Địa chỉ */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">Địa chỉ</label>
                                    <p className="text-base text-gray-800 mt-1">{profile.address || '(Chưa cập nhật)'}</p>
                                </div>

                                {/* Nút Chỉnh sửa thông tin */}
                                <div className="pt-6 border-t border-gray-100 mt-6 flex justify-end">
                                     <Link 
                                        to="/account/profile/edit"
                                        className="inline-block bg-gray-900 hover:bg-black text-white text-sm font-semibold py-2.5 px-6 rounded transition duration-300"
                                    >
                                        Chỉnh sửa thông tin
                                    </Link>
                                </div> 
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}