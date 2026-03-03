// src/components/layouts/Header.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ShoppingCart, User, LogIn, LogOut, Menu as MenuIcon, X, Search } from 'lucide-react';
import { Link, useNavigate, useLocation, NavLink } from 'react-router-dom';
import MenuService from '../api/MenuService.js';
import UserService from '../api/UserService.js';
import CartService from '../api/CartService.js';

// --- Component Thanh Tìm Kiếm (Modal Overlay) ---
function SearchOverlay({ isOpen, onClose, onSearchSubmit, searchKeyword, setSearchKeyword, inputRef }) {
    return (
        // Lớp phủ mờ toàn màn hình
        <div
            className={`fixed inset-0 z-[100] flex items-start justify-center pt-28 p-4 transition-opacity duration-300 ease-in-out
        ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
    `}
            onClick={onClose}
        >

            {/* Nền mờ (Backdrop) */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

            {/* Ngăn không cho sự kiện click lan ra (để không bị đóng khi nhấp vào form) */}
            <div
                className="relative w-full max-w-xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Nút Đóng (X) */}
                <button
                    onClick={onClose}
                    className="absolute -top-12 right-0 text-white/70 hover:text-white transition-colors"
                    aria-label="Đóng tìm kiếm"
                >
                    <X size={32} />
                </button>

                {/* Form tìm kiếm */}
                <form onSubmit={onSearchSubmit}>
                    <div className="relative">
                        {/* Icon search bên trong input */}
                        <Search size={22} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            ref={inputRef}
                            type="text"
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            placeholder="Tìm kiếm sản phẩm..."
                            className="w-full border-none rounded-lg py-5 px-6 pl-16 text-lg md:text-xl text-gray-900 bg-white outline-none ring-2 ring-transparent focus:ring-blue-500 transition-shadow shadow-2xl"
                        />
                    </div>
                    <p className="text-center text-white/70 text-sm mt-3">
                        Nhấn Enter để tìm kiếm
                    </p>
                </form>
            </div>
        </div>
    );
}

export default function Header() {
    const [mainMenu, setMainMenu] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [cartItemCount, setCartItemCount] = useState(0);
    const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
    // State cho màu header dựa trên scroll
    const [isScrolled, setIsScrolled] = useState(false); // Đổi tên cho rõ nghĩa
    const navigate = useNavigate();
    const location = useLocation(); // Lấy thông tin đường dẫn hiện tại
    const headerRef = useRef(null);

    // --- THÊM MỚI CHO TÌM KIẾM ---
    const [isSearchOpen, setIsSearchOpen] = useState(false); // 1. State để bật/tắt thanh tìm kiếm
    const [searchKeyword, setSearchKeyword] = useState("");   // 2. State để lưu nội dung tìm kiếm
    const searchInputRef = useRef(null); // Ref để focus vào input


    // Logic đổi màu header khi cuộn
    useEffect(() => {
        const handleScroll = () => {
            // Đánh dấu là đã cuộn nếu scrollY > 10 (một khoảng nhỏ)
            if (window.scrollY > 10) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Chạy lần đầu
        // Cleanup listener khi component unmount
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // --- HÀM FETCH DỮ LIỆU ---
    const fetchMenu = useCallback(() => {
        MenuService.getAll()
            .then(response => {
                const menuData = response.data?._embedded?.menuDtoList ?? response.data ?? [];
                setMainMenu(
                    menuData
                        .filter(item => item.position === 'main_menu' && item.status === true)
                        .sort((a, b) => a.displayOrder - b.displayOrder)
                );
            })
            .catch(error => { console.error("Header: Lỗi khi tải menu!", error); setMainMenu([]); });
    }, []);

    const fetchCurrentUser = useCallback(() => {
        // **QUAN TRỌNG:** Đảm bảo bạn dùng đúng key token ('userToken' hay 'adminToken'?)
        UserService.getCurrentUser() // API này cần gửi token
            .then(response => { setCurrentUser(response.data); })
            .catch(error => {
                setCurrentUser(null);
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    localStorage.removeItem('userToken'); // Đảm bảo key này đúng
                }
            });
    }, []);

    const fetchCartInfo = useCallback(() => {
        const token = localStorage.getItem('userToken'); // Đảm bảo key này đúng
        if (!token) { setCartItemCount(0); return; }
        CartService.getCartInfo() // API này cần gửi token
            .then(response => { setCartItemCount(response.data?.itemCount ?? 0); })
            .catch(error => { setCartItemCount(0); });
    }, []);

    // --- HÀM ĐĂNG XUẤT ---
    const handleLogout = () => {
        localStorage.removeItem('userToken'); // Đảm bảo key này đúng
        setCurrentUser(null);
        setCartItemCount(0);
        setIsSideMenuOpen(false);
        navigate('/login');
    };


    // --- USE EFFECT ---
    useEffect(() => {
        fetchMenu();
        const token = localStorage.getItem('userToken'); // Đảm bảo key này đúng
        if (token) {
            fetchCurrentUser();
            fetchCartInfo();
        } else {
            setCurrentUser(null);
            setCartItemCount(0);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname]);

    // Đóng panel menu khi chuyển trang
    useEffect(() => {
        setIsSideMenuOpen(false);
        setIsSearchOpen(false);
    }, [location.pathname]);

    const handleSearchSubmit = (e) => {
        e.preventDefault(); // Ngăn form reload trang
        const keyword = searchKeyword.trim();
        if (keyword) {
            // Chuyển hướng đến trang kết quả tìm kiếm (bạn cần tạo trang này)
            navigate(`/products/search?name=${keyword}`);
            setSearchKeyword("");    // Xóa nội dung ô input
            setIsSearchOpen(false); // Đóng thanh tìm kiếm
        }
    };
    // Tự động focus vào input khi thanh tìm kiếm mở
    useEffect(() => {
        if (isSearchOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isSearchOpen]);
    // --- XÁC ĐỊNH TRẠNG THÁI HEADER ---
    // Header sẽ có nền trắng NẾU:
    // 1. Không phải trang chủ (location.pathname !== '/')
    // HOẶC 2. Đã cuộn xuống (isScrolled === true)
    const showWhiteHeader = location.pathname !== '/' || isScrolled;

    // --- TÍNH TOÁN CLASS ---
    // Class cố định
    const baseHeaderClasses = "group fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ease-in-out";
    // Class thay đổi theo trạng thái
    const dynamicHeaderClasses = showWhiteHeader
        ? 'bg-white text-gray-900 shadow-sm border-b border-gray-100' // Luôn trắng
        : 'bg-transparent text-white hover:bg-white hover:text-gray-900 hover:shadow-sm hover:border-b hover:border-gray-100'; // Trong suốt + hover (chỉ áp dụng trang chủ & top)

    // Class cho các icon/button bên trong (thay đổi màu chữ + màu nền hover)
    const iconButtonClasses = showWhiteHeader
        ? 'text-gray-700 hover:text-gray-900 hover:bg-gray-100' // Style khi header trắng
        : 'text-white hover:bg-white/20 group-hover:text-gray-700 group-hover:hover:text-gray-900 group-hover:hover:bg-gray-100'; // Style khi header trong suốt (+ group-hover)

    // Class cho logo (thay đổi màu chữ)
    const logoClasses = showWhiteHeader
        ? 'text-gray-900' // Luôn đen/xám
        : 'text-white group-hover:text-gray-900'; // Trắng, đổi khi hover header

    return (
        <>
            {/* Header Chính */}
            <header
                ref={headerRef}
                className={`${baseHeaderClasses} ${dynamicHeaderClasses}`}
            >
                <div className="container mx-auto px-4 lg:px-6 py-4 flex justify-between items-center relative">
                    {/* Phần Bên Trái: Menu + Search */}
                    <div className="flex items-center space-x-4 ">
                        <button
                            onClick={() => setIsSideMenuOpen(true)}
                            className={`p-1 rounded-full transition-colors duration-200 ${iconButtonClasses}`}
                            aria-label="Mở menu"
                        >
                            <MenuIcon size={24} />
                        </button>
                        <button
                            className={`p-1 rounded-full transition-colors duration-200 ${iconButtonClasses}`}
                            aria-label="Tìm kiếm"
                            onClick={() => setIsSearchOpen(!isSearchOpen)} // Bật/tắt thanh tìm kiếm
                        >
                            {isSearchOpen ? <X size={22} /> : <Search size={22} />} {/* Thay đổi icon */}
                        </button>
                    </div>

                    {/* Logo Ở Giữa */}
                    <div className="font-serif absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <Link to="/" className={`text-2xl font-bold tracking-tight transition-colors duration-300 ${logoClasses}`}>
                            Minh Phu Shop
                        </Link>
                    </div>

                    {/* Phần Bên Phải: Icons */}
                    <div className="flex items-center space-x-4">
                        {/* Tài khoản */}
                        <div className="relative group/user pb-2">
                            <button className={`flex items-center p-1 rounded-full transition-colors duration-200 ${iconButtonClasses} focus:outline-none`}>
                                {currentUser ? <User size={22} /> : <LogIn size={22} />}
                            </button>
                            {/* Dropdown */}
                            {/* THAY ĐỔI 2: Xóa 'mt-2' và thêm 'top-full' */}
                            <div className={`absolute right-0 top-full w-48 bg-white rounded shadow-lg py-1 hidden group-hover/user:block z-[60] border border-gray-100`}>
                                {currentUser ? (
                                    <>
                                        <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-100 truncate">Chào, {currentUser.username || 'Bạn'}!</div>
                                        <Link to="/account/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">Hồ sơ của tôi</Link>
                                        <Link to="/account/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">Đơn hàng</Link>
                                        <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                                            <LogOut size={14} className="inline mr-1.5 relative -top-px" /> Đăng xuất
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link to="/login" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                                            <LogIn size={14} className="inline mr-1.5 relative -top-px" /> Đăng nhập
                                        </Link>
                                        <Link to="/register" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">Đăng ký</Link>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Giỏ hàng */}
                        <Link to="/cart" className={`relative p-1 rounded-full transition-colors duration-200 ${iconButtonClasses}`}>
                            <ShoppingCart size={22} />
                            {cartItemCount > 0 && (
                                <span className={`absolute -top-1 -right-1 text-white text-[9px] leading-tight font-bold rounded-full h-3.5 w-3.5 flex items-center justify-center bg-red-500`}>
                                    {cartItemCount > 9 ? '9+' : cartItemCount}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </header>

            {/* THANH TÌM KIẾM */}
            <SearchOverlay
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
                onSearchSubmit={handleSearchSubmit}
                searchKeyword={searchKeyword}
                setSearchKeyword={setSearchKeyword}
                inputRef={searchInputRef}
            />

            {/* Panel Menu Bên Trái */}
            <div
                className={`fixed top-0 left-0 h-full w-72 md:w-80 bg-white shadow-xl z-[70] transform transition-transform duration-300 ease-in-out ${isSideMenuOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                {/* Header của Panel Menu */}
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                    <span className="font-semibold text-lg text-gray-800">Menu</span>
                    <button
                        onClick={() => setIsSideMenuOpen(false)}
                        className="p-1 text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-100"
                        aria-label="Đóng menu"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Danh sách Menu */}
                <nav className="flex flex-col py-4 px-2">
                    {mainMenu.map(item => (
                        <NavLink
                            key={item.id}
                            to={item.link || '#'}
                            className={({ isActive }) =>
                                `font-medium px-4 py-3 rounded text-left transition duration-200 ${isActive ? 'text-gray-900 bg-gray-100' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }`
                            }
                            onClick={() => setIsSideMenuOpen(false)}
                        >
                            {item.name}
                        </NavLink>
                    ))}
                    <div className="border-t border-gray-100 mt-4 pt-4 px-4 text-sm text-gray-500">
                        <p>Chúng tôi có thể giúp gì cho bạn?</p>
                        <a href="tel:+84xxxxxxxx" className="block mt-2 text-gray-700 hover:text-gray-900">+84 xxx xxx xxx</a>
                    </div>
                </nav>
            </div>

            {/* Lớp phủ mờ khi mở menu */}
            {isSideMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-[65] lg:hidden"
                    onClick={() => setIsSideMenuOpen(false)}
                ></div>
            )}
        </>
    );
}