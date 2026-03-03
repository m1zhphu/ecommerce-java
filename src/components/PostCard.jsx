// src/components/PostCard.jsx

import React from "react";
import { Link } from "react-router-dom";
import FileUploadService from "../api/FileUploadService"; // Sửa đường dẫn import
import { ArrowRight } from "lucide-react";

export default function PostCard({ post }) {
    if (!post) return null;

    // Đường dẫn ảnh (sửa lại theo file service mới nhất của bạn)
    const imageUrl = FileUploadService.getImageUrl(post.image, "posts");

    return (
        // Bọc toàn bộ card bằng Link
        <Link 
            to={`/post/${post.slug}`} 
            className="block overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out group bg-white"
        >
            {/* Phần Hình ảnh */}
            <div className="overflow-hidden h-52">
                <img
                    src={imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                />
            </div>

            {/* Phần Nội dung (Text) */}
            <div className="p-6">
                {/* Tiêu đề Bài viết */}
                <h3 className="text-xl font-serif text-gray-800 mb-2 h-14 overflow-hidden">
                    {/* Giới hạn 2 dòng */}
                    <span className="line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                        {post.title}
                    </span>
                </h3>

                {/* Mô tả ngắn */}
                <p className="text-gray-600 text-sm mb-4 h-20 overflow-hidden">
                    {/* Giới hạn 3 dòng */}
                    <span className="line-clamp-3">
                        {post.description}
                    </span>
                </p>

                {/* Link "Đọc thêm" */}
                <span className="font-semibold text-blue-600 flex items-center gap-1 group-hover:gap-2 transition-all duration-300">
                    Đọc thêm
                    <ArrowRight size={16} />
                </span>
            </div>
        </Link>
    );
}