// src/admin/product/AddProduct.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProductService from "../../api/ProductService";
import CategoryService from "../../api/CategoryService";
import CloudinaryService from "../../api/CloudinaryService"; // Giả sử dùng Cloudinary
import { ArrowLeft, UploadCloud, Loader2, Plus, X } from "lucide-react";

// --- Component con để quản lý 1 dòng variant (Size/Số lượng) ---
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


export default function AddProduct() {
    const [product, setProduct] = useState({
        name: "",
        price: "",
        salePrice: "",
        description: "",
        // quantity: "", // <-- ĐÃ XÓA
        categoryId: "",
        image: "", 
        status: true,
    });

    // --- STATE MỚI CHO VARIANTS ---
    const [variants, setVariants] = useState([
        { size: 'One Size', quantity: 0 } // Bắt đầu với 1 dòng "One Size"
    ]);

    const [categories, setCategories] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        CategoryService.getAll()
            .then((res) => {
                setCategories(res.data);
                // Tự động chọn danh mục đầu tiên
                if (res.data.length > 0) {
                     setProduct(p => ({ ...p, categoryId: res.data[0].id }));
                }
            })
            .catch((error) => console.error("Không thể tải danh sách danh mục!", error));
    }, []);

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
            setSelectedFile(file);
            setImagePreview(URL.createObjectURL(file));
        } else {
            setSelectedFile(null);
            setImagePreview(null);
        }
    };

    // --- LOGIC MỚI CHO VARIANTS ---
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
    // --- KẾT THÚC LOGIC VARIANTS ---

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation
        if (parseFloat(product.price) < 0) { alert("Giá sản phẩm không được là số âm!"); return; }
        if (product.salePrice && parseFloat(product.salePrice) < 0) { alert("Giá khuyến mãi không được là số âm!"); return; }
        if (product.salePrice && parseFloat(product.salePrice) >= parseFloat(product.price)) { alert("Giá khuyến mãi phải nhỏ hơn giá gốc!"); return; }
        if (!product.categoryId) { alert("Vui lòng chọn một danh mục!"); return; }
        if (!selectedFile) { alert("Vui lòng chọn một hình ảnh cho sản phẩm!"); return; }
        if (variants.some(v => !v.size.trim() || v.quantity < 0)) {
             alert("Vui lòng điền đầy đủ tên size và số lượng (>= 0) cho tất cả biến thể.");
             return;
        }

        setIsSubmitting(true);
        setMessage("");

        try {
            setMessage("Đang tải ảnh lên Cloudinary...");
            const imageUrl = await CloudinaryService.upload(selectedFile, "products");
            if (!imageUrl) {
                throw new Error("Không nhận được URL ảnh từ Cloudinary.");
            }

            // BƯỚC 2: Tạo product data với URL và variants
            // Lọc bỏ 'quantity' cũ (nếu có) khỏi object product
            const { quantity, ...productBase } = product; 
            
            const productData = { 
                ...productBase, 
                image: imageUrl,
                price: parseFloat(product.price) || 0,
                salePrice: parseFloat(product.salePrice) || 0,
                categoryId: parseInt(product.categoryId),
                variants: variants.map(v => ({ // Thêm variants
                    size: v.size,
                    quantity: parseInt(v.quantity) || 0
                }))
            };

            setMessage("Đang tạo sản phẩm...");
            // Sử dụng .add() hoặc .create() tùy theo ProductService của bạn
            await ProductService.create(productData); // Hoặc ProductService.create(productData)

            setMessage("Thêm sản phẩm thành công! Sẽ tự động quay lại sau 2 giây.");
            setTimeout(() => navigate("/admin/products"), 2000);

        } catch (err) {
            console.error("Lỗi khi thêm sản phẩm:", err);
            const errorMsg = err.response?.data?.message || err.message || "Thêm sản phẩm thất bại! Vui lòng thử lại.";
            setMessage(errorMsg);
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Tạo sản phẩm mới</h1>
                    <p className="text-gray-500 mt-1">Điền thông tin chi tiết cho sản phẩm của bạn.</p>
                </div>
                <button
                    onClick={() => navigate("/admin/products")}
                    className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg transition duration-200"
                >
                    <ArrowLeft size={20} />
                    Quay lại
                </button>
            </div>

            {message && (
                <div className={`mb-4 p-4 rounded-lg text-center font-medium ${
                    message.includes("thành công") ? "bg-green-100 text-green-800" 
                    : (message.includes("Đang tải") || message.includes("Đang tạo") ? "bg-blue-100 text-blue-800" : "bg-red-100 text-red-800")
                }`}>
                    {message.includes("Đang") && <Loader2 size={20} className="inline-block animate-spin mr-2" />}
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cột trái: Thông tin chính */}
                    <div className="lg:col-span-2 bg-white p-8 rounded-xl shadow-lg space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Tên sản phẩm</label>
                            <input type="text" name="name" value={product.name} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500 transition" required />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Giá gốc (VNĐ)</label>
                                <input type="number" name="price" min="0" value={product.price} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500 transition" required />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Giá khuyến mãi (VNĐ)</label>
                                <input type="number" name="salePrice" min="0" value={product.salePrice} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-green-500 focus:border-green-500 transition" placeholder="Bỏ trống nếu không giảm giá" />
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
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Mô tả chi tiết</label>
                            <textarea name="description" value={product.description} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500 transition" rows={5} />
                        </div>
                    </div>

                    {/* Cột phải: Danh mục, Hình ảnh, và Trạng thái */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-white p-8 rounded-xl shadow-lg">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Danh mục sản phẩm</label>
                            <select name="categoryId" value={product.categoryId} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500 transition" required>
                                <option value="" disabled>-- Chọn danh mục --</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>{category.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-lg">
                            <label className="block text-sm font-semibold text-gray-700 mb-4">Trạng thái xuất bản</label>
                            <div className="flex items-center justify-between">
                                <span className={`font-medium ${product.status ? 'text-green-600' : 'text-gray-500'}`}>
                                    {product.status ? 'Công khai / Hiển thị' : 'Bản nháp / Ẩn'}
                                </span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" name="status" className="sr-only peer" checked={product.status} onChange={handleChange} />
                                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-lg">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Hình ảnh sản phẩm</label>
                            <div className="mt-2 flex justify-center rounded-lg border-2 border-dashed border-gray-300 px-6 py-10">
                                <div className="text-center">
                                    {imagePreview ? ( <img src={imagePreview} alt="Xem trước" className="mx-auto h-40 w-40 object-cover rounded-md" /> ) : (
                                        <>
                                            <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                                            <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                                <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-semibold text-blue-600 hover:text-blue-500">
                                                    <span>Tải ảnh lên</span>
                                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                                                </label>
                                                <p className="pl-1">hoặc kéo và thả</p>
                                            </div>
                                            <p className="text-xs leading-5 text-gray-500">PNG, JPG, GIF</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Nút Submit */}
                <div className="mt-8 flex justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-300 disabled:bg-gray-400"
                    >
                        {isSubmitting ? 'Đang tạo...' : 'Tạo sản phẩm'}
                    </button>
                </div>
            </form>
        </>
    );
}