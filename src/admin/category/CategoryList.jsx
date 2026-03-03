import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CategoryService from "../../api/CategoryService"; // Import service cho Category
import { PlusCircle, ListChecks, Search, Edit, Trash2 } from "lucide-react"; // Import icons phù hợp
import FileUploadService from "../../api/FileUploadService";

export default function CategoryList() {
    const [categories, setCategories] = useState([]); // Danh sách gốc từ API
    const [filteredCategories, setFilteredCategories] = useState([]); // Danh sách để hiển thị
    const [keyword, setKeyword] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Hàm tải dữ liệu category gốc
    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            // Sử dụng CategoryService để lấy tất cả category (cần token Admin)
            const res = await CategoryService.getAllAdmin(); // <-- Gọi hàm cần token Admin

            // Xử lý dữ liệu trả về (kiểm tra HATEOAS nếu có)
            const categoryData =
                res.data?._embedded?.categoryDtoList ?? res.data ?? [];

            setCategories(categoryData);
            setFilteredCategories(categoryData); // Ban đầu hiển thị tất cả
        } catch (err) {
            console.error("Lỗi khi tải danh sách danh mục:", err);
            // Kiểm tra lỗi 401/403 (Unauthorized/Forbidden)
            if (
                err.response &&
                (err.response.status === 401 || err.response.status === 403)
            ) {
                setError(
                    "Bạn không có quyền truy cập tài nguyên này. Vui lòng đăng nhập lại."
                );
            } else {
                setError("Không thể tải danh sách danh mục!");
            }
            setCategories([]); // Đặt thành mảng rỗng nếu lỗi
            setFilteredCategories([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Chỉ chạy 1 lần khi component mount

    // Hàm áp dụng bộ lọc tìm kiếm
    const applyFilters = () => {
        setError(null);
        let tempCategories = [...categories]; // Luôn lọc từ danh sách gốc

        // Lọc theo keyword (tìm kiếm theo Tên danh mục)
        const lowerKeyword = keyword.toLowerCase().trim();
        if (lowerKeyword) {
            tempCategories = tempCategories.filter(
                (c) =>
                    c.name.toLowerCase().includes(lowerKeyword) ||
                    (c.description && c.description.toLowerCase().includes(lowerKeyword)) // Tìm cả trong mô tả
            );
        }

        setFilteredCategories(tempCategories); // Cập nhật danh sách hiển thị

        if (tempCategories.length === 0 && categories.length > 0) {
            // Chỉ báo lỗi nếu danh sách gốc không rỗng
            setError("Không tìm thấy danh mục phù hợp.");
        }
    };

    // Hàm xử lý khi nhấn nút Lọc hoặc Enter
    const handleFilterAndSearch = () => {
        applyFilters();
    };
    const handleSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            handleFilterAndSearch();
        }
    };

    // Hàm reset bộ lọc
    const handleReset = () => {
        setKeyword("");
        setFilteredCategories(categories); // Reset về danh sách gốc
        setError(null);
    };

    // Hàm xử lý xóa category
    const handleDelete = async (id, name) => {
        // Thêm name để hiển thị xác nhận
        if (!window.confirm(`Bạn có chắc muốn xóa danh mục "${name}" không?`))
            return;
        try {
            await CategoryService.remove(id); // Gọi API xóa (cần token Admin)
            // Tải lại danh sách sau khi xóa thành công
            fetchData();
        } catch (err) {
            console.error("Lỗi khi xóa danh mục:", err);
            alert("Lỗi khi xóa danh mục! Vui lòng thử lại.");
        }
    };

    return (
        <>
            {/* Header */}
            <div className="flex justify-between items-center mb-6 gap-4">
                {/* Tiêu đề */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                        <ListChecks size={32} className="text-green-600" /> {/* Đổi icon */}
                        Quản Lý Danh Mục
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Quản lý các danh mục sản phẩm của cửa hàng.
                    </p>
                </div>

                {/* Bộ lọc/Tìm kiếm và Nút Thêm */}
                <div className="flex items-center gap-4">
                    {/* Card Tìm kiếm */}
                    <div className="bg-white p-3 rounded-xl shadow-md flex items-center gap-3 border border-gray-200">
                        {/* Ô tìm kiếm theo Tên/Mô tả */}
                        <div className="relative">
                            <Search
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />
                            <input
                                type="text"
                                placeholder="Tìm tên, mô tả..."
                                className="border border-gray-300 rounded-md p-2 pl-9 focus:ring-blue-500 focus:border-blue-500 transition text-sm w-60" // Tăng chiều rộng
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                onKeyDown={handleSearchKeyDown}
                            />
                        </div>

                        {/* Nút Lọc/Tìm */}
                        <button
                            onClick={handleFilterAndSearch}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-3 rounded-md transition duration-200 text-sm whitespace-nowrap"
                        >
                            Tìm
                        </button>

                        {/* Nút Reset */}
                        <button
                            onClick={handleReset}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-3 rounded-md transition duration-200 text-sm"
                        >
                            Reset
                        </button>
                    </div>

                    {/* Nút Thêm Danh Mục */}
                    <button
                        onClick={() => navigate("/admin/add-category")} // Đường dẫn đến trang thêm mới
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 whitespace-nowrap"
                    >
                        <PlusCircle size={20} />
                        Thêm Danh Mục
                    </button>
                </div>
            </div>

            {/* Thông báo Lỗi */}
            {error && (
                <p className="mb-4 p-4 rounded-lg bg-red-100 text-red-800 text-center">
                    {error}
                </p>
            )}

            {/* Bảng danh sách category */}
            <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
                {/* *** SỬA LỖI WHITESPACE ***
                  Xóa tất cả khoảng trắng và dòng mới giữa các thẻ table, thead, tbody, tr
                */}
                <table className="w-full table-auto">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3 border-b-2 text-center text-sm font-semibold text-gray-600 w-16">
                                ID
                            </th>
                            <th className="p-3 border-b-2 text-center text-sm font-semibold text-gray-600 w-24">
                                Ảnh
                            </th>
                            <th className="p-3 border-b-2 text-left text-sm font-semibold text-gray-600">
                                Tên Danh Mục
                            </th>
                            <th className="p-3 border-b-2 text-left text-sm font-semibold text-gray-600">
                                Mô Tả
                            </th>
                            <th className="p-3 border-b-2 text-center text-sm font-semibold text-gray-600 w-32">
                                Hành động
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td
                                    colSpan="6"
                                    className="text-center p-6 text-gray-500 animate-pulse"
                                >
                                    Đang tải dữ liệu...
                                </td>
                            </tr>
                        ) : filteredCategories.length > 0 ? (
                            filteredCategories.map((cat) => (
                                <tr key={cat.id} className="hover:bg-gray-50 align-middle">
                                    <td className="p-3 border-b text-center">{cat.id}</td>
                                    <td className="p-3 border-b text-center">
                                        <img
                                            src={FileUploadService.getImageUrl(
                                                cat.image,
                                                "categories"
                                            )}
                                            alt={cat.name}
                                            className="h-12 w-12 object-contain rounded-md inline-block bg-gray-100"
                                            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/80/F3F4F6/9CA3AF?text=No" }}
                                        />
                                    </td>
                                    <td className="p-3 border-b font-medium text-gray-800">
                                        {cat.name}
                                    </td>
                                    <td className="p-3 border-b text-gray-600 text-sm max-w-md truncate">
                                        {cat.description || "-"}
                                    </td> 
                                    <td className="p-3 border-b text-center whitespace-nowrap">
                                        <button
                                            onClick={() => navigate(`/admin/edit-category/${cat.id}`)} 
                                            className="text-blue-500 hover:text-blue-700 font-semibold py-1 px-2 mr-2 rounded transition duration-200"
                                            title="Sửa"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(cat.id, cat.name)} 
                                            className="text-red-500 hover:text-red-700 font-semibold py-1 px-2 rounded transition duration-200"
                                            title="Xóa"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center p-6 text-gray-500">
                                    Không tìm thấy danh mục nào.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
}