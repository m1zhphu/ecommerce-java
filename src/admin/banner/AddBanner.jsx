// src/pages/admin/banner/AddBanner.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BannerService from "../../api/BannerService"; // Import service Banner
// import FileUploadService from "../../api/FileUploadService"; // Bỏ service upload cũ
import CloudinaryService from "../../api/CloudinaryService"; // <-- 1. DÙNG CLOUDINARY
import { ArrowLeft, UploadCloud, Loader2 } from "lucide-react"; // Thêm Loader2

export default function AddBanner() {
    // State cho các trường của banner
    const [banner, setBanner] = useState({
        name: "",
        linkUrl: "",
        status: true, // Mặc định là hiển thị
        imageUrl: "", // Sẽ lưu URL Cloudinary
    });

    const [selectedFile, setSelectedFile] = useState(null); // File ảnh người dùng chọn
    const [imagePreview, setImagePreview] = useState(null); // URL xem trước ảnh
    const [isSubmitting, setIsSubmitting] = useState(false); // Trạng thái đang gửi form
    const [message, setMessage] = useState(""); // Thông báo (thành công/lỗi)
    const navigate = useNavigate(); // Hook để điều hướng

    // (Hàm handleChange và handleFileChange giữ nguyên)
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setBanner((prevBanner) => ({
            ...prevBanner,
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
            if (file) alert("Vui lòng chọn một file hình ảnh hợp lệ (jpg, png, gif...).");
        }
    };

    // --- 2. HÀM SUBMIT ĐÃ ĐƯỢC CẬP NHẬT ---
    const handleSubmit = async (e) => {
        e.preventDefault();

        // --- Validation ---
        if (!banner.name.trim()) {
            alert("Vui lòng nhập tên banner!");
            return;
        }
        if (!selectedFile) {
            alert("Vui lòng chọn một hình ảnh cho banner!");
            return;
        }

        setIsSubmitting(true);
        setMessage("");

        try {
            // BƯỚC 1: Upload ảnh lên Cloudinary TRƯỚC
            setMessage("Đang tải ảnh lên Cloudinary...");
            // Gọi CloudinaryService, gửi file và tên thư mục "banners"
            const imageUrl = await CloudinaryService.upload(selectedFile, "banners");

            if (!imageUrl) {
                throw new Error("Không nhận được URL ảnh từ Cloudinary.");
            }

            // BƯỚC 2: Tạo dữ liệu banner (với URL Cloudinary)
            const bannerData = { ...banner, imageUrl: imageUrl };

            // BƯỚC 3: Gọi API tạo banner mới
            setMessage("Đang tạo banner...");
            await BannerService.create(bannerData);

            // BƯỚC 4: Thông báo thành công và chuyển hướng
            setMessage("Thêm banner thành công! Sẽ tự động quay lại sau 2 giây.");
            setTimeout(() => navigate("/admin/banners"), 2000);

        } catch (err) {
            console.error("Lỗi khi thêm banner:", err);
            const errorMsg = err.response?.data?.message || err.message || "Thêm banner thất bại! Vui lòng thử lại.";
            setMessage(errorMsg);
            setIsSubmitting(false); // Cho phép submit lại
        }
    };

    return (
        <>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Tạo Banner Mới</h1>
                    <p className="text-gray-500 mt-1">Điền thông tin và tải ảnh lên.</p>
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
                    : (message.includes("Đang tải") || message.includes("Đang tạo") ? "bg-blue-100 text-blue-800" : "bg-red-100 text-red-800")
                    }`}>
                    {message.includes("Đang") && <Loader2 size={20} className="inline-block animate-spin mr-2" />}
                    {message}
                </div>
            )}

            {/* Form (Giữ nguyên JSX) */}
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white p-8 rounded-xl shadow-lg space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">Tên Banner</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={banner.name}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500 transition"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="linkUrl" className="block text-sm font-semibold text-gray-700 mb-2">Đường dẫn (Link URL)</label>
                            <input
                                type="url"
                                id="linkUrl"
                                name="linkUrl"
                                value={banner.linkUrl}
                                onChange={handleChange}
                                placeholder="https://vidu.com/khuyen-mai (Bỏ trống nếu không có)"
                                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500 transition"
                            />
                        </div>
                    </div>

                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-white p-8 rounded-xl shadow-lg">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Hình ảnh Banner</label>
                            <div className="mt-2 flex justify-center rounded-lg border-2 border-dashed border-gray-300 px-6 py-10">
                                <div className="text-center">
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Xem trước" className="mx-auto h-40 max-w-full object-contain rounded-md" />
                                    ) : (
                                        <>
                                            <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                                            <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                                <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-semibold text-blue-600 hover:text-blue-500">
                                                    <span>Tải ảnh lên</span>
                                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" required />
                                                </label>
                                                <p className="pl-1">hoặc kéo và thả</p>
                                            </div>
                                            <p className="text-xs leading-5 text-gray-500">PNG, JPG, GIF, WEBP</p>
                                        </>
                                    )}
                                </div>
                            </div>
                            {imagePreview && (
                                <label htmlFor="file-upload" className="mt-4 inline-block cursor-pointer rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                                    Chọn ảnh khác
                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                                </label>
                            )}
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
                        disabled={isSubmitting}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Đang tạo...' : 'Tạo Banner'}
                    </button>
                </div>
            </form>
        </>
    );
}