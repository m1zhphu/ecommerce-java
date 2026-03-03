// src/layouts/Footer.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MenuService from '../api/MenuService'; // Đảm bảo đường dẫn này đúng
import { Facebook, Twitter, Instagram, Send } from 'lucide-react';

export default function Footer() {
    const [mainLinks, setMainLinks] = useState([]);
    const [footerLinks, setFooterLinks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMenus = async () => {
            setLoading(true);
            try {
                // 1. Gọi API public để lấy TẤT CẢ menus
                const res = await MenuService.getAll();
                const allMenus = res.data?._embedded?.menuDtoList || res.data || [];

                // 2. Lọc ra các menu cho từng vị trí
                const main = allMenus
                    .filter(m => m.position === 'main_menu' && m.status === true)
                    .sort((a, b) => a.displayOrder - b.displayOrder); // Sắp xếp

                const footer = allMenus
                    .filter(m => m.position === 'footer_menu' && m.status === true)
                    .sort((a, b) => a.displayOrder - b.displayOrder); // Sắp xếp
                
                setMainLinks(main);
                setFooterLinks(footer);

            } catch (err) {
                console.error("Lỗi khi tải menu cho footer:", err);
                setError("Không thể tải thông tin footer.");
            } finally {
                setLoading(false);
            }
        };

        fetchMenus();
    }, []);

    // Xử lý khi submit form newsletter (chỉ là giả lập)
    const handleNewsletterSubmit = (e) => {
        e.preventDefault();
        alert("Cảm ơn bạn đã đăng ký!");
        e.target.reset();
    };

    if (error) {
        // Có thể không render gì nếu lỗi, hoặc render một footer tối giản
        return (
            <footer className="bg-gray-900 text-gray-500 py-4 text-center">
                {error}
            </footer>
        );
    }

    // Giao diện chính của Footer
    return (
        <footer className="bg-gray-900 text-gray-300">
            <div className="container mx-auto px-4 lg:px-6 py-16">
                {/* Lưới 4 cột */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    
                    {/* Cột 1: Thông tin thương hiệu & Mạng xã hội */}
                    <div className="space-y-4">
                        <Link to="/" className="text-2xl font-serif font-bold text-white">
                            Minh Phu Shop
                        </Link>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            Mang đến những xu hướng thời trang mới nhất,
                            chất lượng và phong cách cho bạn.
                        </p>
                        <div className="flex space-x-4">
                            <a href="https://www.facebook.com/m1zhphu/" aria-label="Facebook" className="text-gray-400 hover:text-white transition-colors">
                                <Facebook size={20} />
                            </a>
                            <a href="https://www.instagram.com/m1zhphu/" aria-label="Instagram" className="text-gray-400 hover:text-white transition-colors">
                                <Instagram size={20} />
                            </a>
                            <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-white transition-colors">
                                <Twitter size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Cột 2: Menu Cửa hàng (lấy từ 'main_menu') */}
                    <div>
                        <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Cửa hàng</h3>
                        <ul className="space-y-3">
                            {loading ? <li className="animate-pulse">Đang tải...</li> : 
                                mainLinks.map(link => (
                                    <li key={link.id}>
                                        <Link 
                                            to={link.link}
                                            className="text-sm text-gray-400 hover:text-white transition-colors"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>

                    {/* Cột 3: Menu Hỗ trợ (lấy từ 'footer_menu') */}
                    <div>
                        <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Hỗ trợ</h3>
                        <ul className="space-y-3">
                            {loading ? <li className="animate-pulse">Đang tải...</li> : 
                                footerLinks.map(link => (
                                    <li key={link.id}>
                                        <Link 
                                            to={link.link}
                                            className="text-sm text-gray-400 hover:text-white transition-colors"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>

                    {/* Cột 4: Đăng ký nhận tin */}
                    <div>
                        <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Đăng ký nhận tin</h3>
                        <p className="text-sm text-gray-400 mb-4">
                            Nhận thông tin về sản phẩm mới và các chương trình khuyến mãi.
                        </p>
                        <form onSubmit={handleNewsletterSubmit} className="flex">
                            <input
                                type="email"
                                placeholder="Email của bạn"
                                className="w-full bg-gray-800 text-white px-4 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-none text-sm"
                                required
                            />
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 transition-colors"
                                aria-label="Đăng ký"
                            >
                                <Send size={18} />
                            </button>
                        </form>
                    </div>

                </div>
            </div>

            {/* Thanh Copyright ở dưới cùng */}
            <div className="border-t border-gray-800">
                <div className="container mx-auto px-4 lg:px-6 py-6 text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center">
                    <p>© {new Date().getFullYear()} Minh Phu Shop.</p>
                    {/* (Bạn có thể thêm các icon thanh toán ở đây) */}
                    <p>Thanh toán an toàn</p>
                </div>
            </div>
        </footer>
    );
}