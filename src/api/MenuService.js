// src/api/MenuService.js
import httpAxios from "./httpAxios"; // Đảm bảo đường dẫn đúng

// --- Hàm hỗ trợ lấy TOKEN ADMIN ---
const getAdminToken = () => localStorage.getItem('adminToken');
const getAdminAuthHeaders = () => {
    const token = getAdminToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const MenuService = {
    // === HÀM CÔNG KHAI (Cho trang người dùng - Không cần token) ===
    /**
     * Lấy tất cả menu (thường dùng cho client-side header).
     */
    getAll: () => httpAxios.get("/menus"),

    // === CÁC HÀM CHO ADMIN (Yêu cầu token Admin) ===
    /**
     * Lấy tất cả menu (dùng cho trang quản lý admin, cần token).
     */
    getAllAdmin: () => httpAxios.get("/menus", { headers: getAdminAuthHeaders() }), // <-- HÀM BẠN CẦN

    /**
     * Lấy chi tiết menu theo ID (Admin).
     */
    getByIdAdmin: (id) => httpAxios.get(`/menus/${id}`, { headers: getAdminAuthHeaders() }),

    /**
     * Tạo menu mới (Admin).
     */
    create: (menuData) => httpAxios.post("/menus", menuData, { headers: getAdminAuthHeaders() }),

    /**
     * Cập nhật menu (Admin).
     */
    update: (id, menuData) => httpAxios.put(`/menus/${id}`, menuData, { headers: getAdminAuthHeaders() }),

    /**
     * Xóa menu (Admin).
     */
    remove: (id) => httpAxios.delete(`/menus/${id}`, { headers: getAdminAuthHeaders() }),
};

export default MenuService;