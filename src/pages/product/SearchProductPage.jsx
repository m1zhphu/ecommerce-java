// src/pages/SearchPage.jsx

import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ProductService from '../../api/ProductService';
import FileUploadService from '../../api/FileUploadService'; // Để hiển thị ảnh
import { Loader2, AlertTriangle, Search } from 'lucide-react';

// --- BẠN CÓ THỂ TÁI SỬ DỤNG PRODUCTCARD TỪ FILE KHÁC ---
// (Đây là phiên bản thu gọn để chạy demo)
function ProductCard({ product }) {
    const imageUrl = FileUploadService.getImageUrl(product.image, "products");
    const displayPrice = (product.salePrice && product.salePrice > 0) ? product.salePrice : product.price;
    const originalPrice = (product.salePrice && product.salePrice > 0 && product.price > product.salePrice) ? product.price : null;

    return (
        <Link 
            to={`/product/${product.id}`} 
            className="block overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 group bg-white"
        >
            <div className="overflow-hidden aspect-[3/4]">
                <img src={imageUrl} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
            <div className="p-4">
                <h3 className="text-sm font-medium text-gray-800 mb-1 h-10 line-clamp-2">{product.name}</h3>
                <div className="flex items-baseline gap-2">
                    <p className="text-base font-semibold text-gray-900">{displayPrice.toLocaleString('vi-VN')} VNĐ</p>
                    {originalPrice && (
                        <p className="text-xs text-gray-400 line-through">{originalPrice.toLocaleString('vi-VN')} VNĐ</p>
                    )}
                </div>
            </div>
        </Link>
    );
}
// --- KẾT THÚC PRODUCTCARD ---


export default function SearchProductPage() {
    const [searchParams] = useSearchParams();
    const keyword = searchParams.get('name') || ""; // Lấy từ khóa 'name' từ URL

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!keyword) {
                setProducts([]);
                setLoading(false);
                return; // Không tìm gì nếu không có từ khóa
            }

            setLoading(true);
            setError(null);
            
            try {
                // Tạo params để gọi API lọc
                const params = {
                    keyword: keyword,
                    status: true // Chỉ tìm sản phẩm đang hiển thị
                    // (Bạn có thể thêm các params khác nếu API hỗ trợ)
                };
                
                // Gọi API (Giả sử bạn có hàm getAllWithFilter trong ProductService)
                const res = await ProductService.getAllWithFilter(params);
                const productData = res.data._embedded?.productDtoList || res.data || [];
                setProducts(productData);

            } catch (err) {
                console.error("Lỗi khi tìm kiếm:", err);
                setError("Không thể tải kết quả tìm kiếm.");
            } finally {
                setLoading(false);
            }
        };

        fetchSearchResults();
    }, [keyword]); // Chạy lại mỗi khi từ khóa trên URL thay đổi

    return (
        <div className="bg-gray-50 min-h-screen pt-32 pb-16"> {/* Thêm pt-32 để không bị Header che */}
            <div className="container mx-auto px-4 lg:px-6">
                
                {/* Tiêu đề trang */}
                <div className="mb-12 text-center">
                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">
                        Kết quả tìm kiếm
                    </h1>
                    {keyword && (
                        <p className="text-lg text-gray-600 mt-3">
                            Cho từ khóa: "<span className="font-semibold text-gray-800">{keyword}</span>"
                        </p>
                    )}
                </div>

                {/* Hiển thị kết quả */}
                {loading ? (
                    <div className="flex justify-center items-center min-h-[300px]">
                        <Loader2 size={40} className="animate-spin text-blue-500" />
                    </div>
                ) : error ? (
                    <div className="text-center py-12 bg-red-50 p-6 rounded-lg">
                        <AlertTriangle size={32} className="inline-block text-red-500" />
                        <p className="text-red-700 mt-2">{error}</p>
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white p-10 rounded-lg shadow-sm">
                        <Search size={48} className="mx-auto text-gray-400 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-800">Không tìm thấy sản phẩm</h3>
                        <p className="text-gray-500 mt-2">
                            Chúng tôi không tìm thấy sản phẩm nào khớp với từ khóa của bạn. 
                            <br/>Vui lòng thử tìm kiếm với từ khóa khác.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}