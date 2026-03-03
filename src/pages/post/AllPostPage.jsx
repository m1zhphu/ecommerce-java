import React, { useEffect, useState } from 'react';
import PostService from '../../api/PostService.js'; // Sửa: lùi 1 cấp
import PostCard from '../../components/PostCard.jsx'; // Sửa: lùi 1 cấp
import { Loader2, AlertTriangle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PostListPage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAllPosts = async () => {
            setLoading(true);
            setError(null);
            window.scrollTo(0, 0);

            try {
                const res = await PostService.getAllPublished();
                if (res && res.data) {
                    setPosts(res.data);
                } else {
                    setPosts([]);
                    setError("Không có dữ liệu bài viết.");
                }
            } catch (err) {
                console.error("Lỗi khi tải tất cả bài viết:", err);
                setError("Không thể tải danh sách bài viết. Vui lòng thử lại sau.");
            } finally {
                setLoading(false);
            }
        };

        fetchAllPosts();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[500px] pt-20">
                <Loader2 size={40} className="animate-spin text-blue-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-20 bg-red-50 p-6 min-h-[500px] container mx-auto my-10 rounded-lg pt-20">
                <AlertTriangle size={40} className="inline-block text-red-500" />
                <p className="text-red-700 mt-4 text-xl">{error}</p>
                <Link
                    to="/"
                    className="mt-6 inline-flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                >
                    <ArrowLeft size={16} />
                    Về trang chủ
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-white py-16 md:py-20 pt-32">
            <div className="container mx-auto px-4 lg:px-6">
                {/* Tiêu đề trang */}
                <div className="mb-12 border-b border-gray-200 pb-8">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900">
                        Blog & Tin Tức
                    </h1>
                    <p className="text-lg text-gray-600 mt-3">
                        Cập nhật các xu hướng và câu chuyện thời trang mới nhất từ chúng tôi.
                    </p>
                </div>

                {/* Lưới 3 cột */}
                {posts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post) => (
                            < PostCard key={post.id || post._id} post={post} />
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500 text-lg">Chưa có bài viết nào.</p>
                )}
            </div>
        </div>
    );
}

