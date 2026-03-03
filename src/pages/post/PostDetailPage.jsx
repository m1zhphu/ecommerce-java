// src/pages/PostDetailPage.jsx

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import PostService from "../../api/PostService";
import FileUploadService from "../../api/FileUploadService";
import { 
    Loader2, 
    AlertTriangle, 
    ArrowLeft,
    Facebook, 
    Twitter,  
    Linkedin, 
    Share2    
} from "lucide-react";

export default function PostDetailPage() {
    const { slug } = useParams(); 
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                const res = await PostService.getBySlug(slug); 
                setPost(res.data);
            } catch (err) {
                console.error("Lỗi khi tải chi tiết bài viết:", err);
                setError("Không tìm thấy bài viết hoặc đã xảy ra lỗi.");
            } finally {
                setLoading(false);
            }
        };

        window.scrollTo(0, 0); 
        fetchPost();
    }, [slug]);

    // (Phần Loading và Error giữ nguyên)
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[500px]">
                <Loader2 size={40} className="animate-spin text-blue-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-20 bg-red-50 p-6 min-h-[500px] container mx-auto my-10 rounded-lg">
                <AlertTriangle size={40} className="inline-block text-red-500" />
                <p className="text-red-700 mt-4 text-xl">{error}</p>
                <Link to="/" className="mt-6 inline-flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition">
                    <ArrowLeft size={16} />
                    Về trang chủ
                </Link>
            </div>
        );
    }

    if (!post) return null;

    const imageUrl = FileUploadService.getImageUrl(post.image, "posts");

    return (
        <div className="bg-white py-12 md:py-20">
            {/* 1. THÊM 'relative' VÀO CONTAINER CHÍNH */}
            <div className="container mx-auto px-4 max-w-3xl relative"> 
                
                {/* 2. SỬA LẠI CLASS CHO NÚT QUAY LẠI */}
                <Link 
                    to="/" 
                    // 'absolute': Định vị tuyệt đối
                    // 'right-full': Đặt cạnh phải của nút ở cạnh trái của container
                    // 'mr-8': Tạo khoảng cách 2rem (32px) giữa nút và nội dung
                    // 'top-2': Căn chỉnh nút với dòng đầu tiên của tiêu đề
                    // 'hidden md:inline-flex': Ẩn trên mobile, hiện trên desktop
                    className="absolute right-full inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mr-8 top-2 text-sm font-medium hidden md:inline-flex whitespace-nowrap"
                >
                    <ArrowLeft size={16} />
                    Về trang chủ
                </Link>
                {/* --- KẾT THÚC SỬA ĐỔI --- */}


                {/* Tiêu đề chính (Không còn nút back ở trên) */}
                <h1 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
                    {post.title}
                </h1>
                
                {/* Metadata (Giữ nguyên) */}
                <div className="flex items-center text-gray-500 text-sm mb-6 space-x-3">
                    <span className="font-medium">By Admin</span> 
                    <span>|</span>
                    <span>Nov 3, 2025</span> 
                </div>

                {/* Mô tả ngắn (Giữ nguyên) */}
                <p className="text-lg md:text-xl text-gray-600 mb-8 italic">
                    {post.description}
                </p>

                {/* Ảnh đại diện (Giữ nguyên) */}
                <div className="w-full h-auto md:h-[450px] overflow-hidden rounded-2xl shadow-xl mb-12">
                    <img
                        src={imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Nội dung bài viết (Giữ nguyên) */}
                <article 
                    className="prose prose-lg max-w-none prose-h2:font-serif prose-h2:font-bold prose-h3:font-serif"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Khung chia sẻ (Giữ nguyên) */}
                <div className="border-t border-b border-gray-200 my-12 py-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <span className="font-semibold text-gray-700 text-lg">Chia sẻ bài viết này:</span>
                        <div className="flex items-center gap-4">
                            <a href="https://www.facebook.com/" aria-label="Share on Facebook" className="text-gray-500 hover:text-blue-700 transition-colors">
                                <Facebook size={22} />
                            </a>
                            <a href="#" aria-label="Share on Twitter" className="text-gray-500 hover:text-sky-500 transition-colors">
                                <Twitter size={22} />
                            </a>
                            <a href="#" aria-label="Share on LinkedIn" className="text-gray-500 hover:text-blue-600 transition-colors">
                                <Linkedin size={22} />
                            </a>
                            <a href="#" aria-label="Copy link" className="text-gray-500 hover:text-gray-900 transition-colors">
                                <Share2 size={22} />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}