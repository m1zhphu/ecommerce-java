// src/admin/post/EditPost.jsx

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PostService from "../../api/PostService";
import FileUploadService from "../../api/FileUploadService"; // <-- 1. DÙNG ĐỂ HIỂN THỊ ẢNH
import CloudinaryService from "../../api/CloudinaryService"; // <-- 2. DÙNG ĐỂ UPLOAD ẢNH MỚI
import { Save, XCircle, ArrowLeft, Loader2, UploadCloud, RefreshCw } from "lucide-react"; // Thêm RefreshCw

export default function EditPost() {
    const { id } = useParams(); 
    const navigate = useNavigate();

    // State cho form
    const [post, setPost] = useState({
        title: "",
        slug: "",
        description: "",
        content: "",
        status: true,
        image: "" // Sẽ lưu URL Cloudinary
    });
    
    const [selectedFile, setSelectedFile] = useState(null); // File mới
    const [imagePreview, setImagePreview] = useState(null); // Preview cho file mới
    
    const [pageLoading, setPageLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState("");

    // --- 1. Tải dữ liệu cũ khi vào trang ---
    useEffect(() => {
        const fetchPostData = async () => {
            setPageLoading(true);
            setMessage("");
            try {
                const res = await PostService.getByIdAdmin(id);
                // Gán dữ liệu vào state (bao gồm cả 'image' là URL đầy đủ)
                setPost(res.data);
                
            } catch (err) {
                console.error("Lỗi khi tải bài viết:", err);
                setMessage("Không thể tải dữ liệu bài viết!");
            } finally {
                setPageLoading(false);
            }
        };

        fetchPostData();
    }, [id]);

    // (Hàm handleChange giữ nguyên)
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setPost((prevPost) => ({
            ...prevPost,
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
            setImagePreview(null);
        }
    };

    // --- 3. HÀM SUBMIT ĐÃ ĐƯỢC CẬP NHẬT ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        if (!post.title.trim() || !post.slug.trim() || !post.content.trim()) {
            setMessage("Tiêu đề, Slug và Nội dung không được để trống.");
            return;
        }

        setIsSubmitting(true);
        // Mặc định là URL ảnh cũ (đã là URL Cloudinary)
        let finalImageUrl = post.image; 

        try {
            // BƯỚC 1: Nếu người dùng CÓ chọn file mới
            if (selectedFile) {
                setMessage("Đang tải ảnh mới lên Cloudinary...");
                // Upload file MỚI lên Cloudinary
                const newUrl = await CloudinaryService.upload(selectedFile, "posts");
                if (!newUrl) {
                    throw new Error("Không nhận được URL mới từ Cloudinary.");
                }
                finalImageUrl = newUrl; // Lấy URL mới
            }
            
            // BƯỚC 2: Tạo đối tượng PostDto (gồm URL mới hoặc cũ)
            const postData = {
                ...post,
                image: finalImageUrl, 
            };

            // BƯỚC 3: Gọi API cập nhật
            setMessage("Đang cập nhật bài viết...");
            await PostService.update(id, postData);

            // BƯỚC 4: Thông báo và chuyển hướng
            setMessage("Cập nhật bài viết thành công! Sẽ tự động quay lại sau 2 giây.");
            setTimeout(() => navigate("/admin/posts"), 2000);

        } catch (err) {
            console.error("Lỗi khi cập nhật bài viết:", err);
            const errorMsg = err.response?.data?.message || err.message || "Có lỗi xảy ra.";
            setMessage(errorMsg);
            setIsSubmitting(false);
        }
    };
    
    // --- 4. RENDER ---

    if (pageLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 size={40} className="animate-spin text-blue-500" />
                <span className="ml-3 text-lg text-gray-600">Đang tải dữ liệu bài viết...</span>
            </div>
        );
    }
    
    // Xác định URL ảnh để hiển thị:
    // 1. Ưu tiên ảnh preview (ảnh mới chọn)
    // 2. Nếu không, dùng ảnh gốc (lấy từ FileUploadService)
    const displayImageUrl = imagePreview || FileUploadService.getImageUrl(post.image, "posts");

    return (
        <div className="max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-lg">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Chỉnh Sửa Bài Viết (ID: {id})</h1>
                <button
                    onClick={() => navigate("/admin/posts")}
                    className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition duration-200"
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

            {/* Form (JSX giữ nguyên) */}
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cột trái: Nội dung chính */}
                    <div className="lg:col-span-2 space-y-6">
                        <div>
                            <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-1">Tiêu đề</label>
                            <input type="text" id="title" name="title" value={post.title} onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <div>
                            <label htmlFor="slug" className="block text-sm font-semibold text-gray-700 mb-1">Slug</label>
                            <input type="text" id="slug" name="slug" value={post.slug} onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-1">Mô tả ngắn</label>
                            <textarea id="description" name="description" value={post.description} onChange={handleChange} rows={3}
                                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500"></textarea>
                        </div>
                        <div>
                            <label htmlFor="content" className="block text-sm font-semibold text-gray-700 mb-1">Nội dung chính</label>
                            <textarea id="content" name="content" value={post.content} onChange={handleChange} rows={15}
                                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500"></textarea>
                        </div>
                    </div>

                    {/* Cột phải: Ảnh và Trạng thái */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-white p-6 rounded-xl shadow-md border">
                            <label className="block text-sm font-semibold text-gray-700 mb-4">Trạng thái</label>
                            <div className="flex items-center justify-between">
                                <span className={`font-medium ${post.status ? 'text-green-600' : 'text-gray-500'}`}>
                                    {post.status ? 'Công khai' : 'Bản nháp'}
                                </span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" name="status" className="sr-only peer" checked={post.status} onChange={handleChange} />
                                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                        </div>

                        {/* --- KHỐI ẢNH ĐÃ CẬP NHẬT --- */}
                        <div className="bg-white p-6 rounded-xl shadow-md border">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Ảnh đại diện</label>
                            <div className="mt-2 text-center">
                                <img 
                                    src={displayImageUrl} // <-- Sử dụng URL đã xử lý
                                    alt="Xem trước" 
                                    className="mx-auto h-40 w-auto object-contain rounded-md shadow-md mb-4 bg-gray-100"
                                    onError={(e) => { e.target.onerror = null; e.target.src="https://via.placeholder.com/300x150"}}
                                />
                                <label htmlFor="file-upload" className="cursor-pointer inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 rounded-lg border border-gray-300 transition duration-200">
                                    <RefreshCw size={18} />
                                    Thay đổi ảnh
                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                                </label>
                                {selectedFile && <p className="mt-2 text-sm text-gray-500">Đã chọn: {selectedFile.name}</p>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Nút Submit */}
                <div className="flex justify-end items-center gap-4 mt-8 pt-6 border-t border-gray-200">
                    <button type="button" onClick={() => navigate("/admin/posts")} disabled={isSubmitting}
                        className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50">
                        <XCircle size={20} /> Hủy
                    </button>
                    <button type="submit" disabled={isSubmitting || pageLoading}
                        className="flex items-center justify-center gap-2 w-44 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50">
                        {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                        {isSubmitting ? "Đang lưu..." : "Lưu Thay Đổi"}
                    </button>
                </div>
            </form>
        </div>
    );
}