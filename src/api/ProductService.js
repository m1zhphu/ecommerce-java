// src/api/ProductService.js
import httpAxios from "./httpAxios";

// --- Hàm hỗ trợ lấy TOKEN ADMIN (Chỉ dùng cho CRUD Admin) ---
const getAdminToken = () => localStorage.getItem('adminToken');

const getAdminAuthHeaders = () => {
    const token = getAdminToken();
    if (token) {
        return { Authorization: `Bearer ${token}` };
    } else {
        return {};
    }
};

// --- CẤU TRÚC API TỐI ƯU ---
const ProductService = {

    /**
     * LẤY DANH SÁCH SẢN PHẨM CÔNG KHAI VỚI CÁC TÙY CHỌN LỌC.
     * API này dùng cho trang hiển thị TẤT CẢ sản phẩm.
     * @param {object} params - { keyword, sortBy, sortDir, minPrice, maxPrice, status }
     * @returns {Promise} (KHÔNG YÊU CẦU TOKEN)
     */
    getAllWithFilter: (params) => {
        // Backend cần xử lý: GET /api/products?keyword=...&sortBy=...
        return httpAxios.get("/products", { params });
    },
    
    // ======== CÁC HÀM GET CŨ HƯỚNG VỀ HÀM CHUNG ========

    /** Lấy tất cả sản phẩm (Public) */
    getAll: () => ProductService.getAllWithFilter({}),

    /** Lọc theo danh mục (Public) */
    filterByCategory: (cateId) => {
        // Giữ lại API này nếu backend có endpoint riêng, nhưng nên bỏ header
        return httpAxios.get(`/products/category/${cateId}`);
        // HOẶC dùng chung: return ProductService.getAllWithFilter({ categoryId: cateId });
    },

    // ======== CRUD Admin (Yêu cầu ADMIN token) ========
    
    getById: (id) => httpAxios.get(`/products/${id}`), 
    
    create: (data) => 
        httpAxios.post("/products", data, { headers: getAdminAuthHeaders() }),

    update: (id, data) => 
        httpAxios.put(`/products/${id}`, data, { headers: getAdminAuthHeaders() }),

    remove: (id) => 
        httpAxios.delete(`/products/${id}`, { headers: getAdminAuthHeaders() }),
};

export default ProductService;