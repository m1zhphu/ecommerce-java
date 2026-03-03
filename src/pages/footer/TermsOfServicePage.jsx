// src/pages/TermsOfServicePage.jsx

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function TermsOfServicePage() {
    
    // Tự động cuộn lên đầu trang khi truy cập
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        // Thêm pt-32 (padding-top) để nội dung không bị header che
        <div className="bg-white pt-32 pb-24"> 
            <div className="container mx-auto px-4 lg:px-6">
                
                {/* Sử dụng 'prose' để tự động định dạng văn bản */}
                <article className="prose prose-lg max-w-4xl mx-auto">
                    
                    {/* Tiêu đề chính */}
                    <h1 className="font-serif">Điều khoản Dịch vụ</h1>
                    <p className="text-sm text-gray-500">Cập nhật lần cuối: 04/11/2025</p>

                    <p>Chào mừng bạn đến với Minh Phu Shop. Bằng cách truy cập hoặc sử dụng trang web của chúng tôi, bạn đồng ý tuân thủ và bị ràng buộc bởi các điều khoản và điều kiện sử dụng sau đây. Vui lòng đọc kỹ các điều khoản này.</p>
                    
                    <h2 className="font-serif">1. Chấp nhận Điều khoản</h2>
                    <p>Bằng cách sử dụng trang web này ("Trang Web"), bạn đồng ý với các Điều khoản Dịch vụ này, Chính sách Bảo mật của chúng tôi (xem <Link to="/privacy-policy">tại đây</Link>), và tất cả các luật lệ và quy định hiện hành. Nếu bạn không đồng ý với bất kỳ điều khoản nào, bạn bị cấm sử dụng hoặc truy cập trang web này.</p>

                    <h2 className="font-serif">2. Sử dụng Trang Web</h2>
                    <p>Bạn đồng ý chỉ sử dụng Trang Web cho các mục đích hợp pháp và không vi phạm quyền của bất kỳ bên thứ ba nào. Bạn không được:</p>
                    <ul>
                        <li>Sử dụng trang web theo bất kỳ cách nào gây gián đoạn, hư hỏng hoặc làm giảm hiệu suất của trang web.</li>
                        <li>Sử dụng bất kỳ robot, "bot", "spider", hoặc thiết bị tự động nào khác để truy cập trang web cho bất kỳ mục đích nào.</li>
                        <li>Cố gắng truy cập trái phép vào bất kỳ phần nào của trang web, máy chủ hoặc mạng máy tính.</li>
                    </ul>

                    <h2 className="font-serif">3. Tài khoản Người dùng</h2>
                    <p>Để truy cập một số tính năng, bạn có thể cần phải đăng ký tài khoản. Bạn đồng ý cung cấp thông tin chính xác, hiện tại và đầy đủ trong quá trình đăng ký. Bạn có trách nhiệm bảo mật mật khẩu của mình và chịu trách nhiệm cho mọi hoạt động xảy ra dưới tài khoản của bạn.</p>

                    <h2 className="font-serif">4. Sản phẩm và Giá cả</h2>
                    <p>Chúng tôi cố gắng hiển thị thông tin sản phẩm (hình ảnh, mô tả, màu sắc) một cách chính xác nhất. Tuy nhiên, chúng tôi không đảm bảo rằng màu sắc hiển thị trên màn hình của bạn sẽ hoàn toàn chính xác.</p>
                    <p>Tất cả giá cả có thể thay đổi mà không cần thông báo trước. Chúng tôi có quyền sửa đổi hoặc ngừng cung cấp sản phẩm bất kỳ lúc nào.</p>
                    
                    <h2 className="font-serif">5. Đơn hàng và Thanh toán</h2>
                    <p>Chúng tôi có quyền từ chối hoặc hủy bỏ bất kỳ đơn hàng nào vì bất kỳ lý do gì, bao gồm các lỗi về giá cả hoặc mô tả sản phẩm, hoặc nếu nghi ngờ có hành vi gian lận.</p>
                    <p>Khi bạn cung cấp thông tin thanh toán, bạn cam kết rằng thông tin đó là chính xác và bạn được ủy quyền sử dụng phương thức thanh toán đó.</p>

                    <h2 className="font-serif">6. Giới hạn Trách nhiệm</h2>
                    <p>Trong mọi trường hợp, Minh Phu Shop, giám đốc, nhân viên hoặc các chi nhánh của chúng tôi sẽ không chịu trách nhiệm pháp lý cho bất kỳ thiệt hại gián tiếp, ngẫu nhiên, hoặc do hậu quả nào phát sinh từ việc bạn sử dụng hoặc không thể sử dụng trang web hoặc sản phẩm.</p>
                    
                    <h2 className="font-serif">7. Thay đổi Điều khoản</h2>
                    <p>Chúng tôi có quyền sửa đổi các Điều khoản Dịch vụ này bất kỳ lúc nào. Phiên bản mới nhất sẽ luôn được đăng tải trên trang này. Việc bạn tiếp tục sử dụng Trang Web sau khi các thay đổi được đăng tải đồng nghĩa với việc bạn chấp nhận các thay đổi đó.</p>

                    <h2 className="font-serif">8. Liên hệ</h2>
                    <p>Nếu bạn có bất kỳ câu hỏi nào về các Điều khoản này, vui lòng liên hệ với chúng tôi qua trang <Link to="/contact">Liên hệ</Link>.</p>
                </article>

            </div>
        </div>
    );
}