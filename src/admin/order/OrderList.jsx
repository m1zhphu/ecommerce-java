
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, ShieldAlert } from 'lucide-react';
import OrderService from '../../api/OrderService';

// --- BẮT ĐẦU PHẦN BỊ THIẾU ---
// Hàm helper định dạng ngày
const formatDate = (dateString) => {
    if (!dateString) return 'N/A'; // Trả về 'N/A' nếu dữ liệu là null
    try {
        return new Intl.DateTimeFormat('vi-VN', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        }).format(new Date(dateString));
    } catch (e) {
        console.error("Lỗi định dạng ngày:", e);
        return dateString; // Trả về chuỗi gốc nếu lỗi
    }
};

// Hàm helper định dạng tiền
const formatCurrency = (amount) => {
    if (typeof amount !== 'number') return '0 VNĐ'; // Trả về '0 VNĐ' nếu dữ liệu là null/undefined
    return amount.toLocaleString('vi-VN') + ' VNĐ';
};
// --- KẾT THÚC PHẦN BỊ THIẾU ---


// --- Component chính ---
export default function AdminOrderListPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        document.title = "Quản Lý Đơn Hàng";
        fetchOrders();
    }, []);

    const fetchOrders = () => {
        setLoading(true);
        OrderService.getAllOrders()
            .then(response => {
                setOrders(response.data);
                setError('');
            })
            .catch(err => {
                console.error("Lỗi khi tải danh sách đơn hàng:", err);
                if (err.response && (err.response.status === 403 || err.response.status === 401)) {
                    setError("Lỗi 403: Bạn không có quyền truy cập trang này. Vui lòng đăng nhập bằng tài khoản Admin.");
                } else {
                    setError("Không thể tải danh sách đơn hàng. Vui lòng thử lại.");
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    if (loading) {
        // Giữ lại container cho các trạng thái loading/error để căn giữa
        return <div className="container mx-auto p-6 pt-28 text-center animate-pulse">Đang tải đơn hàng...</div>;
    }

    if (error) {
        // Giữ lại container cho các trạng thái loading/error
        return (
            <div className="container mx-auto p-6 pt-28 max-w-2xl">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative" role="alert">
                    <strong className="font-bold mr-2 inline-flex items-center"><ShieldAlert size={20} className="mr-1"/> Lỗi! </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            </div>
        );
    }

    // Các class như container, p-6, pt-28 nên ở file AdminLayout.jsx
    return (
        <> 
            <h1 className="text-3xl font-bold mb-6 font-serif text-gray-900">Quản Lý Đơn Hàng ({orders.length})</h1>
            
            {orders.length === 0 ? (
                <p className="text-gray-600">Không có đơn hàng nào.</p>
            ) : (
                <div className="bg-white shadow-sm rounded-lg overflow-x-auto">
                    <table className="w-full min-w-[800px]">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left text-xs font-semibold text-gray-600 uppercase p-4">ID</th>
                                <th className="text-left text-xs font-semibold text-gray-600 uppercase p-4">Khách Hàng</th>
                                <th className="text-left text-xs font-semibold text-gray-600 uppercase p-4">Ngày Đặt</th>
                                <th className="text-left text-xs font-semibold text-gray-600 uppercase p-4">Tổng Tiền</th>
                                <th className="text-left text-xs font-semibold text-gray-600 uppercase p-4">Trạng Thái</th>
                                <th className="text-center text-xs font-semibold text-gray-600 uppercase p-4">Hành Động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {orders.map(order => (
                                <tr key={order.id} className="hover:bg-gray-50">
                                    <td className="p-4 text-sm font-medium text-gray-800">#{order.id}</td>
                                    <td className="p-4 text-sm text-gray-700">
                                        <div>{order.customerName}</div>
                                        <div className="text-xs text-gray-500">{order.phone}</div>
                                    </td>
                                    {/* Các dòng này giờ sẽ hoạt động vì đã có hàm helper */}
                                    <td className="p-4 text-sm text-gray-700">{formatDate(order.orderDate)}</td>
                                    <td className="p-4 text-sm font-semibold text-red-600">{formatCurrency(order.totalPrice)}</td>
                                    
                                    <td className="p-4 text-sm">
                                        {/* Cập nhật logic status để bao gồm các trạng thái mới */}
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium 
                                            ${order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                                             order.status === 'CONFIRMED' ? 'bg-cyan-100 text-cyan-800' :
                                             order.status === 'SHIPPING' ? 'bg-blue-100 text-blue-800' :
                                             order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                             order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                                             'bg-gray-100 text-gray-800'}`}>
                                            {order.status || 'N/A'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center">
                                        <Link 
                                            to={`/admin/orders/${order.id}`}
                                            className="text-blue-600 hover:text-blue-800 inline-flex items-center"
                                            title="Xem chi tiết"
                                        >
                                            <Eye size={18} />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
}