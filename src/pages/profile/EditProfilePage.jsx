// src/pages/EditProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserService from '../../api/UserService'; // Import service
import { ArrowLeft } from 'lucide-react';

export default function EditProfilePage() {
    // State để lưu thông tin người dùng
    const [formData, setFormData] = useState({
        name: '',
        username: '', // Username không cho sửa
        email: '',
        phone: '',
        address: '',
    });
    const [loading, setLoading] = useState(true); // Loading trang ban đầu
    const [isUpdating, setIsUpdating] = useState(false); // Loading khi nhấn nút Cập nhật
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    // 1. Tải thông tin người dùng khi vào trang
    useEffect(() => {
        setLoading(true);
        UserService.getCurrentUser()
            .then(response => {
                const user = response.data;
                setFormData({
                    name: user.name || '',
                    username: user.username || '', // Hiển thị username (không cho sửa)
                    email: user.email || '',
                    phone: user.phoneNumber || '', // Lấy từ 'phoneNumber'
                    address: user.address || '', // Lấy từ 'address'
                });
            })
            .catch(err => {
                console.error("Lỗi khi tải hồ sơ:", err);
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    alert("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
                    navigate('/login');
                } else {
                    setError("Không thể tải thông tin hồ sơ.");
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }, [navigate]);

    // 2. Xử lý thay đổi input
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 3. Xử lý cập nhật hồ sơ
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        setError('');
        setSuccess('');

        // Dữ liệu gửi đi (không bao gồm username)
        const updateData = {
            name: formData.name,
            email: formData.email,
            phoneNumber: formData.phone, // Gửi về 'phoneNumber'
            address: formData.address,
        };

        try {
            // Gọi API cập nhật
            const response = await UserService.updateProfile(updateData);
            
            console.log("Cập nhật thành công:", response.data);
            setSuccess('Cập nhật thông tin thành công!');
            
            // Cập nhật lại state với dữ liệu mới
            setFormData(prev => ({
                ...prev,
                name: response.data.name || prev.name,
                email: response.data.email || prev.email,
                phone: response.data.phoneNumber || prev.phone,
                address: response.data.address || prev.address,
            }));
            
            // Tùy chọn: Chuyển về trang profile sau 2 giây
            setTimeout(() => {
                navigate('/account/profile');
            }, 2000);

        } catch (err) {
            console.error("Lỗi khi cập nhật hồ sơ:", err);
            setError(err.response?.data?.message || "Cập nhật thất bại. Vui lòng thử lại.");
        } finally {
            setIsUpdating(false);
        }
    };

    // --- RENDER ---
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50 pt-20">
                <p className="text-xl text-gray-600 animate-pulse">Đang tải hồ sơ...</p>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen pt-24 md:pt-28">
            <div className="container mx-auto pb-16 px-4 lg:px-6">
                
                {/* Nút quay lại trang Profile */}
                <Link to="/account/profile" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors group mb-6">
                    <ArrowLeft size={16} className="mr-1.5 transition-transform duration-200 group-hover:-translate-x-1" />
                    Quay về Hồ sơ
                </Link>

                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center font-serif">
                    Chỉnh Sửa Hồ Sơ
                </h1>

                <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-6 md:p-8">
                    
                    <form onSubmit={handleSubmit} className="space-y-5">
                        
                        {/* Thông báo Lỗi/Thành công */}
                        {error && (
                            <div className="p-3 bg-red-100 text-red-700 text-sm rounded text-center">
                                {error}
                            </div>
                        )}
                        {success && (
                             <div className="p-3 bg-green-100 text-green-700 text-sm rounded text-center">
                                 {success}
                             </div>
                         )}

                        {/* Username (Không cho sửa) */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1.5">Tên đăng nhập</label>
                            <input 
                                type="text" 
                                id="username" 
                                name="username" 
                                value={formData.username} 
                                readOnly 
                                disabled
                                className="w-full px-4 py-2 border border-gray-200 bg-gray-100 rounded-md shadow-sm text-gray-500 cursor-not-allowed"
                            />
                        </div>
                        
                        {/* Name Input */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">Họ và tên</label>
                            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-900" />
                        </div>

                        {/* Email Input */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-900" />
                        </div>

                        {/* Phone Input */}
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">Số điện thoại</label>
                            <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-900" />
                        </div>
                        
                        {/* Address Input */}
                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1.5">Địa chỉ</label>
                            <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-900" />
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4 flex justify-end">
                            <button
                                type="submit"
                                disabled={isUpdating || loading}
                                className={`w-full md:w-auto flex justify-center py-3 px-8 border border-transparent rounded-md shadow-sm text-sm font-semibold text-white bg-gray-900 hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 transition duration-150 disabled:opacity-50 ${isUpdating ? 'cursor-not-allowed' : ''}`}
                            >
                                {isUpdating ? 'Đang lưu...' : 'Lưu thay đổi'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}