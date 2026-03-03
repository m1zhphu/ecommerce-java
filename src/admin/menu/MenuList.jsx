import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MenuService from "../../api/MenuService"; // Import service cho Menu
import { PlusCircle, List, Search, Edit, Trash2 } from "lucide-react"; // Import icons phù hợp

export default function MenuList() {
    const [menus, setMenus] = useState([]); // Danh sách menu gốc từ API
    const [filteredMenus, setFilteredMenus] = useState([]); // Danh sách để hiển thị
    const [keyword, setKeyword] = useState("");
    const [positionFilter, setPositionFilter] = useState(""); // Lọc theo vị trí (main_menu, footer_menu)
    const [statusFilter, setStatusFilter] = useState(""); // Lọc theo trạng thái (true/false)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Hàm tải dữ liệu menu gốc
    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            // Sử dụng MenuService để lấy tất cả menu
            // Lưu ý: Hàm này cần token Admin vì gọi từ trang admin
            const res = await MenuService.getAllAdmin(); // <-- Giả sử có hàm getAllAdmin cần token
            // Nếu MenuService.getAll() của bạn không cần token (trùng với client), bạn cần xem lại
            
            // Xử lý dữ liệu trả về (kiểm tra HATEOAS nếu có)
            const menuData = res.data._embedded 
                            ? res.data._embedded.menuDtoList 
                            : res.data;

            setMenus(menuData);
            setFilteredMenus(menuData); // Ban đầu hiển thị tất cả
        } catch (err) {
            console.error("Lỗi khi tải danh sách menu:", err);
            setError("Không thể tải danh sách menu!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Hàm áp dụng tất cả các bộ lọc hiện tại
    const applyFilters = () => {
        setError(null);
        let tempMenus = [...menus]; // Luôn lọc từ danh sách gốc

        // Lọc theo keyword (tìm kiếm theo Tên menu)
        const lowerKeyword = keyword.toLowerCase().trim();
        if (lowerKeyword) {
            tempMenus = tempMenus.filter(
                (m) => m.name.toLowerCase().includes(lowerKeyword)
            );
        }

        // Lọc theo vị trí (position)
        if (positionFilter) {
            tempMenus = tempMenus.filter((m) => m.position === positionFilter);
        }

        // Lọc theo trạng thái (status)
        if (statusFilter !== "") { // Chú ý kiểm tra khác "" vì giá trị là boolean (true/false)
            const statusBool = statusFilter === "true"; // Chuyển "true"/"false" thành boolean
            tempMenus = tempMenus.filter((m) => m.status === statusBool);
        }

        setFilteredMenus(tempMenus); // Cập nhật danh sách hiển thị

        if (tempMenus.length === 0) {
            setError("Không tìm thấy menu phù hợp.");
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
        setPositionFilter("");
        setStatusFilter("");
        setFilteredMenus(menus); // Reset về danh sách gốc
        setError(null);
    };

    // Hàm xử lý xóa menu
    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa menu này?")) return;
        try {
            await MenuService.remove(id); // Gọi API xóa (cần token Admin)
            fetchData(); // Tải lại danh sách sau khi xóa
        } catch (err) {
            console.error("Lỗi khi xóa menu:", err);
            alert("Lỗi khi xóa menu!");
        }
    };


    return (
        <>
            {/* Header */}
            <div className="flex justify-between items-center mb-6 gap-4">
                {/* Tiêu đề */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                        <List size={32} className="text-purple-600" /> {/* Đổi icon */}
                        Quản Lý Menu
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Quản lý các mục menu hiển thị trên trang web.
                    </p>
                </div>

                {/* Bộ lọc/Tìm kiếm và Nút Thêm */}
                <div className="flex items-center gap-4">
                    {/* Card Tìm kiếm và Lọc */}
                    <div className="bg-white p-3 rounded-xl shadow-md flex items-center gap-3 border border-gray-200">
                        {/* Ô tìm kiếm theo Tên */}
                        <div className="relative">
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Tìm tên menu..."
                                className="border border-gray-300 rounded-md p-2 pl-9 focus:ring-blue-500 focus:border-blue-500 transition text-sm w-48"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                onKeyDown={handleSearchKeyDown}
                            />
                        </div>

                        {/* Dropdown lọc Vị trí */}
                        <select
                            className="border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm w-36"
                            value={positionFilter}
                            onChange={(e) => setPositionFilter(e.target.value)}
                        >
                            <option value="">-- Vị trí --</option>
                            <option value="main_menu">Main Menu</option>
                            <option value="footer_menu">Footer Menu</option>
                            {/* Thêm các vị trí khác nếu có */}
                        </select>

                        {/* Dropdown lọc Trạng thái */}
                        <select
                            className="border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm w-36"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="">-- Trạng thái --</option>
                            <option value="true">Hiển thị</option>
                            <option value="false">Đang ẩn</option>
                        </select>
                        
                        {/* Nút Lọc/Tìm */}
                        <button onClick={handleFilterAndSearch} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-3 rounded-md transition duration-200 text-sm whitespace-nowrap">Lọc</button>

                        {/* Nút Reset */}
                        <button
                            onClick={handleReset}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-3 rounded-md transition duration-200 text-sm"
                        >
                            Reset
                        </button>
                    </div>

                    {/* Nút Thêm Menu */}
                    <button
                        onClick={() => navigate("/admin/add-menu")} // Đổi đường dẫn
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 whitespace-nowrap"
                    >
                        <PlusCircle size={20} />
                        Thêm Menu
                    </button>
                </div>
            </div>

            {/* Thông báo Lỗi */}
            {error && (
                <p className="mb-4 p-4 rounded-lg bg-red-100 text-red-800 text-center">
                    {error}
                </p>
            )}

            {/* Bảng danh sách menu */}
            <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3 border-b-2 text-left text-sm font-semibold text-gray-600 w-16">ID</th>
                            <th className="p-3 border-b-2 text-left text-sm font-semibold text-gray-600">Tên Menu</th>
                            <th className="p-3 border-b-2 text-left text-sm font-semibold text-gray-600">Đường dẫn (Link)</th>
                            <th className="p-3 border-b-2 text-center text-sm font-semibold text-gray-600">Thứ tự</th>
                            <th className="p-3 border-b-2 text-center text-sm font-semibold text-gray-600">Menu Cha (ID)</th>
                            <th className="p-3 border-b-2 text-left text-sm font-semibold text-gray-600">Vị trí</th>
                            <th className="p-3 border-b-2 text-center text-sm font-semibold text-gray-600">Trạng thái</th>
                            <th className="p-3 border-b-2 text-center text-sm font-semibold text-gray-600">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="8" className="text-center p-6 text-gray-500">Đang tải dữ liệu...</td></tr>
                        ) : filteredMenus.length > 0 ? (
                            filteredMenus.map((m) => (
                                <tr key={m.id} className="hover:bg-gray-50">
                                    <td className="p-3 border-b text-center">{m.id}</td>
                                    <td className="p-3 border-b font-medium">{m.name}</td>
                                    <td className="p-3 border-b text-blue-600 hover:underline">
                                        <a href={m.link} target="_blank" rel="noopener noreferrer">{m.link}</a>
                                    </td>
                                    <td className="p-3 border-b text-center">{m.displayOrder}</td>
                                    <td className="p-3 border-b text-center">{m.parentId || "-"}</td>
                                    <td className="p-3 border-b">{m.position || "-"}</td>
                                    <td className="p-3 border-b text-center">
                                        {m.status ? (
                                            <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-200 rounded-full">Hiển thị</span>
                                        ) : (
                                            <span className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-200 rounded-full">Đang ẩn</span>
                                        )}
                                    </td>
                                    <td className="p-3 border-b text-center whitespace-nowrap">
                                        <button 
                                            onClick={() => navigate(`/admin/edit-menu/${m.id}`)} // Đổi đường dẫn
                                            className="text-blue-500 hover:text-blue-700 font-semibold py-1 px-2 mr-2 rounded transition duration-200"
                                            title="Sửa"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(m.id)}
                                            className="text-red-500 hover:text-red-700 font-semibold py-1 px-2 rounded transition duration-200"
                                            title="Xóa"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="8" className="text-center p-6 text-gray-500">Không tìm thấy menu nào.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
}