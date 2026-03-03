// src/admin/post/AddPost.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PostService from "../../api/PostService";
//import FileUploadService from "../../api/FileUploadService";
import CloudinaryService from "../../api/CloudinaryService";
import { Save, XCircle, ArrowLeft, Loader2, UploadCloud } from "lucide-react";

export default function AddPost() {
    // State cho các trường của form
    const [post, setPost] = useState({
        title: "",
        slug: "",
        description: "",
        content: "",
        status: true, // Mặc định là Công khai
    });
    
    // State cho file và thông báo
    const [selectedFile, setSelectedFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    // Hàm xử lý thay đổi input
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setPost((prevPost) => ({
            ...prevPost,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    // Hàm xử lý chọn file
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

    // Hàm xử lý khi submit form
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        // Validate
        if (!post.title.trim()) { setMessage("Tiêu đề không được để trống."); return; }
        if (!post.slug.trim()) { setMessage("Slug không được để trống."); return; }
        if (!post.content.trim()) { setMessage("Nội dung không được để trống."); return; }
        if (!selectedFile) { setMessage("Vui lòng chọn một hình ảnh."); return; }

        setIsSubmitting(true);

        try {
            // BƯỚC 1: Upload ảnh lên Cloudinary TRƯỚC
            setMessage("Đang tải ảnh lên Cloudinary...");
            // Gọi CloudinaryService, gửi file và tên thư mục "posts"
            const imageUrl = await CloudinaryService.upload(selectedFile, "posts");

            if (!imageUrl) {
                throw new Error("Không nhận được URL ảnh từ Cloudinary.");
            }

            // BƯỚC 2: Tạo đối tượng PostDto (gồm URL ảnh đã upload)
            const postData = {
                ...post,
                image: imageUrl, // Gán URL Cloudinary
            };

            // BƯỚC 3: Gọi API tạo bài viết
            setMessage("Đang tạo bài viết...");
            await PostService.create(postData);

            // BƯỚC 4: Thông báo và chuyển hướng
            setMessage("Thêm bài viết mới thành công! Sẽ tự động quay lại sau 2 giây.");
            setTimeout(() => navigate("/admin/posts"), 2000);

        } catch (err) {
            console.error("Lỗi khi thêm bài viết:", err);
            const errorMsg = err.response?.data?.message || err.message || "Có lỗi xảy ra. Vui lòng thử lại.";
            setMessage(errorMsg);
            setIsSubmitting(false); // Cho phép thử lại
        }
    };
    return (
        <div className="max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-lg">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Thêm Bài Viết Mới</h1>
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
                    message.includes("thành công") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}>
                    {message}
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cột trái: Nội dung chính */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Tiêu đề */}
                        <div>
                            <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-1">Tiêu đề bài viết</label>
                            <input type="text" id="title" name="title" value={post.title} onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        {/* Slug */}
                        <div>
                            <label htmlFor="slug" className="block text-sm font-semibold text-gray-700 mb-1">Slug (Đường dẫn)</label>
                            <input type="text" id="slug" name="slug" value={post.slug} onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="vi-du-bai-viet-moi" />
                        </div>
                        {/* Mô tả ngắn */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-1">Mô tả ngắn (Description)</label>
                            <textarea id="description" name="description" value={post.description} onChange={handleChange} rows={3}
                                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Mô tả ngắn gọn xuất hiện trong danh sách bài viết..."></textarea>
                        </div>
                        {/* Nội dung chính */}
                        <div>
                            <label htmlFor="content" className="block text-sm font-semibold text-gray-700 mb-1">Nội dung chính</label>
                            <textarea id="content" name="content" value={post.content} onChange={handleChange} rows={15}
                                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Viết nội dung đầy đủ của bài viết..."></textarea>
                            <p className="text-xs text-gray-500 mt-1">Mẹo: Để có trình soạn thảo tốt hơn, bạn có thể tích hợp thư viện (vd: React-Quill, TinyMCE).</p>
                        </div>
                    </div>

                    {/* Cột phải: Ảnh và Trạng thái */}
                    <div className="lg:col-span-1 space-y-8">
                        {/* Trạng thái */}
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

                        {/* Hình ảnh */}
                        <div className="bg-white p-6 rounded-xl shadow-md border">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Ảnh đại diện</label>
                            <div className="mt-2 flex justify-center rounded-lg border-2 border-dashed border-gray-300 px-6 py-10">
                                <div className="text-center">
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Xem trước" className="mx-auto h-40 w-auto object-cover rounded-md" />
                                    ) : (
                                        <>
                                            <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                                            <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                                <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-semibold text-blue-600 hover:text-blue-500">
                                                    <span>Tải ảnh lên</span>
                                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                                                </label>
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
                <div className="flex justify-end items-center gap-4 mt-8 pt-6 border-t border-gray-200">
                    <button type="button" onClick={() => navigate("/admin/posts")} disabled={isSubmitting}
                        className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50">
                        <XCircle size={20} /> Hủy
                    </button>
                    <button type="submit" disabled={isSubmitting}
                        className="flex items-center justify-center gap-2 w-44 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50">
                        {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                        {isSubmitting ? "Đang lưu..." : "Lưu Bài Viết"}
                    </button>
                </div>
            </form>
        </div>
    );
}