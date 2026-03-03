// src/components/FeaturedProducts.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductService from '../api/ProductService.js';
import FileUploadService from '../api/FileUploadService.js';

// --- (Component ProductCard giữ nguyên) ---
function ProductCard({ product }) {
    const displayPrice = (product.salePrice && product.salePrice > 0) ? product.salePrice : product.price;
    const originalPrice = (product.salePrice && product.salePrice > 0 && product.price > product.salePrice) ? product.price : null;
    const discountPercent = originalPrice ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100) : 0;

    return (
        <Link
            to={`/product/${product.id}`}
            className="bg-white rounded-lg overflow-hidden group transition-shadow duration-300 hover:shadow-lg flex flex-col"
        >
            {/* Ảnh sản phẩm */}
            <div className="relative w-full overflow-hidden aspect-[3/4]">
                <img
                    src={FileUploadService.getImageUrl(product.image, "products")}
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
}


// --- COMPONENT CHÍNH ---
export default function FeaturedProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        ProductService.getAll()
            .then(response => {
                const productData = response.data?._embedded?.productDtoList ?? response.data ?? [];
                
                // === LOGIC LẤY 2 SP/DANH MỤC (NHƯ CŨ) ===
                const grouped = new Map();
                const activeProducts = productData.filter(p => p.status === true);

                for (const product of activeProducts) {
                    if (product.categoryId) {
                        const catId = product.categoryId;
                        if (!grouped.has(catId)) {
                            grouped.set(catId, []);
                        }
                        const items = grouped.get(catId);
                        if (items.length < 2) {
                            items.push(product);
                        }
                    }
                }

                // === THAY ĐỔI: BỎ GIỚI HẠN .slice(0, 5) ===
                // Lấy TẤT CẢ sản phẩm tìm được (2 sp/mỗi danh mục)
                const featured = Array.from(grouped.values()).flat();
                setProducts(featured);

            })
            .catch(error => {
                console.error("Lỗi khi tải sản phẩm nổi bật!", error);
                setProducts([]);
            })
            .finally(() => setLoading(false));
    }, []);

    // Placeholder dạng lưới khi đang tải
    if (loading) {
        return (
            <div className="bg-gray-50 py-16 md:py-20">
                <div className="container mx-auto px-4 lg:px-6">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-center text-gray-900 mb-12">
                        Sản Phẩm Nổi Bật
                    </h2>
                    {/* === SỬA LAYOUT: 4 CỘT === */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-8 md:gap-x-6 md:gap-y-10">
                        {[...Array(4)].map((_, i) => ( // Hiển thị 4 placeholder
                            <div key={i} className="rounded-lg bg-gray-200 animate-pulse">
                                <div className="aspect-[3/4] w-full bg-gray-300 rounded-t-lg"></div>
                                <div className="p-3 md:p-4 space-y-2">
                                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                                    <div className="h-5 bg-gray-300 rounded w-1/2"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (products.length === 0) {
        return null; // Không hiển thị gì nếu không có sản phẩm
    }

    // --- RENDER ---
    return (
        <div className="bg-gray-50 py-16 md:py-20">
            <div className="container mx-auto px-4 lg:px-6">
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-center text-gray-900 mb-12">
                    Sản Phẩm Nổi Bật
                </h2>

                {/* === SỬA LAYOUT: 4 CỘT (lg:grid-cols-4) === */}
                {/* 2 cột (mobile) -> 3 cột (tablet) -> 4 cột (desktop) */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-8 md:gap-x-6 md:gap-y-10">
                    {products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                {/* Nút Xem Tất Cả */}
                <div className="text-center mt-12">
                    <Link
                        to="/products" // Link đến trang tất cả sản phẩm
                        className="inline-block bg-white text-gray-800 px-6 py-2.5 rounded border border-gray-300 text-sm font-medium hover:bg-gray-100 hover:border-gray-400 transition duration-300"
                    >
                        Xem Tất Cả Sản Phẩm
                    </Link>
                </div>
            </div>
        </div>
    );
}