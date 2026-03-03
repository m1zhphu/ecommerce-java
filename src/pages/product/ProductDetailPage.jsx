// src/pages/ProductDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ProductService from '../../api/ProductService.js';
import CategoryService from '../../api/CategoryService.js';
import CartService from '../../api/CartService.js'; 
import { ShoppingCart, ArrowLeft, Plus, Minus, Check } from 'lucide-react'; // Thêm icon Check
import FileUploadService from '../../api/FileUploadService.js';

export default function ProductDetailPage() {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [categoryName, setCategoryName] = useState("Danh mục");
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loadingRelated, setLoadingRelated] = useState(true);
    const { productId } = useParams();
    const navigate = useNavigate();

    // --- STATE MỚI CHO SIZE ---
    const [selectedVariantId, setSelectedVariantId] = useState(null);
    const [sizeError, setSizeError] = useState(''); // Lỗi nếu chưa chọn size

    // --- LOGIC FETCH CHÍNH ---
    useEffect(() => {
        setLoading(true);
        setError(null);
        setCategoryName("Đang tải...");
        setSelectedVariantId(null); // Reset size đã chọn
        setQuantity(1); // Reset số lượng

        ProductService.getById(productId)
            .then(response => {
                const fetchedProduct = response.data;
                if (fetchedProduct && fetchedProduct.id) {
                    setProduct(fetchedProduct);
                    
                    // --- TỰ ĐỘNG CHỌN SIZE ĐẦU TIÊN ---
                    if (fetchedProduct.variants && fetchedProduct.variants.length > 0) {
                        // Tự chọn size đầu tiên có hàng
                        const firstAvailableVariant = fetchedProduct.variants.find(v => v.quantity > 0);
                        if (firstAvailableVariant) {
                            setSelectedVariantId(firstAvailableVariant.id);
                        } else {
                            // Nếu hết hàng, cứ chọn cái đầu tiên (để hiển thị)
                            setSelectedVariantId(fetchedProduct.variants[0].id);
                        }
                    }
                    
                    if (fetchedProduct.categoryId) {
                        CategoryService.getById(fetchedProduct.categoryId)
                            .then(catRes => setCategoryName(catRes.data.name || "Danh mục"))
                            .catch(() => setCategoryName("Danh mục"));
                        
                        fetchRelatedProducts(fetchedProduct.categoryId, fetchedProduct.id); 
                    } else {
                        setCategoryName("Sản phẩm");
                        setLoadingRelated(false);
                    }
                } else {
                    setError("Không tìm thấy thông tin sản phẩm.");
                    setProduct(null);
                }
            })
            .catch(err => {
                console.error("Lỗi khi tải chi tiết sản phẩm!", err);
                setError(err.response && err.response.status === 404 ? "Không tìm thấy sản phẩm này." : "Đã xảy ra lỗi khi tải thông tin sản phẩm.");
                setProduct(null);
                setLoadingRelated(false);
            })
            .finally(() => setLoading(false));

    }, [productId]); 

    // --- HÀM FETCH SẢN PHẨM LIÊN QUAN ---
    const fetchRelatedProducts = async (categoryId, currentProductId) => {
        setLoadingRelated(true);
        try {
            // (Bạn cần đảm bảo ProductService có hàm này)
            const response = await ProductService.filterByCategory(categoryId); 
            const productData = response.data?._embedded?.productDtoList || response.data || [];
            
            const filteredRelated = productData
                .filter(p => p.id !== currentProductId) 
                .slice(0, 4); 

            setRelatedProducts(filteredRelated);
        } catch (err) {
            console.error("Lỗi khi tải sản phẩm liên quan:", err);
            setRelatedProducts([]);
        } finally {
            setLoadingRelated(false);
        }
    };

    // --- Lấy thông tin variant (size) đang được chọn ---
    const selectedVariant = React.useMemo(() => {
        if (!product || !product.variants || !selectedVariantId) {
            return null;
        }
        return product.variants.find(v => v.id === selectedVariantId);
    }, [product, selectedVariantId]);

    // Lấy tổng tồn kho (chỉ để hiển thị)
    const totalStock = React.useMemo(() => {
         if (!product || !product.variants) return 0;
         // Dùng trường totalQuantity đã tính toán sẵn từ Backend DTO
         return product.totalQuantity; 
    }, [product]);

    // --- Cập nhật Quantity handlers ---
    const increaseQuantity = () => {
        // Không cho phép tăng quá số lượng tồn kho của size đã chọn
        const maxQuantity = selectedVariant ? selectedVariant.quantity : 1;
        setQuantity(prev => Math.min(prev + 1, maxQuantity));
    };
    const decreaseQuantity = () => setQuantity(prev => Math.max(1, prev - 1));


    // --- HÀM ADD TO CART (ĐÃ SỬA) ---
    const handleAddToCart = () => {
        setSizeError(''); // Xóa lỗi cũ
        const userToken = localStorage.getItem('userToken'); 
        if (!userToken) {
            alert('Vui lòng đăng nhập để thêm vào giỏ hàng!');
            navigate('/login');
            return;
        }
        if (!product) return;

        // 1. Kiểm tra đã chọn size chưa
        if (!selectedVariantId) {
            setSizeError('Vui lòng chọn một size.');
            return;
        }
        
        // 2. Kiểm tra tồn kho của size đã chọn
        if (!selectedVariant || selectedVariant.quantity < quantity) {
             setSizeError('Size này không đủ số lượng. Chỉ còn ' + (selectedVariant?.quantity || 0));
             return;
        }

        // 3. TẠO itemData VỚI productVariantId
        const itemData = {
            productVariantId: selectedVariantId, // <-- THAY ĐỔI QUAN TRỌNG
            quantity: quantity
        };

        setIsAddingToCart(true); 
        CartService.addItemToCart(itemData)
            .then(response => {
                alert(`Đã thêm ${quantity} "${product.name} (Size ${selectedVariant.size})" vào giỏ hàng!`);
                window.dispatchEvent(new CustomEvent('cartUpdated')); 
            })
            .catch(error => {
                console.error("Lỗi khi thêm vào giỏ hàng:", error);
                // Hiển thị lỗi từ backend (ví dụ: "Số lượng tồn kho không đủ")
                alert(error.response?.data?.message || 'Đã xảy ra lỗi khi thêm vào giỏ hàng.');
            })
            .finally(() => setIsAddingToCart(false));
    };

    // --- RENDER CHECK ---
    if (loading && !product) {
        return (
             <div className="flex justify-center items-center h-screen bg-white pt-20">
                 <p className="text-xl text-gray-600 animate-pulse">Đang tải...</p>
             </div>
        );
    }
    if (error) { 
        return (
            <div className="container mx-auto px-4 py-20 text-center pt-28"> 
                 <p className="text-red-600 font-semibold mb-4">{error}</p>
                 <Link to="/" className="text-blue-600 hover:underline inline-flex items-center">
                     <ArrowLeft size={16} className="mr-1" /> Quay lại trang chủ
                 </Link>
            </div>
        );
    }
    if (!product) { return null; }

    // Tính toán giá
    const displayPrice = (product.salePrice && product.salePrice > 0) ? product.salePrice : product.price;
    const originalPrice = (product.salePrice && product.salePrice > 0 && product.price > product.salePrice) ? product.price : null;
    const discountPercent = originalPrice ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100) : 0;

    return (
        <div className="bg-white min-h-screen pt-24 md:pt-32">
            <div className="container mx-auto pb-16 px-4 lg:px-6">

                {/* Breadcrumbs */}
                <nav className="text-xs text-gray-500 mb-8 md:mb-10">
                    <ol className="list-none p-0 inline-flex items-center space-x-1.5 flex-wrap">
                        <li> <Link to="/" className="text-gray-500 hover:text-gray-900">Trang chủ</Link> </li>
                        <li> <span className="text-gray-400">/</span> </li>
                        {product.categoryId && (
                            <>
                                <li> <Link to={`/products/category/${product.categoryId}`} className="text-gray-500 hover:text-gray-900">{categoryName}</Link> </li>
                                <li> <span className="text-gray-400">/</span> </li>
                            </>
                         )}
                        <li className="hidden sm:inline">
                            <span className="text-gray-700 font-medium truncate max-w-[200px] inline-block" title={product.name}>{product.name}</span>
                        </li>
                    </ol>
                </nav>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-start">
                    
                    {/* Cột ảnh */}
                    <div className="w-full sticky top-28 self-start"> 
                        <div className="aspect-[3/4] rounded-lg overflow-hidden border border-gray-100 relative bg-gray-50"> 
                            <img
                                src={FileUploadService.getImageUrl(product.image, "products")}
                                alt={product.name}
                                className="w-full h-full object-cover object-center transition-opacity duration-300"
                                loading="lazy"
                           />
                           {discountPercent > 0 && (
                                <span className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm uppercase">
                                    -{discountPercent}%
                                </span>
                           )}
                        </div>
                    </div>

                    {/* Cột thông tin */}
                    <div>
                        <Link to={product.categoryId ? `/products/category/${product.categoryId}`: '#'} className="text-sm text-gray-500 hover:text-gray-800 uppercase tracking-wider mb-2 inline-block">{categoryName}</Link>
                        <h1 className="text-3xl lg:text-4xl font-serif font-bold text-gray-900 mb-4">{product.name}</h1>
                        <div className="mb-6 flex items-baseline flex-wrap gap-x-3 gap-y-1">
                            <span className="text-3xl font-bold text-gray-900">
                                {displayPrice.toLocaleString('vi-VN')} VNĐ
                            </span>
                            {originalPrice && (
                                <span className="text-xl text-gray-400 line-through">
                                    {originalPrice.toLocaleString('vi-VN')} VNĐ
                                </span>
                            )}
                        </div>

                        {/* === KHU VỰC CHỌN SIZE MỚI === */}
                        <div className="mb-6">
                            <h3 className="text-sm font-medium text-gray-900 mb-3">Chọn Size:</h3>
                            {sizeError && <p className="text-sm text-red-600 mb-2">{sizeError}</p>}
                            
                            <div className="flex flex-wrap gap-2">
                                {product.variants && product.variants.map(variant => {
                                    const isSelected = variant.id === selectedVariantId;
                                    const isOutOfStock = variant.quantity === 0;
                                    
                                    return (
                                        <button
                                            key={variant.id}
                                            onClick={() => {
                                                if (!isOutOfStock) {
                                                    setSelectedVariantId(variant.id);
                                                    setSizeError('');
                                                    setQuantity(1); // Reset số lượng khi đổi size
                                                }
                                            }}
                                            disabled={isOutOfStock}
                                            className={`
                                                px-4 py-2 border rounded-md text-sm font-medium transition-colors
                                                ${isOutOfStock ? 'bg-gray-100 text-gray-400 line-through cursor-not-allowed' : ''}
                                                ${!isOutOfStock && isSelected ? 'bg-gray-900 text-white border-gray-900' : ''}
                                                ${!isOutOfStock && !isSelected ? 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50' : ''}
                                            `}
                                        >
                                            {variant.size}
                                            {isSelected && !isOutOfStock && <Check size={16} className="inline ml-1" />}
                                        </button>
                                    );
                                })}
                            </div>
                            {selectedVariant && selectedVariant.quantity > 0 && selectedVariant.quantity <= 10 && (
                                <p className="text-sm text-red-600 mt-2">Chỉ còn {selectedVariant.quantity} sản phẩm!</p>
                            )}
                        </div>
                        {/* === KẾT THÚC KHU VỰC SIZE === */}

                        {/* Quantity Selector */}
                        <div className="mb-8 flex items-center">
                            <label htmlFor="quantity" className="mr-4 font-medium text-gray-700 text-sm">Số lượng:</label>
                            <div className="flex items-center border border-gray-300 rounded">
                                <button
                                    onClick={decreaseQuantity}
                                    className="px-3 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-l transition disabled:opacity-50 disabled:cursor-not-allowed" 
                                    disabled={quantity <= 1 || isAddingToCart || !selectedVariantId}
                                > <Minus size={16} /> </button>
                                <input
                                    type="number"
                                    id="quantity"
                                    name="quantity"
                                    min="1"
                                    max={selectedVariant ? selectedVariant.quantity : 1} // Set max theo tồn kho
                                    value={quantity}
                                    onChange={(e) => {
                                        const newQty = Math.max(1, parseInt(e.target.value) || 1);
                                        const maxQuantity = selectedVariant ? selectedVariant.quantity : 1;
                                        setQuantity(Math.min(newQty, maxQuantity));
                                    }}
                                    className="h-10 border-l border-r border-gray-300 w-12 text-center focus:outline-none focus:ring-1 focus:ring-gray-400 disabled:bg-gray-50 text-sm"
                                    disabled={isAddingToCart || !selectedVariantId || totalStock === 0}
                                />
                                <button
                                    onClick={increaseQuantity}
                                    className="px-3 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-r transition disabled:opacity-50 disabled:cursor-not-allowed" 
                                    disabled={isAddingToCart || !selectedVariantId || (selectedVariant && quantity >= selectedVariant.quantity)}
                                > <Plus size={16} /> </button>
                            </div>
                        </div>

                        {/* Add to Cart Button */}
                        <button
                            onClick={handleAddToCart}
                            disabled={isAddingToCart || !selectedVariantId || totalStock === 0 || (selectedVariant && selectedVariant.quantity === 0)}
                            className={`w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white text-sm font-semibold py-3 px-8 rounded transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed`} 
                        >
                            <ShoppingCart size={18} />
                            {isAddingToCart ? 'Đang thêm...' : 
                             (totalStock === 0 ? 'Hết hàng' : 
                             (selectedVariant && selectedVariant.quantity === 0 ? 'Hết size này' : 'Thêm vào giỏ hàng'))
                            }
                        </button>

                        {/* Full Description */}
                        <div className="mt-10 pt-6 border-t border-gray-200">
                            <h2 className="text-base font-semibold text-gray-900 mb-3">Mô tả sản phẩm</h2>
                            <div
                                className="prose prose-sm max-w-none text-gray-600 leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: product.description || 'Chưa có mô tả chi tiết.' }}
                            />
                        </div>
                    </div>
                </div>

                {/* --- PHẦN SẢN PHẨM LIÊN QUAN --- */}
                {loadingRelated ? (
                    <p className="text-center mt-16 text-gray-500">Đang tìm sản phẩm liên quan...</p>
                ) : relatedProducts.length > 0 && (
                    <div className="mt-16 pt-8 border-t border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center font-serif">
                            Sản Phẩm Liên Quan
                        </h2>
                        <div className="flex justify-center">
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl">
                                {relatedProducts.map(related => {
                                    const relDisplayPrice = (related.salePrice && related.salePrice > 0) ? related.salePrice : related.price;
                                    const relOriginalPrice = (related.salePrice && related.salePrice > 0 && related.price > related.salePrice) ? related.price : null;
                                    const relDiscountPercent = relOriginalPrice ? Math.round(((relOriginalPrice - relDisplayPrice) / relOriginalPrice) * 100) : 0;

                                    return (
                                        <Link
                                            to={`/product/${related.id}`}
                                            key={related.id}
                                            onClick={() => setLoading(true)}
                                            className="bg-white rounded-lg overflow-hidden group transition-shadow duration-300 hover:shadow-xl flex flex-col"
                                        >
                                            {/* Ảnh */}
                                            <div className="relative w-full overflow-hidden aspect-[3/4]">
                                                <img
                                                    src={FileUploadService.getImageUrl(related.image, "products")}
                                                    alt={related.name}
                                                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                                                    loading="lazy"
                                                />
                                                {relDiscountPercent > 0 && (
                                                    <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm"> -{relDiscountPercent}% </span>
                                                )}
                                            </div>
                                            {/* Chi tiết */}
                                            <div className="p-3 md:p-4 flex flex-col flex-grow">
                                                <h3 className="font-medium text-sm md:text-base text-gray-800 line-clamp-2 mb-1 min-h-[40px]">{related.name}</h3>
                                                <div className="mt-auto pt-1 flex items-baseline gap-2">
                                                    <p className="text-base font-semibold text-gray-900">{relDisplayPrice.toLocaleString('vi-VN')} VNĐ</p>
                                                    {relOriginalPrice && <p className="text-xs text-gray-400 line-through">{relOriginalPrice.toLocaleString('vi-VN')} VNĐ</p>}
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}