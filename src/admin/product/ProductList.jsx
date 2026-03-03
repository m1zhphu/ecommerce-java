// src/admin/product/ProductList.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import ProductService from "../../api/ProductService";
import FileUploadService from "../../api/FileUploadService";
import { PlusCircle, Search, ShoppingCart, Edit, Trash2 } from "lucide-react";

export default function ProductList() {
    const [products, setProducts] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Hàm tải dữ liệu (có thể khác nhau tùy vào service của bạn)
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        const params = {
            keyword: keyword.trim() || null,
            minPrice: minPrice.trim() ? parseFloat(minPrice) : null,
            maxPrice: maxPrice.trim() ? parseFloat(maxPrice) : null,
            sortBy: 'id',
            sortDir: 'desc',
        };
        
        // Validation giá
        if (params.minPrice === null && minPrice.trim() !== '') {
            setError("Giá tối thiểu không hợp lệ.");
            setLoading(false);
            return;
        }
        if (params.maxPrice === null && maxPrice.trim() !== '') {
            setError("Giá tối đa không hợp lệ.");
            setLoading(false);
            return;
        }

        try {
            // Tùy chỉnh hàm gọi API theo service của bạn (getAllWithFilter hoặc getAll)
            const res = await ProductService.getAllWithFilter(params); 
            const productData = res.data._embedded?.productDtoList || res.data || [];
            setProducts(productData);
            setError(null);
        } catch (err) {
            setError("Không thể tải hoặc lọc dữ liệu sản phẩm!");
            console.error("Lỗi Fetch/Filter:", err);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    }, [keyword, minPrice, maxPrice]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSearchClick = () => {
        fetchData();
    };

    const handleSearchKeyDown = (e) => {
        if (e.key === 'Enter') {
            fetchData();
        }
    };

    const handleReset = () => {
        setKeyword("");
        setMinPrice("");
        setMaxPrice("");
        // Cần gọi lại fetchData nếu muốn reset ngay lập tức
        // fetchData(); // Bỏ comment nếu muốn
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
        try {
            // Tùy chỉnh hàm gọi API theo service của bạn (remove hoặc delete)
            await ProductService.remove(id); 
            fetchData(); // Tải lại danh sách
        } catch (err) {
            alert("Lỗi khi xóa sản phẩm! Vui lòng kiểm tra quyền hạn.");
        }
    };

    return (
        <>
            <div className="flex justify-between items-center mb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                        <ShoppingCart size={32} className="text-blue-600" />
                        Danh sách sản phẩm
                    </h1>
                    <p className="text-gray-500 mt-1">Quản lý toàn bộ sản phẩm của bạn tại đây.</p>
                </div>

                <div className="flex items-start gap-4">
                    {/* ... (Phần search bar giữ nguyên) ... */}
                    <div className="bg-white p-3 rounded-xl shadow-md w-full max-w-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="relative flex-grow">
                                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Tìm theo tên..."
                                    className="border border-gray-300 rounded-lg p-2 pl-9 focus:ring-blue-500 focus:border-blue-500 transition text-sm w-full"
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                    onKeyDown={handleSearchKeyDown}
                                />
                            </div>
                            <button onClick={handleSearchClick} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-3 rounded-lg transition duration-200 text-sm whitespace-nowrap">Tìm kiếm</button>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="number" placeholder="Giá từ" className="w-1/3 border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
                            <input type="number" placeholder="Giá đến" className="w-1/3 border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
                            <button onClick={handleSearchClick} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-3 rounded-lg transition duration-200 text-sm whitespace-nowrap">Lọc giá</button>
                            <button onClick={handleReset} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-3 rounded-lg transition duration-200 text-sm">Reset</button>
                        </div>
                    </div>
                    
                    <button
                        onClick={() => navigate("/admin/add-product")}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 whitespace-nowrap"
                    >
                        <PlusCircle size={20} />
                        Thêm sản phẩm
                    </button>
                </div>
            </div>

            {error && <p className="mb-4 p-4 rounded-lg bg-red-100 text-red-800 text-center">{error}</p>}

            <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3 border-b-2 text-left text-sm font-semibold text-gray-600">ID</th>
                            <th className="p-3 border-b-2 text-left text-sm font-semibold text-gray-600">Hình ảnh</th>
                            <th className="p-3 border-b-2 text-left text-sm font-semibold text-gray-600">Tên sản phẩm</th>
                            <th className="p-3 border-b-2 text-left text-sm font-semibold text-gray-600">Giá gốc</th>
                            <th className="p-3 border-b-2 text-left text-sm font-semibold text-gray-600">Giá KM</th>
                            <th className="p-3 border-b-2 text-center text-sm font-semibold text-gray-600">Tổng SL</th>
                            <th className="p-3 border-b-2 text-left text-sm font-semibold text-gray-600">Danh mục</th>
                            <th className="p-3 border-b-2 text-center text-sm font-semibold text-gray-600">Trạng thái</th>
                            <th className="p-3 border-b-2 text-center text-sm font-semibold text-gray-600">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="9" className="text-center p-4 text-gray-500">Đang tải dữ liệu sản phẩm...</td></tr>
                        ) : products.length > 0 ? (
                            products.map((p) => (
                                <tr key={p.id} className="hover:bg-gray-50">
                                    <td className="p-3 border-b">{p.id}</td>
                                    <td className="p-3 border-b">
                                        {p.image ? (
                                            <img
                                                // Nếu dùng Cloudinary, p.image là URL đầy đủ
                                                src={p.image.startsWith('http') ? p.image : FileUploadService.getImageUrl(p.image, "products")}
                                                alt={p.name}
                                                className="h-12 w-12 object-cover rounded-md"
                                                onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/150" }}
                                            />
                                        ) : (
                                            <div className="h-12 w-12 bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-500">No Img</div>
                                        )}
                                    </td>
                                    <td className="p-3 border-b font-medium text-gray-800">{p.name}</td>
                                    <td className={`p-3 border-b text-gray-600 ${p.salePrice && p.salePrice > 0 ? 'line-through text-red-400' : ''}`}>{p.price.toLocaleString()} VNĐ</td>
                                    <td className="p-3 border-b font-semibold text-green-600">{p.salePrice && p.salePrice > 0 ? `${p.salePrice.toLocaleString()} VNĐ` : '—'}</td>
                                    
                                    {/* === THAY ĐỔI: Sử dụng totalQuantity từ DTO mới === */}
                                    <td className="p-3 border-b text-center text-gray-800 font-bold">{p.totalQuantity}</td>

                                    <td className="p-3 border-b text-gray-600">{p.categoryName}</td>
                                    <td className="p-3 border-b text-center">
                                        {p.status ? (
                                            <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-200 rounded-full">Hiển thị</span>
                                        ) : (
                                            <span className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-200 rounded-full">Đang ẩn</span>
                                        )}
                                    </td>
                                    <td className="p-3 border-b text-center">
                                        <button onClick={() => navigate(`/admin/edit-product/${p.id}`)}
                                            className="text-blue-500 hover:text-blue-700 font-semibold py-1 px-3 mr-2 rounded transition duration-200">
                                            <Edit size={16} className="inline-block" /> Sửa
                                        </button>
                                        <button onClick={() => handleDelete(p.id)}
                                            className="text-red-500 hover:text-red-700 font-semibold py-1 px-3 rounded transition duration-200">
                                            <Trash2 size={16} className="inline-block" /> Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="9" className="text-center p-4 text-gray-500">Không tìm thấy sản phẩm nào.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
}