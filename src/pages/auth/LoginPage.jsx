// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserService from '../../api/UserService'; // Import service để gọi API đăng nhập

export default function LoginPage() {
    const [credentials, setCredentials] = useState({
        username: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(''); // THÊM STATE CHO THÀNH CÔNG
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(''); // Reset thông báo thành công

        try {
            // --- BƯỚC 1: GỌI API ĐĂNG NHẬP THẬT ---
            console.log("Đang gửi thông tin đăng nhập:", credentials);
            const response = await UserService.login(credentials);

            // --- BƯỚC 2: XỬ LÝ KHI ĐĂNG NHẬP THÀNH CÔNG ---
            console.log("Đăng nhập thành công, response:", response.data);

            if (response.data && response.data.token) {
                // 1. LƯU TOKEN
                localStorage.setItem('userToken', response.data.token);

                // 2. HIỂN THỊ THÔNG BÁO THÀNH CÔNG
                setSuccess('Đăng nhập thành công! Đang chuyển về trang chủ...');
                
                // 3. CHUYỂN HƯỚNG SAU 3 GIÂY
                setTimeout(() => {
                    navigate('/');
                    window.location.reload(); 
                }, 3000); // 3 giây

            } else {
                setError('Không nhận được token từ máy chủ.');
                setLoading(false); // Dừng loading nếu lỗi
            }
            // Không set loading(false) ở đây vì ta muốn nút bị vô hiệu hóa cho đến khi chuyển trang

        } catch (err) {
            console.error("Lỗi đăng nhập:", err);
            // Hiển thị lỗi
            setError(err.response?.data?.message || 'Tên đăng nhập hoặc mật khẩu không đúng.');
            setLoading(false); // Dừng loading nếu có lỗi
        }
        // Bỏ `finally` để kiểm soát state `loading` tốt hơn
    };

    return (
        // Thêm padding top để không bị header che
        <div className="flex items-center justify-center min-h-screen bg-gray-50 pt-24 md:pt-28">
            <div className="w-full max-w-md px-8 py-10 bg-white rounded-lg shadow-md">
                <h2 className="text-3xl font-bold text-center text-gray-900 mb-8 font-serif">
                    Đăng Nhập
                </h2>

                {/* Hiển thị thông báo lỗi */}
                {error && (
                    <div className="mb-6 p-3 bg-red-100 text-red-700 text-sm rounded text-center">
                        {error}
                    </div>
                )}

                {/* THÊM: Hiển thị thông báo thành công */}
                {success && (
                    <div className="mb-6 p-3 bg-green-100 text-green-700 text-sm rounded text-center">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Username or Email Input */}
                    <div>
                        <label
                            htmlFor="username"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Tên đăng nhập
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={credentials.username}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition duration-150"
                            placeholder="Nhập tên đăng nhập"
                        />
                    </div>

                    {/* Password Input */}
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Mật khẩu
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={credentials.password}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition duration-150"
                            placeholder="Nhập mật khẩu"
                        />
                        {/* Optional: Forgot Password Link */}
                        <div className="text-right mt-1">
                            <Link
                                to="/forgot-password"
                                className="text-xs text-gray-500 hover:text-gray-800 transition-colors"
                            >
                                Quên mật khẩu?
                            </Link>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            // THAY ĐỔI: Disable nút khi loading HOẶC đã thành công
                            disabled={loading || success}
                            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-white bg-gray-900 hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 transition duration-150 disabled:opacity-50 ${loading || success ? 'cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Đang xử lý...' : 'Đăng Nhập'}
                        </button>
                    </div>
                </form>

                {/* Link to Register Page */}
                <div className="mt-8 text-center text-sm text-gray-600">
                    Chưa có tài khoản?{' '}
                    <Link
                        to="/register"
                        className="font-medium text-gray-800 hover:text-black transition-colors"
                    >
                        Đăng ký ngay
                    </Link>
                </div>
            </div>
        </div>
    );
}