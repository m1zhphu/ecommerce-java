// src/pages/CheckoutPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CartService from '../../api/CartService.js';
import UserService from '../../api/UserService.js';
import OrderService from '../../api/OrderService.js';
import { ArrowLeft, Lock } from 'lucide-react';
import FileUploadService from '../../api/FileUploadService.js';

export default function CheckoutPage() {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isPlacingOrder, setIsPlacingOrder] = useState(false); 
    const [shippingInfo, setShippingInfo] = useState({
        name: '', email: '', phone: '', address: '',
    });
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        Promise.all([
            CartService.getCartDetails(), 
            UserService.getCurrentUser()
        ])
            .then(([cartResponse, userResponse]) => {
                // Set thông tin giỏ hàng
                if (cartResponse.data && cartResponse.data.items.length > 0) {
                    setCart(cartResponse.data);
                } else {
                    alert("Giỏ hàng của bạn đang trống.");
                    navigate('/');
                }

                // Tự động điền form nếu có thông tin user
                if (userResponse.data) {
                    setShippingInfo(prev => ({
                        ...prev,
                        name: userResponse.data.name || '',
                        email: userResponse.data.email || '',
                        phone: userResponse.data.phoneNumber || '', 
                        address: userResponse.data.address || '', 
                    }));
                }
            })
            .catch(err => {
                console.error("Lỗi khi tải trang checkout:", err);
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    alert("Vui lòng đăng nhập để thanh toán.");
                    navigate('/login');
                } else {
                    setError('Không thể tải thông tin. Vui lòng thử lại.');
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }, [navigate]);

    // Xử lý thay đổi input form
    const handleChange = (e) => {
        setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
    };

    // Xử lý Đặt Hàng (Không cần sửa logic này)
    const handleSubmitOrder = async (e) => {
        e.preventDefault();
        setIsPlacingOrder(true);
        setError('');

        if (!shippingInfo.name || !shippingInfo.phone || !shippingInfo.address || !shippingInfo.email) {
            setError("Vui lòng điền đầy đủ thông tin giao hàng.");
            setIsPlacingOrder(false);
            return;
        }

        try {
            // Backend OrderService đã được nâng cấp
            // Nó sẽ tự đọc giỏ hàng, trừ kho variant, và xóa giỏ hàng
            const response = await OrderService.placeOrder(shippingInfo);

            console.log("Đặt hàng thành công:", response.data);
            window.dispatchEvent(new CustomEvent('cartUpdated'));

            navigate('/order-success', {
                replace: true, 
                state: { order: response.data } 
            });

        } catch (err) {
            console.error("Lỗi khi đặt hàng:", err);
            // Hiển thị lỗi từ backend (ví dụ: "Sản phẩm... không đủ hàng")
            setError(err.response?.data?.message || "Đã xảy ra lỗi khi đặt hàng. Vui lòng thử lại.");
            setIsPlacingOrder(false); 
        }
    };

    // --- RENDER ---
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50 pt-20">
                <p className="text-xl text-gray-600 animate-pulse">Đang tải trang thanh toán...</p>
            </div>
        );
    }

    if (error && !cart) {
        return (
            <div className="container mx-auto px-4 py-20 text-center pt-28">
                <p className="text-red-600 font-semibold mb-4">{error}</p>
                <Link to="/" className="text-blue-600 hover:underline inline-flex items-center">
                    <ArrowLeft size={16} className="mr-1" /> Quay lại trang chủ
                </Link>
            </div>
        );
    }

    if (!cart) { return null; } 

    return (
        <div className="bg-gray-50 min-h-screen pt-24 md:pt-28">
            <div className="container mx-auto pb-16 px-4 lg:px-6">

                <Link to="/cart" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors group mb-6">
                    <ArrowLeft size={16} className="mr-1.5 transition-transform duration-200 group-hover:-translate-x-1" />
                    Quay lại giỏ hàng
                </Link>

                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center font-serif">
                    Thanh Toán
                </h1>

                <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">

                    {/* Cột trái: Thông tin giao hàng */}
                    <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6 md:p-8">
                        <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-4 mb-6">
                            Thông tin giao hàng
                        </h2>

                        {/* Hiển thị lỗi đặt hàng */}
                        {error && (
                            <div className="mb-6 p-3 bg-red-100 text-red-700 text-sm rounded text-center">
                                {error}
                            </div>
                        )}

                        <div className="space-y-5">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">Họ và tên</label>
                                <input type="text" id="name" name="name" value={shippingInfo.name} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-900" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                                    <input type="email" id="email" name="email" value={shippingInfo.email} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-900" />
                                </div>
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">Số điện thoại</label>
                                    <input type="tel" id="phone" name="phone" value={shippingInfo.phone} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-900" />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1.5">Địa chỉ nhận hàng</label>
                                <input type="text" id="address" name="address" value={shippingInfo.address} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-900" placeholder="Số nhà, tên đường, phường/xã, quận/huyện..." />
                            </div>
                        </div>
                    </div>

                    {/* Cột phải: Tóm tắt đơn hàng (Sticky) */}
                    <div className="lg:col-span-1 lg:sticky lg:top-28">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-4 mb-4">
                                Đơn Hàng ({cart.totalItems} sản phẩm)
                            </h2>

                            <div className="space-y-4 max-h-64 overflow-y-auto mb-4 pr-2 custom-scrollbar">
                                {cart.items.map(item => (
                                    <div key={item.id} className="flex items-center gap-4">
                                        <div className="flex-shrink-0 relative">
                                            <img
                                                src={FileUploadService.getImageUrl(item.productImage, "products")}
                                                alt={item.productName}
                                                className="w-16 h-16 object-cover rounded border border-gray-100"
                                            />
                                            <span className="absolute -top-2 -right-2 bg-gray-700 text-white text-xs font-semibold w-5 h-5 rounded-full flex items-center justify-center">
                                                {item.quantity}
                                            </span>
                                        </div>
                                        <div className="flex-grow">
                                            <p className="text-sm font-medium text-gray-800 line-clamp-1">{item.productName}</p>
                                            
                                            {/* === THÊM HIỂN THỊ SIZE === */}
                                            <p className="text-xs text-gray-500">
                                                Size: {item.size}
                                            </p>
                                            
                                            <p className="text-xs text-gray-500">{item.price.toLocaleString('vi-VN')} VNĐ</p>
                                        </div>
                                        <p className="text-sm font-semibold text-gray-800 whitespace-nowrap">
                                            {item.subtotal.toLocaleString('vi-VN')} VNĐ
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Tổng tiền */}
                            <div className="space-y-3 pt-4 border-t border-gray-200">
                                <div className="flex justify-between text-gray-700">
                                    <span>Tạm tính:</span>
                                    <span className="font-medium">{cart.totalPrice.toLocaleString('vi-VN')} VNĐ</span>
                                </div>
                                <div className="flex justify-between text-gray-700">
                                    <span>Phí vận chuyển:</span>
                                    <span className="font-medium text-green-600">Miễn phí</span>
                                </div>
                                <div className="flex justify-between text-gray-900 text-lg font-bold pt-4 border-t mt-2">
                                    <span>Tổng cộng:</span>
                                    <span>{cart.totalPrice.toLocaleString('vi-VN')} VNĐ</span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full mt-6 bg-gray-900 hover:bg-black text-white text-sm font-semibold py-3 px-8 rounded transition duration-300 disabled:opacity-50"
                                disabled={isPlacingOrder || loading}
                            >
                                {isPlacingOrder ? 'Đang xử lý...' : 'Hoàn tất đặt hàng'}
                            </button>
                            <p className="text-xs text-gray-500 mt-4 flex items-center justify-center">
                                <Lock size={12} className="mr-1.5" /> Thông tin của bạn được bảo mật
                            </p>
                        </div>
                    </div>
                </form>

            </div>
        </div>
    );
}