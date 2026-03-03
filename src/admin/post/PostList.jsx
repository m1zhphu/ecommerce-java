// src/admin/post/PostList.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PostService from "../../api/PostService";
import FileUploadService from "../../api/FileUploadService"; // Cần để lấy URL ảnh
import { PlusCircle, List, Edit, Trash2 } from "lucide-react";
import { Loader2 } from "lucide-react"; // Import icon loading

export default function PostList() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Hàm tải dữ liệu
    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await PostService.getAllAdmin();
            setPosts(res.data);
        } catch (err) {
            console.error("Lỗi khi tải danh sách bài viết:", err);
            setError("Không thể tải danh sách bài viết!");
        } finally {
            setLoading(false);
        }
    };

    // Tải dữ liệu khi component được mount
    useEffect(() => {
        fetchData();
    }, []);

    // Hàm xử lý xóa
    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa bài viết này?")) return;
        try {
            await PostService.remove(id);
            // Tải lại danh sách sau khi xóa thành công
            setPosts(posts.filter(post => post.id !== id));
        } catch (err) {
            console.error("Lỗi khi xóa bài viết:", err);
            alert("Lỗi khi xóa bài viết!");
        }
    };

    return (
        <>
            {/* Header */}
            <div className="flex justify-between items-center mb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                        <List size={32} className="text-indigo-600" />
                        Quản Lý Bài Viết
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Tạo mới, chỉnh sửa và quản lý các bài viết trên blog.
                    </p>
                </div>
                <button
                    onClick={() => navigate("/admin/add-post")}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
                >
                    <PlusCircle size={20} />
                    Thêm Bài Viết
                </button>
            </div>

            {/* Thông báo Lỗi */}
            {error && (
                <p className="mb-4 p-4 rounded-lg bg-red-100 text-red-800 text-center">
                    {error}
                </p>
            )}

            {/* Bảng danh sách */}
            <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3 border-b-2 text-left text-sm font-semibold text-gray-600 w-16">ID</th>
                            <th className="p-3 border-b-2 text-center text-sm font-semibold text-gray-600 w-32">Ảnh</th>
                            <th className="p-3 border-b-2 text-left text-sm font-semibold text-gray-600">Tiêu đề</th>
                            <th className="p-3 border-b-2 text-left text-sm font-semibold text-gray-600">Slug</th>
                            <th className="p-3 border-b-2 text-center text-sm font-semibold text-gray-600">Trạng thái</th>
                            <th className="p-3 border-b-2 text-center text-sm font-semibold text-gray-600">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="text-center p-6 text-gray-500">
                                    <Loader2 size={24} className="animate-spin inline-block mr-2" />
                                    Đang tải dữ liệu...
                                </td>
                            </tr>
                        ) : posts.length > 0 ? (
                            posts.map((post) => (
                                <tr key={post.id} className="hover:bg-gray-50">
                                    <td className="p-3 border-b text-center">{post.id}</td>
                                    <td className="p-3 border-b text-center">
                                        <img
                                            src={FileUploadService.getImageUrl(post.image, "posts")}
                                            alt={post.title}
                                            className="w-24 h-16 object-cover rounded-md mx-auto"
                                        />
                                    </td>
                                    <td className="p-3 border-b font-medium">{post.title}</td>
                                    <td className="p-3 border-b text-gray-600 italic">/{post.slug}</td>
                                    <td className="p-3 border-b text-center">
                                        {post.status ? (
                                            <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-200 rounded-full">Công khai</span>
                                        ) : (
                                            <span className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-200 rounded-full">Bản nháp</span>
                                        )}
                                    </td>
                                    <td className="p-3 border-b text-center whitespace-nowrap">
                                        <button
                                            onClick={() => navigate(`/admin/edit-post/${post.id}`)}
                                            className="text-blue-500 hover:text-blue-700 font-semibold py-1 px-2 mr-2 rounded transition duration-200"
                                            title="Sửa"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(post.id)}
                                            className="text-red-500 hover:text-red-700 font-semibold py-1 px-2 rounded transition duration-200"
                                            title="Xóa"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="6" className="text-center p-6 text-gray-500">Không tìm thấy bài viết nào.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
}