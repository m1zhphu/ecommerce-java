// src/pages/OrderSuccessPage.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, ArrowLeft } from 'lucide-react';

export default function OrderSuccessPage() {
    const location = useLocation();
    // Lấy thông tin đơn hàng được truyền từ trang Checkout (nếu có)
    const order = location.state?.order; 

    return (
        <div className="bg-gray-50 min-h-screen pt-24 md:pt-28">
            <div className="container mx-auto pb-16 px-4 lg:px-6">
                <div className="max-w-lg mx-auto bg-white rounded-lg shadow-sm p-8 md:p-12 text-center">
                    
                    {/* Icon thành công */}
                    <CheckCircle size={72} className="text-green-500 mx-auto mb-6" strokeWidth={1.5} />

                    {/* Tiêu đề */}
                    <h1 className="text-3xl font-bold font-serif text-gray-900 mb-4">
                        Đặt hàng thành công!
                    </h1>
                    
                    <p className="text-gray-600 mb-8">
                        Cảm ơn bạn đã mua sắm tại Minh Phu Shop. Đơn hàng của bạn đang được xử lý và sẽ sớm được giao đến bạn.
                    </p>

                    {/* Hiển thị mã đơn hàng (nếu có) */}
                    {order && order.id && (
                        <div className="mb-8 p-4 bg-gray-100 rounded-md">
                            <p className="text-sm text-gray-600">Mã đơn hàng của bạn:</p>
                            <p className="text-lg font-bold text-gray-900">#MP-{order.id}</p> 
                        </div>
                    )}

                    {/* Nút quay lại */}
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link 
                            to="/" 
                            className="inline-flex items-center justify-center bg-gray-900 hover:bg-black text-white text-sm font-semibold py-3 px-6 rounded transition duration-300"
                        >
                            <ArrowLeft size={16} className="mr-1.5" />
                            Tiếp tục mua sắm
                        </Link>
                         {/* Nút xem lịch sử đơn hàng (tùy chọn) */}
                        {/* <Link 
                            to="/account/orders" 
                            className="inline-flex items-center justify-center bg-white border border-gray-300 text-gray-700 text-sm font-semibold py-3 px-6 rounded hover:bg-gray-100 transition duration-300"
                        >
                            Xem lịch sử đơn hàng
                        </Link> */}
                    </div>
                </div>
            </div>
        </div>
    );
}