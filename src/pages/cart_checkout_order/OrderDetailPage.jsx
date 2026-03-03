// src/pages/OrderDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import OrderService from '../../api/OrderService';
import FileUploadService from '../../api/FileUploadService';
import { ArrowLeft, Clock } from 'lucide-react';

export default function OrderDetailPage() {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { orderId } = useParams();
    const navigate = useNavigate();

    const statusMap = {
        'PENDING': { label: 'Chờ xác nhận', color: 'text-yellow-600 bg-yellow-100' },
        'CONFIRMED': { label: 'Đã xác nhận', color: 'text-cyan-600 bg-cyan-100' },
        'SHIPPING': { label: 'Đang giao', color: 'text-blue-600 bg-blue-100' },
        'COMPLETED': { label: 'Hoàn thành', color: 'text-green-600 bg-green-100' },
        'CANCELLED': { label: 'Đã hủy', color: 'text-red-600 bg-red-100' }, // Sửa CANCELED
        'DEFAULT': { label: 'Không rõ', color: 'text-gray-600 bg-gray-100' },
    };

    useEffect(() => {
        setLoading(true);
        OrderService.getOrderDetailById(orderId)
            .then(response => {
                setOrder(response.data);
            })
            .catch(err => {
                console.error("Lỗi khi tải chi tiết đơn hàng:", err);
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    navigate('/login');
                } else if (err.response && err.response.status === 404) {
                    setError(`Không tìm thấy đơn hàng #${orderId}.`);
                } else {
                    setError("Không thể tải chi tiết đơn hàng.");
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }, [orderId, navigate]);

    // --- RENDER CHECK ---
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50 pt-20">
                <p className="text-xl text-gray-600 animate-pulse">Đang tải chi tiết đơn hàng...</p>
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
    if (!order) { return null; }

    const status = statusMap[order.status] || statusMap.DEFAULT;
    const formattedDate = new Date(order.orderDate).toLocaleDateString('vi-VN', {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    return (
        <div className="bg-gray-50 min-h-screen pt-24 md:pt-28">
            <div className="container mx-auto pb-16 px-4 lg:px-6">

                <div className="mb-12 pt-4 relative flex justify-center h-10">
                    <Link
                        to="/account/orders"
                        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors group absolute left-0 top-1/2 transform -translate-y-1/2 hidden md:flex"
                    >
                        <ArrowLeft size={16} className="mr-1.5 transition-transform duration-200 group-hover:-translate-x-1" />
                        Quay lại Lịch sử
                    </Link>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-center font-serif absolute top-1/2 transform -translate-y-1/2">
                        Chi Tiết Đơn Hàng #{order.id}
                    </h1>
                </div>

                <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                    {/* Cột trái: Chi tiết sản phẩm */}
                    <div className="lg:col-span-2 bg-white rounded-lg shadow-md divide-y divide-gray-200 p-6 md:p-8">
                        <h2 className="text-xl font-semibold text-gray-900 border-b pb-3 mb-4">Sản phẩm đã mua</h2>

                        <div className="space-y-4">
                            {order.orderDetails && order.orderDetails.map(detail => (
                                <div key={detail.id} className="flex items-start py-3 gap-4">
                                    <div className="flex-shrink-0">
                                        <img
                                            src={FileUploadService.getImageUrl(detail.productImage, "products")}
                                            alt={detail.productName}
                                            className="w-16 h-16 object-cover rounded-md border"
                                            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/80/F3F4F6/9CA3AF?text=No" }}
                                        />
                                    </div>
                                    
                                    {/* --- SỬA Ở ĐÂY --- */}
                                    <div className="flex-grow">
                                        <Link to={`/product/${detail.productId}`} className="text-base font-semibold text-gray-900 hover:text-blue-600">{detail.productName}</Link>
                                        
                                        {/* THÊM DÒNG NÀY ĐỂ HIỂN THỊ SIZE */}
                                        <p className="text-sm text-gray-500 mt-1">Size: {detail.size}</p>
                                        
                                        <p className="text-sm text-gray-500 mt-1">Giá: {detail.price.toLocaleString('vi-VN')} VNĐ</p>
                                    </div>
                                    {/* --- KẾT THÚC SỬA --- */}

                                    <div className="text-right">
                                        <p className="text-sm font-medium text-gray-600">x{detail.quantity}</p>
                                        <p className="text-base font-bold text-gray-900 mt-1">
                                            {detail.subtotal.toLocaleString('vi-VN')} VNĐ
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Cột phải: Tóm tắt và Thông tin */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-md p-5 mb-5">
                            <p className="text-sm font-semibold mb-3">Trạng thái hiện tại:</p>
                            <span className={`text-base font-bold px-3 py-1 rounded-full ${status.color}`}>
                                {status.label}
                            </span>
                            <div className="mt-4 pt-3 border-t text-sm text-gray-600">
                                <p className="flex justify-between items-center">
                                    Ngày đặt hàng:
                                    <span className="font-medium text-gray-800">{formattedDate}</span>
                                </p>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-5">
                            <h2 className="text-lg font-semibold text-gray-900 border-b pb-3 mb-4">Tổng kết đơn hàng</h2>
                            <div className="space-y-2 text-sm text-gray-700">
                                <p className="flex justify-between">
                                    <span>Tạm tính ({order.orderDetails ? order.orderDetails.length : 0} SP):</span>
                                    <span>{order.totalPrice.toLocaleString('vi-VN')} VNĐ</span>
                                </p>
                                <p className="flex justify-between">
                                    <span>Vận chuyển:</span>
                                    <span className="text-green-600">Miễn phí</span>
                                </p>
                                <p className="flex justify-between text-base font-bold text-gray-900 pt-3 border-t mt-3">
                                    <span>Thành tiền:</span>
                                    <span>{order.totalPrice.toLocaleString('vi-VN')} VNĐ</span>
                                </p>
                            </div>
                            <h3 className="text-base font-semibold mt-6 border-t pt-4 text-gray-800">Thông tin giao nhận</h3>
                            <p className="text-sm mt-2 text-gray-600">Người nhận: {order.customerName}</p>
                            <p className="text-sm text-gray-600">Điện thoại: {order.phone}</p>
                            <p className="text-sm text-gray-600">Địa chỉ: {order.address}</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}