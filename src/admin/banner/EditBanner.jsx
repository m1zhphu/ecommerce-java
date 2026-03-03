// src/admin/banner/EditBanner.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BannerService from "../../api/BannerService";
import FileUploadService from "../../api/FileUploadService"; // <-- 1. GIỮ IMPORT NÀY
import CloudinaryService from "../../api/CloudinaryService"; // <-- 2. THÊM IMPORT NÀY
import { ArrowLeft, RefreshCw, Loader2 } from "lucide-react"; // Thêm Loader2

// const IMAGE_BASE_URL = "http://localhost:8080/uploads/images/banners/"; // <-- 3. XÓA DÒNG NÀY

export default function EditBanner() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [banner, setBanner] = useState({ name: "", linkUrl: "", status: true, imageUrl: "" });
    const [selectedFile, setSelectedFile] = useState(null); // File ảnh MỚI
    const [imagePreview, setImagePreview] = useState(null); // URL xem trước ảnh MỚI
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState("");
    const [loadingData, setLoadingData] = useState(true);

    // (Tải dữ liệu banner cũ - giữ nguyên)
    useEffect(() => {
        const fetchBannerData = async () => {
            setLoadingData(true);
            try {
                const response = await BannerService.getById(id);
                setBanner(response.data);
            } catch (err) {
                console.error("Lỗi khi tải dữ liệu banner:", err);
                setMessage("Không thể tải dữ liệu banner để chỉnh sửa.");
            } finally {
                setLoadingData(false);
            }
        };
        fetchBannerData();
    }, [id]);

    // (Hàm handleChange giữ nguyên)
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setBanner((prevBanner) => ({
            ...prevBanner,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    // (Hàm handleFileChange giữ nguyên)
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith("image/")) {
            setSelectedFile(file);
            setImagePreview(URL.createObjectURL(file));
        } else {
            setSelectedFile(null);
            setImagePreview(null); // Reset preview
            if (file) {
                alert("Vui lòng chọn một file hình ảnh hợp lệ (jpg, png, gif...).");
            }
        }
    };

    // --- 4. HÀM SUBMIT ĐÃ ĐƯỢC CẬP NHẬT ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!banner.name.trim()) {
            alert("Vui lòng nhập tên banner!");
            return;
        }

        setIsSubmitting(true);
        setMessage("");

        try {
            let finalImageUrl = banner.imageUrl; // Mặc định giữ lại URL ảnh cũ

            // BƯỚC 1: Nếu người dùng đã chọn một file ảnh MỚI
            if (selectedFile) {
                setMessage("Đang tải ảnh mới lên Cloudinary...");
                // Gọi CloudinaryService để upload, gửi file và thư mục "banners"
                const newUrl = await CloudinaryService.upload(selectedFile, "banners");

                if (!newUrl) {
                    throw new Error("Không nhận được URL mới từ Cloudinary.");
                }
                finalImageUrl = newUrl; // Lấy URL mới
            }

            // BƯỚC 2: Tạo dữ liệu banner (với URL mới hoặc cũ)
            const updatedBannerData = { ...banner, imageUrl: finalImageUrl };

            // BƯỚC 3: Gọi API cập nhật banner
            setMessage("Đang cập nhật banner...");
            await BannerService.update(id, updatedBannerData);

            // BƯỚC 4: Thông báo
            setMessage("Cập nhật banner thành công! Sẽ tự động quay lại sau 2 giây.");
            setTimeout(() => navigate("/admin/banners"), 2000);

        } catch (err) {
            console.error("Lỗi khi cập nhật banner:", err);
            const errorMsg = err.response?.data?.message || err.message || "Cập nhật banner thất bại! Vui lòng thử lại.";
            setMessage(errorMsg);
            setIsSubmitting(false);
        }
    };

    if (loadingData) {
        return (
            <div className="flex justify-center items-center min-h-[500px]">
                <Loader2 size={40} className="animate-spin text-blue-500" />
                <span className="ml-3 text-lg text-gray-600">Đang tải dữ liệu...</span>
            </div>
        );
    }

    // --- 5. XÁC ĐỊNH URL HIỂN THỊ ---
    const displayImageUrl = imagePreview || FileUploadService.getImageUrl(banner.imageUrl, "banners");

    return (
        <>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Chỉnh Sửa Banner</h1>
                    <p className="text-gray-500 mt-1">ID: {id}</p>
                </div>
                <button
                    onClick={() => navigate("/admin/banners")}
                    className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg transition duration-200"
                >
                    <ArrowLeft size={20} />
                    Quay lại
                </button>
            </div>

            {/* Thông báo */}
            {message && (
                <div className={`mb-4 p-4 rounded-lg text-center font-medium ${message.includes("thành công") ? "bg-green-100 text-green-800"
                    : (message.includes("Đang tải") || message.includes("Đang cập nhật") ? "bg-blue-100 text-blue-800" : "bg-red-100 text-red-800")
                    }`}>
                    {message.includes("Đang") && <Loader2 size={20} className="inline-block animate-spin mr-2" />}
                    {message}
                </div>
            )}

            {/* Form (Giữ nguyên JSX input text) */}
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white p-8 rounded-xl shadow-lg space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">Tên Banner</label>
                            <input
                                type="text" id="name" name="name"
                                value={banner.name || ''} onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500 transition" required
                            />
                        </div>
                        <div>
                            <label htmlFor="linkUrl" className="block text-sm font-semibold text-gray-700 mb-2">Đường dẫn (Link URL)</label>
                            <input
                                type="url" id="linkUrl" name="linkUrl"
                                value={banner.linkUrl || ''} onChange={handleChange}
                                placeholder="https://vidu.com/khuyen-mai"
                                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500 transition"
                            />
                        </div>
                    </div>

                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-white p-8 rounded-xl shadow-lg">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Hình ảnh Banner</label>
                            <div className="mt-2 text-center">
                                <img
                                    // --- 6. SỬA DÒNG NÀY ---
                                    src={displayImageUrl}
                                    alt="Xem trước"
                                    className="mx-auto h-40 max-w-full object-contain rounded-md shadow-md mb-4 bg-gray-100"
                                    onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/300x150" }}
                                />
                                <label htmlFor="file-upload" className="cursor-pointer inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 rounded-lg border border-gray-300 transition duration-200">
                                    <RefreshCw size={18} />
                                    Thay đổi ảnh
                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                                </label>
                                {selectedFile && <p className="mt-2 text-sm text-gray-500">Đã chọn: {selectedFile.name}</p>}
                               </div>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-lg">
                            <label className="block text-sm font-semibold text-gray-700 mb-4">Trạng thái hiển thị</label>
                            <div className="flex items-center justify-between">
                                <span className={`font-medium ${banner.status ? 'text-green-600' : 'text-gray-500'}`}>
                                    {banner.status ? 'Đang hiển thị' : 'Đang ẩn'}
                                </span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" name="status" className="sr-only peer" checked={banner.status} onChange={handleChange} />
                                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting || loadingData}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
                </div>
            </form>
        </>
    );
}