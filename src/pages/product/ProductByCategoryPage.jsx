// src/pages/ProductPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; // Keep Link from react-router-dom
import ProductService from '../../api/ProductService.js';
import CategoryService from '../../api/CategoryService.js';
import { ArrowLeft } from 'lucide-react'; // For Back to Home button

const IMAGE_PRODUCT_URL = "http://localhost:8080/uploads/images/products/";

export default function ProductPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categoryName, setCategoryName] = useState("Sản phẩm");
    const { categoryId } = useParams();

    useEffect(() => {
        setLoading(true);
        setCategoryName("Đang tải...");

        const categoryPromise = CategoryService.getById(categoryId)
            .then(res => res.data.name || "Danh mục không xác định")
            .catch(err => {
                console.error("Lỗi khi tải tên danh mục!", err);
                return (err.response?.status === 404) ? "Danh mục không tồn tại" : "Lỗi tải danh mục";
            });

        const productsPromise = ProductService.filterByCategory(categoryId)
            .then(response => response.data?._embedded?.productDtoList ?? response.data ?? [])
            .catch(error => {
                console.error("Lỗi khi tải sản phẩm!", error);
                return [];
            });

        Promise.all([categoryPromise, productsPromise])
            .then(([name, productData]) => {
                setCategoryName(name);
                setProducts(productData);
            })
            .finally(() => {
                setLoading(false);
            });

    }, [categoryId]);

    // --- RENDER ---

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50 pt-20">
                <p className="text-xl text-gray-600 animate-pulse">Đang tải sản phẩm...</p>
            </div>
        );
    }

    return (
        // Nền nhẹ toàn trang, padding top LỚN
        <div className="bg-gray-50 min-h-screen pt-24 md:pt-28">
            <div className="container mx-auto pb-16 px-4 lg:px-6">

                {/* Header của trang */}
                <div className="flex items-center justify-between mb-12 relative h-10">

                    {/* Nút Quay lại trang chủ (Bên trái) */}
                    {/* THAY ĐỔI: text-base, size={18} */}
                    <Link to="/" className="font-serif inline-flex items-center text-base text-gray-600 hover:text-gray-900 transition-colors group absolute left-0 top-1/2 transform -translate-y-1/2">
                        <ArrowLeft size={18} className="mr-1.5 transition-transform duration-200 group-hover:-translate-x-1" />
                        Trang chủ
                    </Link>

                    {/* Tiêu đề trang - Căn giữa */}
                    <h1 className="font-serif absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl md:text-4xl font-bold text-gray-900 text-center whitespace-nowrap px-4">
                        {categoryName}
                    </h1>

                     {/* Breadcrumbs (Bên phải) */}
                     {/* THAY ĐỔI: text-sm */}
                    <nav className="font-serif text-sm text-gray-500 hidden md:block absolute right-0 top-1/2 transform -translate-y-1/2">
                        <ol className="list-none p-0 inline-flex items-center space-x-2">
                             <li> <Link to="/" className="text-gray-500 hover:text-gray-900">Trang chủ</Link> </li>
                             <li> <span className="text-gray-400">/</span> </li>
                             <li> <span className="text-gray-700 font-medium">{categoryName}</span> </li>
                        </ol>
                    </nav>
                </div>

                {/* --- Lưới Sản Phẩm --- */}
                {products.length > 0 ? (
                    // Căn giữa Grid
                    <div className="flex justify-center">
                        {/* Grid: 2 cột mobile, 3 tablet, 4 desktop */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-8 md:gap-x-6 md:gap-y-10 w-full max-w-7xl">
                            {products.map(product => {
                                // Tính toán giá
                                const displayPrice = (product.salePrice && product.salePrice > 0) ? product.salePrice : product.price;
                                const originalPrice = (product.salePrice && product.salePrice > 0 && product.price > product.salePrice) ? product.price : null;
                                const discountPercent = originalPrice ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100) : 0;

                                return (
                                    <Link
                                        to={`/product/${product.id}`}
                                        key={product.id}
                                        // Card style
                                        className="bg-white rounded-lg overflow-hidden group transition-shadow duration-300 hover:shadow-lg flex flex-col"
                                    >
                                        {/* Ảnh sản phẩm */}
                                        <div className="relative w-full overflow-hidden aspect-[3/4]">
                                            <img
                                                src={product.image ? `${IMAGE_PRODUCT_URL}${product.image}` : "https://via.placeholder.com/400x533/F9FAFB/D1D5DB?text=Ảnh"}
                                                alt={product.name}
                                                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-in-out"
                                                loading="lazy"
                                            />
                                            {discountPercent > 0 && (
                                                <span className="absolute top-2.5 right-2.5 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm uppercase">
                                                    -{discountPercent}%
                                                </span>
                                            )}
                                        </div>
                                        {/* Chi tiết sản phẩm */}
                                        <div className="p-3 md:p-4 flex flex-col flex-grow">
                                            <div>
                                                <h3 className="font-medium text-sm md:text-sm text-gray-800 group-hover:text-black transition-colors duration-200 mb-1 min-h-[40px] line-clamp-2" title={product.name}>
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
                        <p className="text-lg text-gray-600 mb-5">Rất tiếc, không tìm thấy sản phẩm nào phù hợp.</p>
                        <Link to="/" className="inline-block bg-gray-800 text-white px-6 py-2.5 rounded text-sm font-medium hover:bg-black transition-colors">
                            Xem các sản phẩm khác
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}