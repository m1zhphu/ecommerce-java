// src/admin/user/EditUser.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import UserService from "../../api/UserService";
import { ArrowLeft, User, Save } from "lucide-react";

export default function EditUser() {
    const { id } = useParams(); // Lấy User ID từ URL
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        address: '',
        phoneNumber: '',
        role: 'USER', // Mặc định là USER
    });
    
    const [loading, setLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // 1. Tải dữ liệu User hiện tại
    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            try {
                // API GET /api/users/{id} (Cần ADMIN Token)
                const res = await UserService.getUserById_Admin(id); 
                const user = res.data;

                setFormData({
                    name: user.name || '',
                    username: user.username || '',
                    email: user.email || '',
                    address: user.address || '',
                    phoneNumber: user.phoneNumber || '',
                    role: user.role || 'USER',
                });
                setError(null);
            } catch (err) {
                console.error("Lỗi tải user:", err);
                setError("Không thể tải thông tin người dùng!");
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [id]);

    // 2. Xử lý thay đổi input
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 3. Xử lý cập nhật
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        setError(null);
        setSuccess(null);

        // Chuẩn bị dữ liệu gửi đi (không gửi password)
        const updateData = {
            name: formData.name,
            email: formData.email,
            address: formData.address,
            phoneNumber: formData.phoneNumber,
            role: formData.role,
            // Không gửi ID và Username
        };

        try {
            // API PUT /api/users/{id} (Cần ADMIN Token)
            await UserService.updateUser_Admin(id, updateData);
            setSuccess("Cập nhật người dùng thành công!");
            
            // Chuyển hướng về trang danh sách sau 1.5 giây
            setTimeout(() => navigate("/admin/users"), 1500);
        } catch (err) {
            console.error("Lỗi cập nhật:", err);
            setError(err.response?.data?.message || "Cập nhật thất bại!");
        } finally {
            setIsUpdating(false);
        }
    };

    // --- RENDER ---
    if (loading) {
        return <p className="text-center p-8">Đang tải thông tin người dùng...</p>;
    }

    if (error && !formData.username) {
         return <p className="text-center p-8 text-red-600">{error}</p>;
    }

    return (
        <>
            {/* Header và Nút quay lại */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                        <User size={32} className="text-blue-600" />
                        Chỉnh sửa: {formData.username}
                    </h1>
                    <p className="text-gray-500 mt-1">Cập nhật thông tin chi tiết và vai trò.</p>
                </div>
                <Link to="/admin/users" className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg transition duration-200">
                    <ArrowLeft size={20} />
                    Quay lại danh sách
                </Link>
            </div>

            {/* Thông báo */}
            {error && <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700 text-center">{error}</div>}
            {success && <div className="mb-4 p-3 rounded-lg bg-green-100 text-green-700 text-center">{success}</div>}


            {/* Form chỉnh sửa */}
            <div className="bg-white p-8 rounded-xl shadow-lg max-w-4xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* Hàng 1: Username & Name */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Username (Không thể sửa)</label>
                            <input type="text" value={formData.username} disabled className="w-full px-4 py-2 border border-gray-200 bg-gray-50 rounded-md shadow-sm text-sm text-gray-500 cursor-not-allowed" />
                        </div>
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-blue-500" />
                        </div>
                    </div>

                    {/* Hàng 2: Email & Phone */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-blue-500" />
                        </div>
                         <div>
                            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                            <input type="tel" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-blue-500" />
                        </div>
                    </div>

                    {/* Hàng 3: Address & Role */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                            <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-blue-500" />
                        </div>
                         <div>
                            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
                            <select id="role" name="role" value={formData.role} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-blue-500">
                                <option value="USER">USER</option>
                                <option value="ADMIN">ADMIN</option>
                            </select>
                        </div>
                    </div>
                    
                    {/* Nút lưu */}
                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={isUpdating}
                            className={`flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-6 rounded-lg transition duration-200 disabled:bg-gray-400`}
                        >
                            <Save size={20} />
                            {isUpdating ? 'Đang lưu...' : 'Lưu thay đổi'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}