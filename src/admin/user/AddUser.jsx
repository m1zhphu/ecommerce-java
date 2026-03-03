// src/admin/user/AddUser.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import UserService from "../../api/UserService";
import { ArrowLeft, UserPlus, Save } from "lucide-react";

export default function AddUser() {
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        username: '',
        name: '',
        email: '',
        phoneNumber: '',
        address: '',
        password: '',
        role: 'USER', // Mặc định tạo là USER
    });
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Xử lý thay đổi input
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Xử lý submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        setSuccess(null);

        // Kiểm tra cơ bản
        if (formData.password.length < 6) {
             setError("Mật khẩu phải có ít nhất 6 ký tự.");
             setIsSubmitting(false);
             return;
        }

        try {
            // Chuẩn bị dữ liệu (cần khớp với DTO backend)
            const userData = {
                username: formData.username,
                name: formData.name,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
                address: formData.address,
                password: formData.password,
                role: formData.role,
            };

            // API POST /api/users (Cần ADMIN Token)
            await UserService.createUser_Admin(userData);
            
            setSuccess("Tạo người dùng mới thành công!");
            
            // Chuyển hướng về trang danh sách sau 1.5 giây
            setTimeout(() => navigate("/admin/users"), 1500);

        } catch (err) {
            console.error("Lỗi tạo user:", err);
            // Hiển thị lỗi từ backend (ví dụ: Username đã tồn tại)
            setError(err.response?.data?.message || "Tạo người dùng thất bại!");
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- RENDER ---
    return (
        <>
            {/* Header và Nút quay lại */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                        <UserPlus size={32} className="text-blue-600" />
                        Thêm Người Dùng Mới
                    </h1>
                    <p className="text-gray-500 mt-1">Điền thông tin tài khoản cho người dùng mới.</p>
                </div>
                <Link to="/admin/users" className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg transition duration-200">
                    <ArrowLeft size={20} />
                    Quay lại danh sách
                </Link>
            </div>

            {/* Thông báo */}
            {error && <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700 text-center">{error}</div>}
            {success && <div className="mb-4 p-3 rounded-lg bg-green-100 text-green-700 text-center">{success}</div>}


            {/* Form Thêm */}
            <div className="bg-white p-8 rounded-xl shadow-lg max-w-4xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* Hàng 1: Username & Password */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Tên đăng nhập (*)</label>
                            <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-blue-500" />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu (*)</label>
                            <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-blue-500" />
                        </div>
                    </div>

                    {/* Hàng 2: Name & Email */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-blue-500" />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-blue-500" />
                        </div>
                    </div>

                    {/* Hàng 3: Phone & Address */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                            <input type="tel" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-blue-500" />
                        </div>
                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                            <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-blue-500" />
                        </div>
                    </div>
                    
                    {/* Hàng 4: Role */}
                    <div className="md:w-1/2">
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Vai trò (*)</label>
                        <select id="role" name="role" value={formData.role} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-blue-500">
                            <option value="USER">USER</option>
                            <option value="ADMIN">ADMIN</option>
                        </select>
                    </div>

                    
                    {/* Nút lưu */}
                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-6 rounded-lg transition duration-200 disabled:bg-gray-400`}
                        >
                            <Save size={20} />
                            {isSubmitting ? 'Đang tạo...' : 'Tạo người dùng'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}