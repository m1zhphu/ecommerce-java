// src/pages/PrivacyPolicy.jsx

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
    
    // Tự động cuộn lên đầu trang khi truy cập
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        // Thêm pt-32 (padding-top) để nội dung không bị header che
        <div className="bg-white pt-32 pb-24"> 
            <div className="container mx-auto px-4 lg:px-6">
                
                {/* Sử dụng 'prose' để tự động định dạng văn bản (h1, p, ul)
                  'max-w-4xl' và 'mx-auto' để căn giữa và giới hạn chiều rộng 
                */}
                <article className="prose prose-lg max-w-4xl mx-auto">
                    
                    {/* Tiêu đề chính */}
                    <h1 className="font-serif">Chính sách Bảo mật</h1>
                    <p className="text-sm text-gray-500">Cập nhật lần cuối: 04/11/2025</p>

                    <p>Chào mừng bạn đến với Minh Phu Shop. Chúng tôi cam kết bảo vệ thông tin cá nhân của khách hàng. Vui lòng đọc kỹ chính sách bảo mật dưới đây để hiểu rõ hơn về cách chúng tôi thu thập, sử dụng và bảo vệ thông tin của bạn.</p>
                    
                    <h2 className="font-serif">1. Thông tin chúng tôi thu thập</h2>
                    <p>Chúng tôi có thể thu thập các loại thông tin sau:</p>
                    <ul>
                        <li><strong>Thông tin cá nhân:</strong> Họ tên, địa chỉ email, số điện thoại, địa chỉ giao hàng khi bạn đăng ký tài khoản hoặc đặt hàng.</li>
                        <li><strong>Thông tin giao dịch:</strong> Chi tiết đơn hàng, lịch sử mua hàng, thông tin thanh toán (được mã hóa).</li>
                        <li><strong>Thông tin kỹ thuật:</strong> Địa chỉ IP, loại trình duyệt, cookie, và dữ liệu duyệt web khi bạn tương tác với trang web của chúng tôi.</li>
                    </ul>

                    <h2 className="font-serif">2. Cách chúng tôi sử dụng thông tin</h2>
                    <p>Thông tin của bạn được sử dụng cho các mục đích sau:</p>
                    <ul>
                        <li>Xử lý đơn hàng, xác nhận thanh toán và giao hàng.</li>
                        <li>Liên lạc và hỗ trợ khách hàng khi có vấn đề phát sinh.</li>
                        <li>Gửi các thông báo về chương trình khuyến mãi, sản phẩm mới (nếu bạn đồng ý nhận email marketing).</li>
                        <li>Cải thiện trải nghiệm người dùng và nâng cấp dịch vụ, bảo mật website.</li>
                    </ul>

                    <h2 className="font-serif">3. Chia sẻ thông tin</h2>
                    <p>Minh Phu Shop cam kết không bán hoặc chia sẻ thông tin cá nhân của bạn cho bên thứ ba không liên quan, ngoại trừ các trường hợp sau:</p>
                    <ul>
                        <li><strong>Đối tác vận chuyển:</strong> Để giao hàng đến cho bạn.</li>
                        <li><strong>Cổng thanh toán:</strong> Để xử lý giao dịch thanh toán của bạn.</li>
                        <li><strong>Yêu cầu pháp lý:</strong> Khi có yêu cầu từ các cơ quan nhà nước có thẩm quyền.</li>
                    </ul>

                    <h2 className="font-serif">4. Bảo mật dữ liệu</h2>
                    <p>Chúng tôi áp dụng các biện pháp kỹ thuật và tổ chức để bảo vệ dữ liệu cá nhân của bạn. Dữ liệu của bạn được lưu trữ trên máy chủ an toàn và các giao dịch thanh toán được mã hóa bằng công nghệ SSL.</p>

                    <h2 className="font-serif">5. Quyền của bạn</h2>
                    <p>Bạn có quyền truy cập, sửa đổi hoặc yêu cầu xóa thông tin cá nhân của mình bất kỳ lúc nào bằng cách đăng nhập vào tài khoản hoặc liên hệ với chúng tôi.</p>

                    <h2 className="font-serif">6. Thay đổi chính sách</h2>
                    <p>Chúng tôi có thể cập nhật chính sách này theo thời gian. Mọi thay đổi sẽ được thông báo trên trang web. Phiên bản mới nhất sẽ luôn có sẵn trên trang này.</p>

                    <h2 className="font-serif">7. Liên hệ</h2>
                    <p>Nếu bạn có bất kỳ câu hỏi nào về chính sách bảo mật này, vui lòng liên hệ với chúng tôi qua trang <Link to="/contact">Liên hệ</Link>.</p>
                </article>

            </div>
        </div>
    );
}