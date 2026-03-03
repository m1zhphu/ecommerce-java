// src/pages/CartPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CartService from '../../api/CartService.js';
import { Plus, Minus, X, ArrowLeft, ShoppingCart } from 'lucide-react';
import FileUploadService from '../../api/FileUploadService.js';

export default function CartPage() {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [updatingItemId, setUpdatingItemId] = useState(null);
    const navigate = useNavigate();

    // Hàm để tải lại giỏ hàng
    const fetchCartDetails = () => {
        setLoading(true);
        setError('');
        CartService.getCartDetails()
            .then(response => {
                setCart(response.data);
            })
            .catch(err => {
                console.error("Lỗi khi tải giỏ hàng:", err);
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    alert("Vui lòng đăng nhập để xem giỏ hàng.");
                    navigate('/login');
                } else {
                    setError('Không thể tải giỏ hàng. Vui lòng thử lại.');
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    // Tải giỏ hàng khi component được mount
    useEffect(() => {
        fetchCartDetails();
    }, [navigate]);


    // Hàm xử lý xóa sản phẩm
    const handleRemoveItem = (cartItemId) => {
        if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?")) {
            return;
        }
        setUpdatingItemId(cartItemId);
        CartService.removeCartItem(cartItemId)
            .then(() => {
                fetchCartDetails();
                window.dispatchEvent(new CustomEvent('cartUpdated')); // Gửi sự kiện cập nhật header
            })
            .catch(err => {
                console.error("Lỗi khi xóa item:", err);
                alert("Đã xảy ra lỗi khi xóa sản phẩm.");
            })
            .finally(() => {
                setUpdatingItemId(null);
            });
    };

    // Hàm xử lý cập nhật số lượng
    const handleUpdateQuantity = (cartItemId, newQuantity, item) => { // Thêm 'item'
        if (newQuantity < 1) {
            handleRemoveItem(cartItemId);
            return;
        }

        setUpdatingItemId(cartItemId);
        CartService.updateCartItem(cartItemId, newQuantity)
            .then(() => {
                fetchCartDetails();
                window.dispatchEvent(new CustomEvent('cartUpdated')); // Gửi sự kiện cập nhật header
            })
            .catch(err => {
                console.error("Lỗi khi cập nhật số lượng:", err);
                // Hiển thị lỗi tồn kho từ backend
                alert(err.response?.data?.message || "Đã xảy ra lỗi khi cập nhật số lượng.");
                
                // Rollback state ở frontend (nếu gọi lại fetchCartDetails bị chậm)
                setCart(prevCart => ({
                    ...prevCart,
                    items: prevCart.items.map(i => 
                        i.id === cartItemId ? { ...i, quantity: item.quantity } : i // Hoàn lại số lượng cũ
                    )
                }));
            })
            .finally(() => {
                setUpdatingItemId(null);
            });
    };

    // --- RENDER ---

    if (loading && !cart) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50 pt-20">
                <p className="text-xl text-gray-600 animate-pulse">Đang tải giỏ hàng...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-20 text-center pt-28">
                <p className="text-red-600 font-semibold mb-4">{error}</p>
                <Link to="/" className="text-blue-600 hover:underline inline-flex items-center">
                    <ArrowLeft size={16} className="mr-1" /> Quay lại trang chủ
                </Link>
            </div>
        );
    }

    if (!cart || cart.items.length === 0) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 pt-20 text-center px-4">
                <ShoppingCart size={80} className="text-gray-300 mb-6" strokeWidth={1} />
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Giỏ hàng của bạn đang trống</h1>
                <p className="text-gray-600 mb-8">Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm nhé!</p>
                <Link to="/" className="inline-block bg-gray-800 text-white px-8 py-3 rounded text-sm font-medium hover:bg-black transition-colors">
                    Tiếp tục mua sắm
                </Link>
            </div>
        );
    }

    // --- RENDER GIỎ HÀNG CÓ SẢN PHẨM ---
    return (
        <div className="bg-gray-50 min-h-screen pt-24 md:pt-28">
            <div className="container mx-auto pb-16 px-4 lg:px-6">

                <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-8 text-center">
                    Giỏ Hàng
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                    {/* Cột trái: Danh sách sản phẩm */}
                    <div className="lg:col-span-2 bg-white rounded-lg shadow-sm divide-y divide-gray-200">
                        {cart.items.map(item => (
                            <div
                                key={item.id}
                                className={`flex items-start gap-4 p-4 md:p-6 ${updatingItemId === item.id ? 'opacity-50' : ''}`}
                            >
                                {/* Ảnh */}
                                <Link to={`/product/${item.productId}`} className="flex-shrink-0">
                                    <img
                                        src={FileUploadService.getImageUrl(item.productImage, "products")}
                                        alt={item.productName}
                                        className="w-20 h-24 md:w-24 md:h-28 object-cover rounded-md border border-gray-100"
                                    />
                                </Link>

                                {/* Thông tin sản phẩm */}
                                <div className="flex-grow">
                                    <Link to={`/product/${item.productId}`} className="font-semibold text-gray-800 hover:text-black transition-colors line-clamp-2">
                                        {item.productName}
                                    </Link>
                                    
                                    {/* === THÊM HIỂN THỊ SIZE === */}
                                    <p className="text-sm text-gray-500 mt-1">
                                        Size: <span className="font-medium text-gray-700">{item.size}</span>
                                    </p>
                                    
                                    <p className="text-sm text-gray-500 mt-1">
                                        Giá: {item.price.toLocaleString('vi-VN')} VNĐ
                                    </p>

                                    {/* Bộ chọn số lượng */}
                                    <div className="flex items-center border border-gray-300 rounded w-fit mt-3">
                                        <button
                                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1, item)}
                                            disabled={updatingItemId === item.id}
                                            className="px-2.5 py-1.5 text-gray-600 hover:bg-gray-100 rounded-l transition disabled:opacity-50"
                                        >
                                            <Minus size={14} />
                                        </button>
                                        <input
                                            type="number"
                                            value={item.quantity}
                                            readOnly
                                            className="h-full border-l border-r border-gray-300 w-10 text-center text-sm focus:outline-none"
                                        />
                                        <button
                                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1, item)}
                                            disabled={updatingItemId === item.id}
                                            className="px-2.5 py-1.5 text-gray-600 hover:bg-gray-100 rounded-r transition disabled:opacity-50"
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </div>
                                </div>

                                {/* Thành tiền và nút Xóa */}
                                <div className="flex flex-col items-end justify-between h-full ml-4">
                                    <p className="font-semibold text-gray-900 text-right">
                                        {item.subtotal.toLocaleString('vi-VN')} VNĐ
                                    </p>
                                    <button
                                        onClick={(e) => { 
                                            e.preventDefault(); 
                                            handleRemoveItem(item.id);
                                        }}
                                        disabled={updatingItemId === item.id}
                                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                        title="Xóa sản phẩm"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Cột phải: Tóm tắt đơn hàng (Sticky) */}
                    <div className="lg:col-span-1 lg:sticky lg:top-28">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-semibold text-gray-900 border-b pb-4 mb-4">
                                Tóm Tắt Đơn Hàng
                            </h2>
                            <div className="space-y-3">
                                <div className="flex justify-between text-gray-700">
                                    <span>Tổng số sản phẩm:</span>
                                    <span className="font-medium">{cart.totalItems}</span>
                                </div>
                                <div className="flex justify-between text-gray-900 text-lg font-bold pt-4 border-t mt-4">
                                    <span>Tổng tiền:</span>
                                    <span>{cart.totalPrice.toLocaleString('vi-VN')} VNĐ</span>
                                </div>
                            </div>

                            <Link
                                to="/checkout"
                                className="block w-full mt-6 bg-gray-900 hover:bg-black text-white text-sm font-semibold py-3 px-8 rounded transition duration-300 text-center"
                            >
                                Tiến hành thanh toán
                            </Link>

                            <Link to="/" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors group mt-6">
                                <ArrowLeft size={16} className="mr-1.5 transition-transform duration-200 group-hover:-translate-x-1" />
                                Tiếp tục mua sắm
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}