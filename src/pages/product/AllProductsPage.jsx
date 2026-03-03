// src/pages/AllProductsPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProductService from '../../api/ProductService.js';
import { ArrowLeft, Search, Filter, XCircle } from 'lucide-react'; // Thêm icon Filter và XCircle
import FileUploadService from '../../api/FileUploadService.js';
//const IMAGE_PRODUCT_URL = "http://localhost:8080/uploads/images/products/";

export default function AllProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // THÊM STATES CHO BỘ LỌC
    const [searchKeyword, setSearchKeyword] = useState('');
    const [sortOption, setSortOption] = useState('newest'); // 'newest', 'priceAsc', 'priceDesc', 'nameAsc'
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    
    // State để điều khiển việc mở/đóng sidebar lọc trên mobile
    const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

    const navigate = useNavigate();

    // Hàm gọi API với các tham số lọc/sắp xếp (dùng useCallback để tránh lỗi render)
    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        // --- 1. Xử lý tham số ---
        const params = {
            keyword: searchKeyword.trim() || null,
            minPrice: minPrice.trim() && !isNaN(parseFloat(minPrice)) ? parseFloat(minPrice) : null,
            maxPrice: maxPrice.trim() && !isNaN(parseFloat(maxPrice)) ? parseFloat(maxPrice) : null,
            status: true, // Luôn lọc sản phẩm active
        };

        // Xử lý sắp xếp
        if (sortOption === 'priceAsc') {
            params.sortBy = 'price';
            params.sortDir = 'asc';
        } else if (sortOption === 'priceDesc') {
            params.sortBy = 'price';
            params.sortDir = 'desc';
        } else if (sortOption === 'nameAsc') {
            params.sortBy = 'name';
            params.sortDir = 'asc';
        } else {
             params.sortBy = 'id'; // Mặc định: Mới nhất
             params.sortDir = 'desc';
        }
        
        // --- 2. Gọi API ---
        try {
            const response = await ProductService.getAllWithFilter(params); 
            const productData = response.data?._embedded?.productDtoList || response.data || [];
            
            setProducts(productData);
            setError(null);
        } catch (err) {
            console.error("Lỗi Fetch/Filter:", err);
            setError(err.response?.data?.message || "Không thể tải hoặc lọc dữ liệu sản phẩm.");
            setProducts([]);
        } finally {
            setLoading(false);
        }
    }, [searchKeyword, sortOption, minPrice, maxPrice]); // Dependency array

    // Trigger fetch khi component mount và khi filter/search thay đổi (với debounce)
    useEffect(() => {
        // Debounce: Đợi 300ms sau khi ngừng gõ/thay đổi trước khi gọi API
        const timeoutId = setTimeout(() => {
             fetchProducts();
        }, 300);

        return () => clearTimeout(timeoutId); // Cleanup timeout
    }, [fetchProducts]);

    // Handler cho nút Reset
    const handleReset = () => {
        setSearchKeyword("");
        setMinPrice("");
        setMaxPrice("");
        setSortOption("newest");
        // fetchProducts sẽ tự chạy lại do state thay đổi
    };

    // --- RENDER ---
    const renderPlaceholder = () => (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-5 gap-y-8 md:gap-x-6 md:gap-y-10">
            {[...Array(10)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md h-96 animate-pulse"></div>
            ))}
        </div>
    );

    return (
        <div className="bg-gray-50 min-h-screen pt-24 md:pt-28">
            <div className="container mx-auto pb-16 px-4 lg:px-6">
                <div className="mb-12 pt-4 relative flex justify-center h-10"> {/* h-10 để giữ vị trí */}
                    
                    {/* NÚT QUAY LẠI TRANG CHỦ (Đã chỉnh vị trí) */}
                    <Link 
                        to="/" 
                        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors group absolute left-0 top-1/2 transform -translate-y-1/2 hidden md:flex" 
                    >
                        <ArrowLeft size={16} className="mr-1.5 transition-transform duration-200 group-hover:-translate-x-1" />
                        Trang chủ
                    </Link>

                    {/* TIÊU ĐỀ TRANG (Đã căn giữa tuyệt đối) */}
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-center font-serif absolute top-1/2 transform -translate-y-1/2">
                        Tất Cả Sản Phẩm
                    </h1>

                </div>

                {/* --- Main Layout: Filter Sidebar (trên mobile) & Content --- */}
                <div className="flex flex-col lg:flex-row gap-6">
                    
                    {/* --- Sidebar Lọc (Ẩn trên mobile, hiện khi bấm nút) --- */}
                    <aside className={`fixed lg:static inset-y-0 left-0 w-64 bg-white shadow-lg p-6 lg:rounded-lg lg:shadow-md z-50 transform ${isFilterPanelOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out overflow-y-auto`}>
                        {/* Nút đóng sidebar trên mobile */}
                        <div className="flex justify-between items-center mb-6 lg:hidden">
                            <h2 className="text-xl font-bold text-gray-800">Lọc sản phẩm</h2>
                            <button onClick={() => setIsFilterPanelOpen(false)} className="text-gray-500 hover:text-gray-900">
                                <XCircle size={24} />
                            </button>
                        </div>

                        {/* Tiêu đề lọc trên desktop */}
                        <h2 className="text-xl font-bold text-gray-800 mb-6 hidden lg:block">Bộ lọc</h2>

                        {/* Tìm kiếm theo tên */}
                        <div className="mb-6">
                            <label htmlFor="searchKeyword" className="block text-sm font-medium text-gray-700 mb-2">Tìm kiếm tên</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    id="searchKeyword"
                                    placeholder="Tên sản phẩm..."
                                    value={searchKeyword}
                                    onChange={(e) => setSearchKeyword(e.target.value)}
                                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:border-gray-900 focus:ring-1 focus:ring-gray-900 text-sm transition"
                                />
                                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            </div>
                        </div>

                        {/* Lọc theo khoảng giá */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Khoảng giá (VNĐ)</label>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="number"
                                    placeholder="Từ"
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(e.target.value)}
                                    className="w-1/2 border border-gray-300 rounded-md p-2 text-sm focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition"
                                />
                                <span className="text-gray-500">-</span>
                                <input
                                    type="number"
                                    placeholder="Đến"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                    className="w-1/2 border border-gray-300 rounded-md p-2 text-sm focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition"
                                />
                            </div>
                        </div>

                        {/* Nút Reset */}
                        <button 
                            onClick={handleReset} 
                            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-3 rounded-md text-sm transition flex items-center justify-center gap-2"
                        >
                            <XCircle size={16} /> Xóa bộ lọc
                        </button>
                    </aside>

                    {/* --- Overlay cho mobile khi sidebar mở --- */}
                    {isFilterPanelOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setIsFilterPanelOpen(false)}></div>
                    )}

                    {/* --- Phần nội dung chính (Sort & Product Grid) --- */}
                    <main className="flex-1">
                        {/* Thanh sắp xếp và nút mở lọc trên mobile */}
                        <div className="flex justify-between items-center mb-6 bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                            {/* Nút mở filter trên mobile */}
                            <button 
                                onClick={() => setIsFilterPanelOpen(true)} 
                                className="lg:hidden flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-3 rounded-md text-sm transition"
                            >
                                <Filter size={16} /> Lọc
                            </button>

                            {/* Sắp xếp */}
                            <div className="flex items-center gap-2 ml-auto lg:ml-0"> {/* ml-auto để đẩy sang phải trên mobile */}
                                <label htmlFor="sort" className="text-sm font-medium text-gray-700 whitespace-nowrap">Sắp xếp theo:</label>
                                <select
                                    id="sort"
                                    value={sortOption}
                                    onChange={(e) => setSortOption(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition"
                                >
                                    <option value="newest">Mới nhất</option>
                                    <option value="priceAsc">Giá: Thấp đến cao</option>
                                    <option value="priceDesc">Giá: Cao đến thấp</option>
                                    <option value="nameAsc">Tên (A-Z)</option>
                                </select>
                            </div>
                        </div>

                        {/* Hiển thị lỗi nếu có */}
                        {error && <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700 text-center">{error}</div>}

                        {/* --- Lưới Sản Phẩm --- */}
                        {loading ? renderPlaceholder() : (
                            products.length > 0 ? (
                                <div className="flex justify-center">
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-5 gap-y-8 md:gap-x-6 md:gap-y-10 w-full max-w-full"> {/* max-w-full cho phép mở rộng hết chiều rộng main */}
                                        {products.map(product => {
                                            const displayPrice = (product.salePrice && product.salePrice > 0) ? product.salePrice : product.price;
                                            const originalPrice = (product.salePrice && product.salePrice > 0 && product.price > product.salePrice) ? product.price : null;
                                            const discountPercent = originalPrice ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100) : 0;

                                            return (
                                                <Link
                                                    to={`/product/${product.id}`}
                                                    key={product.id}
                                                    className="bg-white rounded-lg overflow-hidden group transition-shadow duration-300 hover:shadow-xl flex flex-col"
                                                >
                                                    <div className="relative w-full overflow-hidden aspect-[3/4]">
                                                        <img
src={FileUploadService.getImageUrl(product.image, "products")}                                                            alt={product.name}
                                                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-in-out"
                                                            loading="lazy"
                                                        />
                                                        {discountPercent > 0 && (
                                                            <span className="absolute top-2.5 right-2.5 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm uppercase">
                                                                -{discountPercent}%
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="p-3 md:p-4 flex flex-col flex-grow">
                                                        <div>
                                                            <h3 className="font-medium text-sm md:text-base text-gray-700 group-hover:text-black transition-colors duration-200 mb-1.5 min-h-[40px] line-clamp-2" title={product.name}>
                                                                {product.name}
                                                            </h3>
                                                        </div>
                                                        <div className="mt-auto pt-1.5 flex items-baseline flex-wrap gap-x-2">
                                                            <p className="text-base font-semibold text-gray-900">
                                                                {displayPrice.toLocaleString('vi-VN')} VNĐ
                                                            </p>
                                                            {originalPrice && (
                                                                <p className="text-xs text-gray-400 line-through">
                                                                    {originalPrice.toLocaleString('vi-VN')} VNĐ
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            ) : (
                                // Thông báo khi không có sản phẩm
                                <div className="text-center py-20">
                                    <p className="text-lg text-gray-600 mb-5">Không tìm thấy sản phẩm nào khớp với tìm kiếm.</p>
                                    <button onClick={handleReset} className="inline-block bg-gray-200 text-gray-800 px-6 py-2.5 rounded text-sm font-medium hover:bg-gray-300 transition-colors">
                                        Xóa bộ lọc
                                    </button>
                                </div>
                            )
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}