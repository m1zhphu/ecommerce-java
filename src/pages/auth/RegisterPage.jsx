// src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserService from '../../api/UserService'; // Import service

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        // --- Kiểm tra cơ bản phía client ---
        if (formData.password !== formData.confirmPassword) {
            setError('Mật khẩu xác nhận không khớp.');
            setLoading(false);
            return;
        }
        if (formData.password.length < 6) {
             setError('Mật khẩu phải có ít nhất 6 ký tự.');
             setLoading(false);
             return;
        }

        try {
            const registrationData = {
                name: formData.name,
                username: formData.username,
                email: formData.email,
                password: formData.password,
            };

            console.log("Đang gửi dữ liệu đăng ký:", registrationData);
            const response = await UserService.register(registrationData);

            // --- LOG CHI TIẾT KHI THÀNH CÔNG ---
            console.log("Phản hồi GỐC từ backend:", response);
            console.log("Đăng ký thành công (response.data):", response.data);
            
            // Kiểm tra xem backend có trả về token không (dựa trên AuthController của bạn)
            if (response.data && response.data.token) {
                 setSuccess('Đăng ký tài khoản thành công! Bạn sẽ được chuyển đến trang đăng nhập.');
                 // Tùy chọn: Lưu token ngay nếu muốn
                 // localStorage.setItem('userToken', response.data.token);
                 setTimeout(() => {
                    navigate('/login');
                 }, 3000);
            } else {
                // Nếu backend trả về 200 OK nhưng không có token (ví dụ: chỉ có message "Đăng ký thành công")
                 setSuccess(response.data.message || response.data || 'Đăng ký thành công! Bạn có thể đăng nhập ngay.');
                 setTimeout(() => {
                    navigate('/login');
                 }, 3000);
            }

        } catch (err) {
            // --- LOG LỖI CHI TIẾT HƠN ---
            console.error("--- LỖI ĐĂNG KÝ (CHI TIẾT) ---");
            console.error("Error Object:", err);
            console.error("Error Response:", err.response); // Quan trọng nhất
            console.error("Error Request:", err.request);
            console.error("Error Message:", err.message);

            // Hiển thị lỗi từ backend (nếu có) hoặc lỗi chung
            if (err.response) {
                // Lỗi do backend trả về (ví dụ: 400, 409, 500)
                console.error("Backend response data:", err.response.data);
                // Lấy message từ Map.of("message", e.getMessage()) của AuthController
                setError(err.response.data.message || err.response.data || 'Đăng ký thất bại. Lỗi từ máy chủ.');
            } else if (err.request) {
                // Lỗi request, không nhận được phản hồi (ví dụ: backend sập, CORS)
                console.error("Không nhận được phản hồi từ máy chủ:", err.request);
                setError('Không thể kết nối đến máy chủ. Vui lòng kiểm tra mạng.');
            } else {
                // Lỗi JS trước khi gửi request
                console.error("Lỗi JavaScript:", err.message);
                setError('Đã xảy ra lỗi. Vui lòng thử lại.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        // Thêm padding top để không bị header che
        <div className="flex items-center justify-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 pt-24 md:pt-28">
            <div className="w-full max-w-md space-y-8">
                 <div>
                    <h2 className="mt-6 text-center text-3xl font-bold font-serif text-gray-900">
                        Tạo tài khoản mới
                    </h2>
                </div>

                {/* Thông báo lỗi */}
                {error && (
                    <div className="p-3 bg-red-100 text-red-700 text-sm rounded text-center">
                        {error}
                    </div>
                )}
                {/* Thông báo thành công */}
                {success && (
                     <div className="p-3 bg-green-100 text-green-700 text-sm rounded text-center">
                         {success}
                     </div>
                 )}


                <form onSubmit={handleSubmit} className="mt-8 space-y-6 bg-white p-8 rounded-lg shadow-md">
                    {/* ... (Các input giữ nguyên) ... */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1"> Tên của bạn </label>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 transition duration-150" placeholder="Nguyễn Văn A" />
                    </div>
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1"> Tên đăng nhập </label>
                        <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 transition duration-150" placeholder="tendangnhap" />
                    </div>
                    <div>
                         <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1"> Email </label>
                         <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 transition duration-150" placeholder="email@example.com" />
                     </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1"> Mật khẩu </label>
                        <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 transition duration-150" placeholder="Tối thiểu 6 ký tự" />
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1"> Xác nhận mật khẩu </label>
                         <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 transition duration-150" placeholder="Nhập lại mật khẩu" />
                     </div>

                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            disabled={loading || success} // Disable nếu đang load hoặc đã thành công
                            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-white bg-gray-900 hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 transition duration-150 disabled:opacity-50 ${loading || success ? 'cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Đang đăng ký...' : 'Đăng Ký'}
                        </button>
                    </div>
                </form>

                {/* Link to Login Page */}
                <div className="text-center text-sm text-gray-600">
                    Đã có tài khoản?{' '}
                    <Link
                        to="/login"
                        className="font-medium text-gray-800 hover:text-black transition-colors"
                    >
                        Đăng nhập ngay
                    </Link>
                </div>
            </div>
        </div>
    );
}