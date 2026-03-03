// src/admin/product/EditProduct.jsx

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProductService from "../../api/ProductService";
import CategoryService from "../../api/CategoryService";
import CloudinaryService from "../../api/CloudinaryService"; 
// === 1. THÊM IMPORT NÀY (Để đọc ảnh cũ từ seeder) ===
import FileUploadService from "../../api/FileUploadService"; 
import { ArrowLeft, RefreshCw, Loader2, Plus, X } from "lucide-react";

// --- Component con (VariantInputRow) giữ nguyên ---
const VariantInputRow = ({ index, variant, onChange, onRemove }) => {
    return (
        <div className="flex items-center gap-3 mb-3">
            <div className="flex-1">
                <label htmlFor={`size-${index}`} className="block text-sm font-medium text-gray-700 sr-only">Size</label>
                <input
                    type="text"
                    id={`size-${index}`}
                    name="size"
                    value={variant.size}
                    onChange={(e) => onChange(index, e)}
                    placeholder="Size (S, M, 40, 41...)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                />
            </div>
            <div className="flex-1">
                <label htmlFor={`quantity-${index}`} className="block text-sm font-medium text-gray-700 sr-only">Số lượng</label>
                <input
                    type="number"
                    id={`quantity-${index}`}
                    name="quantity"
                    value={variant.quantity}
                    onChange={(e) => onChange(index, e)}
                    placeholder="Số lượng"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                />
            </div>
            <button
                type="button"
                onClick={() => onRemove(index)}
                className="p-2 text-red-600 hover:text-red-800 disabled:opacity-50"
                title="Xóa size"
            >
                <X size={20} />
            </button>
        </div>
    );
};


export default function EditProduct() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState({
        name: "", price: "", salePrice: "", description: "", categoryId: "", image: "", status: true
    });

    const [variants, setVariants] = useState([]); 
    const [categories, setCategories] = useState([]);
    const [newSelectedFile, setNewSelectedFile] = useState(null); 
    const [imagePreview, setImagePreview] = useState(null); 
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setMessage("");
            try {
                const [productRes, categoriesRes] = await Promise.all([
                    ProductService.getById(id),
                    CategoryService.getAll(),
                ]);
                
                const productData = productRes.data;
                const { quantity, variants: fetchedVariants, ...productBase } = productData;
                
                setProduct(productBase);
                setCategories(categoriesRes.data);
                
                if (fetchedVariants && fetchedVariants.length > 0) {
                    setVariants(fetchedVariants.map(v => ({ 
                        id: v.id, 
                        size: v.size, 
                        quantity: v.quantity 
                    })));
                } else {
                    setVariants([{ size: '', quantity: 0 }]);
                }
                
                // === 2. SỬA LOGIC HIỂN THỊ ẢNH CŨ ===
                if (productData.image) {
                    // Kiểm tra xem nó là URL đầy đủ (Cloudinary) hay tên file (Seeder)
                    if (productData.image.startsWith('http')) {
                        setImagePreview(productData.image); // Ảnh đã là URL
                    } else {
                        // Ảnh là tên file, cần FileUploadService
                        setImagePreview(FileUploadService.getImageUrl(productData.image, "products"));
                    }
                }
                
            } catch (err) {
                console.error("Lỗi khi tải dữ liệu:", err);
                setMessage("Không thể tải dữ liệu sản phẩm hoặc danh mục!");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setProduct((prevProduct) => ({
            ...prevProduct,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith("image/")) {
            setNewSelectedFile(file); 
            setImagePreview(URL.createObjectURL(file)); // Xem trước ảnh MỚI
        } else {
            setNewSelectedFile(null);
            
            // === 3. SỬA LOGIC KHI HỦY CHỌN ẢNH ===
            // Quay lại ảnh CŨ (dùng logic giống như useEffect)
            if (product.image) {
                 if (product.image.startsWith('http')) {
                    setImagePreview(product.image);
                 } else {
                    setImagePreview(FileUploadService.getImageUrl(product.image, "products"));
                 }
            } else {
                setImagePreview(null); // Không có ảnh
            }
        }
    };

    // --- (Các hàm handleVariantChange, handleAddVariant, handleRemoveVariant giữ nguyên) ---
    const handleVariantChange = (index, event) => {
        const { name, value } = event.target;
        const newVariants = [...variants];
        newVariants[index][name] = (name === 'quantity') ? parseInt(value) || 0 : value;
        setVariants(newVariants);
    };
    const handleAddVariant = () => {
        setVariants([...variants, { size: '', quantity: 0 }]);
    };
    const handleRemoveVariant = (indexToRemove) => {
        if (variants.length <= 1) {
            alert("Sản phẩm phải có ít nhất một size.");
            return;
        }
        setVariants(variants.filter((_, index) => index !== indexToRemove));
    };
    // --- (Hàm handleSubmit giữ nguyên) ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Validation
        if (!product.name.trim()) { alert("Tên sản phẩm không được để trống!"); return; }
        if (!product.price || parseFloat(product.price) < 0) { alert("Giá sản phẩm không hợp lệ!"); return; }
        if (!product.categoryId) { alert("Vui lòng chọn một danh mục!"); return; }
        if (variants.some(v => !v.size.trim() || v.quantity < 0)) {
             alert("Vui lòng điền đầy đủ tên size và số lượng (>= 0) cho tất cả biến thể.");
             return;
        }

        setIsSubmitting(true);
        setMessage("");

        try {
            // Giữ lại URL/tên file ảnh cũ
            let finalImageUrl = product.image; 

            // BƯỚC 1: Nếu người dùng đã chọn một file ảnh MỚI
            if (newSelectedFile) {
                setMessage("Đang tải ảnh mới lên Cloudinary...");
                // (Giả sử bạn dùng Cloudinary)
                const newUrl = await CloudinaryService.upload(newSelectedFile, "products"); 
                // (Nếu bạn dùng FileUploadService cũ)
                // const uploadResponse = await FileUploadService.upload(newSelectedFile, "products");
                // const newUrl = uploadResponse.data.fileName; 
                
                if (!newUrl) {
                    throw new Error("Không nhận được ảnh mới.");
                }
                finalImageUrl = newUrl; // Lấy URL/tên file mới
            }

            // BƯỚC 2: Tạo dữ liệu sản phẩm cuối cùng
            const finalProductData = { 
                ...product, 
                image: finalImageUrl,
                price: parseFloat(product.price) || 0,
                salePrice: parseFloat(product.salePrice) || 0,
                categoryId: parseInt(product.categoryId),
                variants: variants.map(v => ({
                    id: v.id || null, 
                    size: v.size,
                    quantity: parseInt(v.quantity) || 0
                }))
            };

            // BƯỚC 3: Gọi API cập nhật
            setMessage("Đang cập nhật sản phẩm...");
            await ProductService.update(id, finalProductData);

            // BƯỚC 4: Thông báo và redirect
            setMessage("Cập nhật sản phẩm thành công! Sẽ tự động quay lại sau 2 giây.");
            setTimeout(() => navigate("/admin/products"), 2000);

        } catch (err) {
            console.error("Lỗi khi cập nhật sản phẩm:", err);
            const errorMsg = err.response?.data?.message || err.message || "Cập nhật thất bại! Vui lòng thử lại.";
            setMessage(errorMsg);
            setIsSubmitting(false);
        }
    };

    // --- (Phần render JSX giữ nguyên) ---
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[500px]">
                <Loader2 size={40} className="animate-spin text-blue-500" />
                <span className="ml-3 text-lg text-gray-600">Đang tải dữ liệu sản phẩm...</span>
            </div>
        );
    }

    return (
        <>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Chỉnh sửa sản phẩm</h1>
                    <p className="text-gray-500 mt-1">Cập nhật thông tin chi tiết cho sản phẩm ID: {id}.</p>
                </div>
                <button
                    onClick={() => navigate("/admin/products")}
                    className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg transition duration-200"
                >
                    <ArrowLeft size={20} />
                    Quay lại danh sách
                </button>
            </div>

            {/* Thông báo */}
            {message && (
                <div className={`mb-4 p-4 rounded-lg text-center font-medium ${
                    message.includes("thành công") ? "bg-green-100 text-green-800" 
                    : (message.includes("Đang tải") || message.includes("Đang cập nhật") ? "bg-blue-100 text-blue-800" : "bg-red-100 text-red-800")
                }`}>
                    {message.includes("Đang") && <Loader2 size={20} className="inline-block animate-spin mr-2" />}
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* --- Cột trái: Thông tin chính --- */}
                    <div className="lg:col-span-2 bg-white p-8 rounded-xl shadow-lg space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">Tên sản phẩm</label>
                            <input type="text" id="name" name="name" value={product.name || ''} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500 transition" required />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-2">Giá gốc (VNĐ)</label>
                                <input type="number" id="price" name="price" min="0" value={product.price || ''} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500 transition" required />
                            </div>
                            <div>
                                <label htmlFor="salePrice" className="block text-sm font-semibold text-gray-700 mb-2">Giá khuyến mãi (VNĐ)</label>
                                <input type="number" id="salePrice" name="salePrice" min="0" value={product.salePrice || ''} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-green-500 focus:border-green-500 transition" placeholder="Bỏ trống nếu không giảm giá" />
                            </div>
                        </div>

                        {/* --- KHU VỰC VARIANTS MỚI --- */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-3">Kích cỡ & Số lượng</h3>
                            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-2">
                                {variants.map((variant, index) => (
                                    <VariantInputRow
                                        key={index} 
                                        index={index}
                                        variant={variant}
                                        onChange={handleVariantChange}
                                        onRemove={handleRemoveVariant}
                                    />
                                ))}
                                <button
                                    type="button"
                                    onClick={handleAddVariant}
                                    className="mt-2 inline-flex items-center px-3 py-1.5 border border-dashed border-gray-400 text-sm font-medium rounded text-gray-700 hover:bg-gray-100 focus:outline-none"
                                >
                                    <Plus size={16} className="mr-1" />
                                    Thêm Size
                                </button>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">Mô tả chi tiết</label>
                            <textarea id="description" name="description" value={product.description || ''} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500 transition" rows={5} />
                        </div>
                    </div>

                    {/* --- Cột phải: Danh mục, Trạng thái, Hình ảnh --- */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-white p-8 rounded-xl shadow-lg">
                            <label htmlFor="categoryId" className="block text-sm font-semibold text-gray-700 mb-2">Danh mục sản phẩm</label>
                            <select id="categoryId" name="categoryId" value={product.categoryId || ''} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500 transition" required>
                                <option value="" disabled>-- Chọn danh mục --</option>
                                {categories.map((category) => (<option key={category.id} value={category.id}>{category.name}</option>))}
                            </select>
                        </div>

                        <div className="bg-white p-8 rounded-xl shadow-lg">
                            <label className="block text-sm font-semibold text-gray-700 mb-4">Trạng thái xuất bản</label>
                            <div className="flex items-center justify-between">
                                <span className={`font-medium ${product.status ? 'text-green-600' : 'text-gray-500'}`}>
                                    {product.status ? 'Công khai / Hiển thị' : 'Bản nháp / Ẩn'}
                                </span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" name="status" className="sr-only peer" checked={product.status || false} onChange={handleChange} />
                                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-xl shadow-lg">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Hình ảnh sản phẩm</label>
                            <div className="mt-2 text-center">
                                <img
                                    src={imagePreview || "https://via.placeholder.com/150"}
                                    alt="Xem trước"
                                    className="mx-auto h-40 w-40 object-cover rounded-md shadow-md mb-4 bg-gray-100"
                                    onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/150" }}
                                />
                                <label htmlFor="file-upload" className="cursor-pointer inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 rounded-lg border border-gray-300 transition duration-200">
                                    <RefreshCw size={18} />
                                    Thay đổi ảnh
                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                                </label>
                                {newSelectedFile && <p className="mt-2 text-sm text-gray-500">Đã chọn: {newSelectedFile.name}</p>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Nút Submit */}
                <div className="mt-8 flex justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting || loading}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
                </div>
            </form>
        </>
    );
}