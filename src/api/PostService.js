// src/api/PostService.js
import httpAxios from "./httpAxios";

// Lấy token admin (Giống như MenuService)
const getAdminToken = () => localStorage.getItem('adminToken');
const getAdminAuthHeaders = () => {
    const token = getAdminToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const PostService = {
    // === ADMIN API (Cần token) ===

    /**
     * Lấy tất cả bài viết cho trang admin.
     */
    getAllAdmin: () => {
        return httpAxios.get("/posts", { headers: getAdminAuthHeaders() });
    },

    /**
     * Lấy chi tiết 1 bài viết bằng ID (cho trang sửa).
     */
    getByIdAdmin: (id) => {
        return httpAxios.get(`/posts/${id}`, { headers: getAdminAuthHeaders() });
    },

    /**
     * Tạo bài viết mới.
     */
    create: (postData) => {
        return httpAxios.post("/posts", postData, { headers: getAdminAuthHeaders() });
    },

    /**
     * Cập nhật bài viết.
     */
    update: (id, postData) => {
        return httpAxios.put(`/posts/${id}`, postData, { headers: getAdminAuthHeaders() });
    },

    /**
     * Xóa bài viết.
     */
    remove: (id) => {
        return httpAxios.delete(`/posts/${id}`, { headers: getAdminAuthHeaders() });
    },

    // === PUBLIC API (Không cần token) ===

    /**
     * Lấy các bài viết đã CÔNG KHAI (cho trang người dùng).
     */
    getAllPublished: () => {
        return httpAxios.get("/posts/public");
    },

    /**
     * Lấy chi tiết bài viết CÔNG KHAI bằng SLUG.
     */
    getBySlug: (slug) => {
        return httpAxios.get(`/posts/public/${slug}`);
    }
};

export default PostService;