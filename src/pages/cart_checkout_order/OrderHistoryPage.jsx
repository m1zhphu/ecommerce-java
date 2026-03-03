// src/pages/OrderHistoryPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OrderService from '../../api/OrderService';
import { ArrowLeft, Clock, ShoppingBag } from 'lucide-react';

export default function OrderHistoryPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Mapping trạng thái (bao gồm cả các trạng thái mới)
    const statusMap = {
        'PENDING': { label: 'Chờ xác nhận', color: 'text-yellow-600 bg-yellow-100' },
        'CONFIRMED': { label: 'Đã xác nhận', color: 'text-cyan-600 bg-cyan-100' },
        'SHIPPING': { label: 'Đang giao', color: 'text-blue-600 bg-blue-100' },
        'COMPLETED': { label: 'Hoàn thành', color: 'text-green-600 bg-green-100' },
        'CANCELLED': { label: 'Đã hủy', color: 'text-red-600 bg-red-100' }, // Sửa CANCELED
        'DEFAULT': { label: 'Không rõ', color: 'text-gray-600 bg-gray-100' },
    };

    // Tải lịch sử đơn hàng
    useEffect(() => {
        setLoading(true);
        OrderService.getMyOrders()
            .then(response => {
                setOrders(response.data || []);
            })
            .catch(err => {
                console.error('Lỗi khi tải đơn hàng:', err);
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    alert('Vui lòng đăng nhập để xem lịch sử đơn hàng.');
                    navigate('/login');
                } else {
                    setError('Không thể tải lịch sử đơn hàng.');
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }, [navigate]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50 pt-20">
                <p className="text-xl text-gray-600 animate-pulse">Đang tải đơn hàng...</p>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen pt-24 md:pt-28">
            <div className="container mx-auto pb-16 px-4 lg:px-6">
                <div className="mb-12 pt-4 relative flex justify-center h-10">
                    <Link
                        to="/"
                        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors group absolute left-0 top-1/2 transform -translate-y-1/2 hidden md:flex"
                    >
                        <ArrowLeft size={16} className="mr-1.5 transition-transform duration-200 group-hover:-translate-x-1" />
                        Trang chủ
                    </Link>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-center font-serif absolute top-1/2 transform -translate-y-1/2">
                        Lịch Sử Đơn Hàng
                    </h1>
                </div>

                {/* Thông báo lỗi */}
                {error && (
                    <div className="p-3 bg-red-100 text-red-700 text-sm rounded text-center mb-4">
                        {error}
                    </div>
                )}

                {/* Danh sách đơn hàng */}
                {orders.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-lg shadow-sm">
                        <ShoppingBag size={48} className="text-gray-400 mx-auto mb-4" />
                        <p className="text-lg text-gray-600 mb-6">Bạn chưa có đơn hàng nào.</p>
                        <Link
                            to="/products"
                            className="inline-block bg-gray-900 text-white px-6 py-2.5 rounded text-sm font-medium hover:bg-black transition-colors"
                        >
                            Bắt đầu mua sắm
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6 max-w-4xl mx-auto">
                        {orders.map(order => {
                            const status = statusMap[order.status] || statusMap.DEFAULT;
                            const formattedDate = new Date(order.orderDate).toLocaleDateString('vi-VN', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                            });

                            return (
                                <div key={order.id} className="bg-white rounded-lg shadow-md p-5 border border-gray-100">
                                    {/* Header */}
                                    <div className="flex justify-between items-start border-b pb-3 mb-3">
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">Mã Đơn: #{order.id}</p>
                                            <p className="text-xs text-gray-500 flex items-center mt-1">
                                                <Clock size={12} className="mr-1" /> Đặt ngày: {formattedDate}
                                            </p>
                                        </div>
                                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${status.color}`}>
                                            {status.label}
                                        </span>
                                    </div>

                                    {/* === CHI TIẾT SẢN PHẨM (ĐÃ CẬP NHẬT) === */}
                                    <div className="space-y-3">
                                        {order.orderDetails &&
                                            order.orderDetails.slice(0, 3).map(detail => (
                                                <div key={detail.id} className="flex items-center gap-3">
                                                    {/* --- SỬA Ở ĐÂY --- */}
                                                    <div className="flex-grow">
                                                        <p className="text-sm text-gray-700">{detail.productName}</p>
                                                        {/* THÊM DÒNG NÀY ĐỂ HIỂN THỊ SIZE */}
                                                        <p className="text-xs text-gray-500">Size: {detail.size}</p> 
                                                    </div>
                                                    {/* --- KẾT THÚC SỬA --- */}
                                                    <p className="text-sm text-gray-600">x{detail.quantity}</p>
                                                    <p className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                                                        {detail.subtotal.toLocaleString('vi-VN')} VNĐ
                                                    </p>
                                                </div>
                                            ))}

                                        {order.orderDetails && order.orderDetails.length > 3 && (
                                            <p className="text-sm text-gray-500 pt-1 border-t border-dashed">
                                                Và {order.orderDetails.length - 3} sản phẩm khác...
                                            </p>
                                        )}
                                    </div>

                                    {/* Footer */}
                                    <div className="flex justify-between items-center pt-3 mt-3 border-t">
                                        <p className="text-base font-bold text-gray-900">
                                            Tổng tiền: {order.totalPrice.toLocaleString('vi-VN')} VNĐ
                                        </p>
                                        <Link
                                            to={`/account/orders/${order.id}`}
                                            className="text-sm text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                                        >
                                            Xem chi tiết &rarr;
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}