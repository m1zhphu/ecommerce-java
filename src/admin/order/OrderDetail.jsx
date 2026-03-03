// src/pages/admin/AdminOrderDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
// Thêm icon CheckCircle để báo thành công
import { ArrowLeft, ShieldAlert, User, ShoppingCart, MapPin, Package, CheckCircle } from 'lucide-react'; 
import OrderService from '../../api/OrderService';
import FileUploadService from '../../api/FileUploadService';

// --- Các hàm helper (Giữ nguyên) ---
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        return new Intl.DateTimeFormat('vi-VN', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        }).format(new Date(dateString));
    } catch (e) {
        return dateString;
    }
};

const formatCurrency = (amount) => {
    // Nếu amount không phải là số (ví dụ: null, undefined), nó sẽ hiển thị '0 VNĐ'
    if (typeof amount !== 'number') return '0 VNĐ'; 
    return amount.toLocaleString('vi-VN') + ' VNĐ';
};
// --------------------------------------------------------------------

// --- DANH SÁCH TRẠNG THÁI (Bạn có thể sửa đổi cho phù hợp) ---
const ORDER_STATUSES = [
    "PENDING",    // Đang chờ xử lý
    "CONFIRMED",  // Đã xác nhận
    "SHIPPING",   // Đang giao hàng
    "COMPLETED",  // Đã hoàn thành
    "CANCELLED"   // Đã hủy
];

export default function AdminOrderDetailPage() {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // --- State mới cho việc cập nhật ---
    const [selectedStatus, setSelectedStatus] = useState(''); // Trạng thái đang chọn trong dropdown
    const [isUpdating, setIsUpdating] = useState(false);       // Trạng thái loading khi nhấn "Lưu"
    const [updateError, setUpdateError] = useState('');     // Lỗi khi cập nhật
    const [updateSuccess, setUpdateSuccess] = useState(false); // Báo thành công

    useEffect(() => {
        if (!orderId) return;
        
        document.title = `Chi tiết Đơn hàng #${orderId}`;
        setLoading(true);

        OrderService.getOrderDetailForAdmin(orderId)
            .then(response => {
                setOrder(response.data);
                setSelectedStatus(response.data.status); // <-- Set trạng thái ban đầu cho dropdown
                setError('');
            })
            .catch(err => {
                console.error(`Lỗi khi tải đơn hàng #${orderId}:`, err);
                if (err.response && (err.response.status === 403 || err.response.status === 401)) {
                    setError("Lỗi 403: Bạn không có quyền truy cập đơn hàng này.");
                } else if (err.response && err.response.status === 404) {
                    setError("Không tìm thấy đơn hàng này.");
                } else {
                    setError("Không thể tải chi tiết đơn hàng.");
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }, [orderId]);

    // --- HÀM MỚI: Xử lý cập nhật trạng thái ---
    const handleStatusUpdate = () => {
        if (selectedStatus === order.status) {
            setUpdateError("Bạn chưa chọn trạng thái mới.");
            return;
        }

        setIsUpdating(true);
        setUpdateError('');
        setUpdateSuccess(false);

        // Gọi API từ OrderService
        OrderService.updateOrderStatus(order.id, selectedStatus)
            .then(response => {
                // Cập nhật thành công!
                setOrder(response.data); // Cập nhật order local
                setSelectedStatus(response.data.status); // Cập nhật dropdown
                setUpdateSuccess(true); // Hiển thị thông báo thành công
                setTimeout(() => setUpdateSuccess(false), 2500); // Ẩn sau 2.5s
            })
            .catch(err => {
                console.error("Lỗi cập nhật trạng thái:", err);
                setUpdateError(err.response?.data?.message || "Cập nhật thất bại. Vui lòng thử lại.");
                // Hoàn lại dropdown về trạng thái cũ
                setSelectedStatus(order.status);
            })
            .finally(() => {
                setIsUpdating(false);
            });
    };

    if (loading) {
        return <div className="container mx-auto p-6 pt-28 text-center animate-pulse">Đang tải chi tiết đơn hàng #{orderId}...</div>;
    }

    if (error) {
        return (
            <div className="container mx-auto p-6 pt-28 max-w-2xl">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative" role="alert">
                    <strong className="font-bold mr-2 inline-flex items-center"><ShieldAlert size={20} className="mr-1"/> Lỗi! </strong>
                    <span className="block sm:inline">{error}</span>
                    <div className="mt-4">
                        <Link to="/admin/orders" className="inline-flex items-center text-sm text-gray-700 hover:text-black group">
                            <ArrowLeft size={14} className="mr-1 group-hover:-translate-x-1 transition-transform" />
                            Quay lại danh sách
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
    
    if (!order) return null;

    return (
        <div className="max-w-5xl mx-auto"> 
            <div className="mb-6">
                <Link 
                    to="/admin/orders"
                    className="inline-flex items-center text-sm text-gray-700 hover:text-black group"
                >
                    <ArrowLeft size={16} className="mr-1.5 group-hover:-translate-x-1 transition-transform" />
                    Quay lại danh sách
                </Link>
            </div>

            {/* Header trang: ID và Status */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
                <h1 className="text-3xl font-bold font-serif text-gray-900 mb-2 sm:mb-0">
                    Đơn hàng #{order.id}
                </h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium 
                    ${order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                     order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                     order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                     'bg-blue-100 text-blue-800'}`}>
                    Trạng thái: {order.status}
                </span>
            </div>

            {/* Grid layout cho thông tin và tổng tiền */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                
                {/* Cột chính: Thông tin khách hàng và Giao hàng */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Thông tin khách hàng */}
                    <div className="bg-white p-6 shadow-sm rounded-lg">
                        <h2 className="text-xl font-semibold mb-4 border-b pb-3 flex items-center">
                            <User size={20} className="mr-2 text-gray-500"/>
                            Thông tin khách hàng
                        </h2>
                        <div className="space-y-2 text-sm text-gray-700">
                            <p><strong>Tên:</strong> {order.customerName}</p>
                            <p><strong>Email:</strong> {order.email}</p>
                            <p><strong>Điện thoại:</strong> {order.phone}</p>
                            <p><strong>Ngày đặt:</strong> {formatDate(order.orderDate)}</p>
                        </div>
                    </div>

                    {/* Thông tin giao hàng */}
                    <div className="bg-white p-6 shadow-sm rounded-lg">
                        <h2 className="text-xl font-semibold mb-4 border-b pb-3 flex items-center">
                            <MapPin size={20} className="mr-2 text-gray-500"/>
                            Địa chỉ giao hàng
                        </h2>
                        <p className="text-sm text-gray-700">{order.address}</p>
                    </div>
                </div>

                {/* Cột phụ: Tổng quan đơn hàng (Đã cập nhật) */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 shadow-sm rounded-lg sticky top-28">
                        <h2 className="text-xl font-semibold mb-4 border-b pb-3 flex items-center">
                            <ShoppingCart size={20} className="mr-2 text-gray-500"/>
                            Tổng quan
                        </h2>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between text-gray-700">
                                <span>Tạm tính:</span>
                                <span>{formatCurrency(order.totalPrice)}</span>
                            </div>
                            <div className="flex justify-between text-gray-700">
                                <span>Phí vận chuyển:</span>
                                <span className="font-medium text-green-600">Miễn phí</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold pt-3 border-t mt-2 text-gray-900">
                                <span>Tổng cộng:</span>
                                <span className="text-red-600">{formatCurrency(order.totalPrice)}</span>
                            </div>
                        </div>
                        
                        {/* --- BẮT ĐẦU KHU VỰC CẬP NHẬT --- */}
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <label htmlFor="status-select" className="block text-sm font-medium text-gray-700 mb-2">
                                Cập nhật trạng thái
                            </label>
                            <div className="flex gap-2">
                                <select
                                    id="status-select"
                                    value={selectedStatus}
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                    className="flex-grow w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-900 text-sm"
                                    disabled={isUpdating}
                                >
                                    {ORDER_STATUSES.map(status => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </select>
                                <button
                                    type="button"
                                    onClick={handleStatusUpdate}
                                    disabled={isUpdating || selectedStatus === order.status}
                                    className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-black transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isUpdating ? '...' : 'Lưu'}
                                </button>
                            </div>
                            
                            {/* Thông báo lỗi hoặc thành công */}
                            {updateError && (
                                <p className="text-red-600 text-xs mt-2">{updateError}</p>
                            )}
                            {updateSuccess && (
                                <p className="text-green-600 text-xs mt-2 flex items-center">
                                    <CheckCircle size={14} className="mr-1" />
                                    Cập nhật thành công!
                                </p>
                            )}
                        </div>
                        {/* --- KẾT THÚC KHU VỰC CẬP NHẬT --- */}
                        
                    </div>
                </div>
            </div>

            {/* Danh sách sản phẩm trong đơn hàng */}
            <div className="bg-white p-6 shadow-sm rounded-lg">
                <h2 className="text-xl font-semibold mb-4 border-b pb-3 flex items-center">
                    <Package size={20} className="mr-2 text-gray-500"/>
                    Các sản phẩm trong đơn ({order.orderDetails.length})
                </h2>
                <div className="divide-y divide-gray-200">
                    {order.orderDetails.map(item => (
                        <div key={item.id} className="flex items-center gap-4 py-4">
                            <img 
                                src={FileUploadService.getImageUrl(item.productImage, "products")} 
                                alt={item.productName}
                                className="w-20 h-20 object-cover rounded-md border"
                            />
                            <div className="flex-grow">
                                <p className="font-semibold text-gray-900 line-clamp-1">{item.productName}</p>
                                <p className="text-sm text-gray-600">Size: <span className="font-medium">{item.size}</span></p>
                                <p className="text-sm text-gray-600">ID Sản phẩm: {item.productId}</p>
                                <p className="text-sm text-gray-500">
                                    Giá: {formatCurrency(item.price)}
                                </p>
                            </div>
                            <div className="text-sm text-gray-600">
                                x {item.quantity}
                            </div>
                            <div className="text-right w-24">
                                {/* Dùng item.subtotal từ DTO */}
                                <p className="font-semibold text-gray-900">{formatCurrency(item.subtotal)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}