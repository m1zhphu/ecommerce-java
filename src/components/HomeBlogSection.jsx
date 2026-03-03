// src/components/HomeBlogSection.jsx

import React, { useEffect, useState } from "react";
import PostService from "../api/PostService"; 
import PostCard from "./PostCard"; 
import { Loader2, AlertTriangle } from "lucide-react";

export default function HomeBlogSection() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const res = await PostService.getAllPublished(); 
                setPosts(res.data.slice(0, 6)); 
            } catch (err) {
                console.error("Lỗi khi tải bài viết công khai:", err);
                setError("Không thể tải bài viết.");
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    // Giao diện khi đang tải
    if (loading) {
        return (
            <div className="text-center py-12 container mx-auto px-4">
                <Loader2 size={32} className="animate-spin inline-block text-blue-500" />
                <p className="text-gray-600 mt-2">Đang tải bài viết...</p>
            </div>
        );
    }

    // Giao diện khi lỗi
    if (error) {
        return (
            <div className="text-center py-12 bg-red-50 p-6 rounded-lg container mx-auto px-4">
                <AlertTriangle size={32} className="inline-block text-red-500" />
                <p className="text-red-700 mt-2">{error}</p>
            </div>
        );
    }
    
    // Giao diện chính
    return (
        // Giữ nguyên khoảng cách lớn py-16 cho cả khu vực
        <div className="bg-gray-50 py-16"> 
            <div className="container mx-auto px-4">
                
                {/* --- PHẦN ĐÃ SỬA --- */}
                {/* 1. Dùng 'space-y-4' để tạo khoảng cách đều 16px giữa các phần tử con (h2 và p).
                  2. Giữ 'mb-12' ở đây để tạo khoảng cách 48px từ khối tiêu đề này xuống lưới bài viết.
                */}
                <div className="text-center mb-12 space-y-4">
                    {/* 3. Xóa 'mb-12' và 'text-center' (vì đã có ở div cha)
                    */}
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">
                        Bài Viết Nổi Bật
                    </h2>
                    
                    {/* 4. Xóa 'mt-2' (vì 'space-y-4' đã xử lý)
                    */}
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Khám phá các xu hướng và câu chuyện thời trang từ chúng tôi.
                    </p>
                </div>
                {/* --- KẾT THÚC PHẦN SỬA --- */}


                {/* Lưới 3 cột (Giữ nguyên, kích thước này đã hợp lý) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </div>
            </div>
        </div>
    );
}