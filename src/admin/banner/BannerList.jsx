import React, { useState, useEffect } from 'react';
import BannerService from '../../api/BannerService'; // Import service
import { Link, useNavigate } from 'react-router-dom';
import { Image, PlusCircle, Search, Edit, Trash2 } from 'lucide-react'; // Icons

// Giả sử ảnh banner được lưu trong thư mục uploads
import FileUploadService from '../../api/FileUploadService';
//const IMAGE_BASE_URL = "http://localhost:8080/uploads/images/banners/";

export default function BannerList() {
    const [banners, setBanners] = useState([]); // Danh sách gốc
    const [filteredBanners, setFilteredBanners] = useState([]); // Danh sách hiển thị
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState(""); // State cho ô tìm kiếm
    const navigate = useNavigate();

    // Hàm tải dữ liệu ban đầu
    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await BannerService.getAll();
            setBanners(response.data);
            setFilteredBanners(response.data); // Ban đầu hiển thị tất cả
        } catch (err) {
            console.error("Lỗi khi tải danh sách banner:", err);
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                setError("Bạn không có quyền truy cập hoặc phiên đăng nhập đã hết hạn.");
            } else {
                setError("Không thể tải danh sách banner. Vui lòng thử lại.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Hàm tìm kiếm (theo tên banner) - Giống ProductList
    const handleSearch = () => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase().trim();
        if (!lowerCaseSearchTerm) {
            setFilteredBanners(banners);
            return;
        }
        const results = banners.filter(banner =>
            banner.name && banner.name.toLowerCase().includes(lowerCaseSearchTerm)
        );
        setFilteredBanners(results);
        if (results.length === 0) {
            setError("Không tìm thấy banner với tên này!"); // Thêm thông báo nếu không có kết quả
        } else {
            setError(null); // Xóa lỗi nếu có kết quả
        }
    };

    const handleSearchKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    // Hàm reset - Giống ProductList
    const handleReset = () => {
        setSearchTerm("");
        setFilteredBanners(banners);
        setError(null);
    };

    // Hàm xóa banner - Giống ProductList
    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa banner này?")) return;
        try {
            await BannerService.remove(id);
            // Cập nhật lại danh sách sau khi xóa
            fetchData(); // Gọi lại fetchData để lấy danh sách mới nhất
            // Hoặc cập nhật state thủ công (nhanh hơn nhưng có thể không đồng bộ nếu có lỗi)
            // const updatedBanners = banners.filter(b => b.id !== id);
            // setBanners(updatedBanners);
            // setFilteredBanners(updatedBanners);
        } catch (err) {
            alert("Lỗi khi xóa banner!");
            console.error(err);
        }
    };

    // --- Render giao diện ---
    return (
        <> {/* Sử dụng Fragment */}
            {/* === SỬA LẠI HEADER === */}
            <div className="flex justify-between items-center mb-6 gap-4">
                {/* Phần tiêu đề bên trái */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                        <Image size={32} className="text-purple-600" />
                        Quản Lý Banner
                    </h1>
                    <p className="text-gray-500 mt-1">Quản lý hình ảnh quảng cáo.</p>
                </div>

                {/* Phần bên phải: Chứa Tìm kiếm và Nút Thêm */}
                <div className="flex items-center gap-4"> {/* Container cho các control bên phải */}

                    {/* --- Card Tìm kiếm (thu nhỏ) --- */}
                    <div className="bg-white p-3 rounded-xl shadow-md flex items-center gap-2 border border-gray-200"> {/* Dùng flex */}
                        <div className="relative flex-grow">
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Tìm banner..." // Ngắn gọn hơn
                                className="border border-gray-300 rounded-md p-2 pl-9 focus:ring-blue-500 focus:border-blue-500 transition text-sm w-60" // Đặt chiều rộng cố định (w-60)
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={handleSearchKeyDown}
                            />
                        </div>
                        {/* Nút Tìm và Reset thu nhỏ */}
                        <button onClick={handleSearch} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-3 rounded-md transition duration-200 text-sm whitespace-nowrap">Tìm</button>
                        <button onClick={handleReset} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-3 rounded-md transition duration-200 text-sm">Reset</button>
                    </div>
                    {/* --- Kết thúc Card Tìm kiếm --- */}

                    {/* Nút Thêm Banner */}
                    <button
                        onClick={() => navigate("/admin/add-banner")}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 whitespace-nowrap"
                    >
                        <PlusCircle size={20} />
                        Thêm Banner
                    </button>
                </div>
                {/* === KẾT THÚC SỬA ĐỔI HEADER === */}
            </div>

            {/* Thông báo lỗi */}
            {error && <p className="mb-4 p-4 rounded-lg bg-red-100 text-red-800 text-center">{error}</p>}

            <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            {/* Cập nhật các cột */}
                            <th className="p-3 border-b-2 text-left text-sm font-semibold text-gray-600 w-16">STT</th>
                            <th className="p-3 border-b-2 text-left text-sm font-semibold text-gray-600">Hình Ảnh</th>
                            <th className="p-3 border-b-2 text-left text-sm font-semibold text-gray-600">Tên Banner</th>
                            <th className="p-3 border-b-2 text-left text-sm font-semibold text-gray-600">Link URL</th>
                            <th className="p-3 border-b-2 text-center text-sm font-semibold text-gray-600">Trạng Thái</th>
                            <th className="p-3 border-b-2 text-center text-sm font-semibold text-gray-600">Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="6" className="text-center p-4 text-gray-500">Đang tải dữ liệu banner...</td></tr>
                        ) : filteredBanners.length > 0 ? (
                            filteredBanners.map((banner, index) => (
                                <tr key={banner.id} className="hover:bg-gray-50">
                                    <td className="p-3 border-b">{index + 1}</td>
                                    <td className="p-3 border-b">
                                        {banner.imageUrl ? (
                                            <img src={FileUploadService.getImageUrl(banner.imageUrl, "banners")}
                                                alt={banner.name || 'Banner'}
                                                className="h-16 w-32 object-contain rounded-md bg-gray-100"
                                                // Thêm onError để dự phòng
                                                onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/128x64" }}
                                            />
                                        ) : (
                                            <div className="h-16 w-32 bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-500">No Img</div>
                                        )}
                                    </td>
                                    <td className="p-3 border-b font-medium text-gray-800">{banner.name || '-'}</td>
                                    <td className="p-3 border-b text-gray-600 text-sm">
                                        {banner.linkUrl && banner.linkUrl !== '#' ? ( // Kiểm tra linkUrl hợp lệ
                                            <a href={banner.linkUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
                                                {banner.linkUrl}
                                            </a>
                                        ) : '-'}
                                    </td>
                                    <td className="p-3 border-b text-center">
                                        {banner.status ? (
                                            <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-200 rounded-full">Hiển thị</span>
                                        ) : (
                                            <span className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-200 rounded-full">Đang ẩn</span>
                                        )}
                                    </td>
                                    <td className="p-3 border-b text-center">
                                        {/* Cập nhật đường dẫn cho nút Sửa */}
                                        <button onClick={() => navigate(`/admin/edit-banner/${banner.id}`)}
                                            className="text-blue-500 hover:text-blue-700 font-semibold py-1 px-3 mr-2 rounded transition duration-200">
                                            <Edit size={16} className="inline-block" /> Sửa
                                        </button>
                                        <button onClick={() => handleDelete(banner.id)}
                                            className="text-red-500 hover:text-red-700 font-semibold py-1 px-3 rounded transition duration-200">
                                            <Trash2 size={16} className="inline-block" /> Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="6" className="text-center p-4 text-gray-500">{searchTerm ? 'Không tìm thấy banner phù hợp.' : 'Chưa có banner nào.'}</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
}