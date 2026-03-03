// src/api/OrderService.js
import httpAxios from "./httpAxios"; 

// --- Hàm lấy token USER/MẶC ĐỊNH ---
const getUserToken = () => {
    return localStorage.getItem('userToken'); 
};

// --- Hàm lấy token ADMIN (Ưu tiên tìm adminToken) ---
const getAdminToken = () => {
    // 1. Tìm token Admin
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
        return adminToken; 
    }
    // 2. Fallback về token User (nếu Admin chưa đăng nhập nhưng User có đăng nhập)
    return localStorage.getItem('userToken');
};


/**
 * Tạo header 'Authorization' (Dùng cho các API User)
 */
const getUserAuthHeaders = () => {
    const token = getUserToken(); // Chỉ đọc từ 'userToken'
    if (token) {
        return { Authorization: `Bearer ${token}` };
    } else {
        return {}; 
    }
};

/**
 * Tạo header 'Authorization' (Dùng cho các API Admin)
 */
const getAdminAuthHeaders = () => {
    const token = getAdminToken(); // Ưu tiên đọc từ 'adminToken'
    if (token) {
        return { Authorization: `Bearer ${token}` };
    }
    return {}; 
};


const OrderService = {

    // ========================================================
    // ===          API CHO USER (NGƯỜI DÙNG)               ===
    // ========================================================

    // Các hàm này (placeOrder, getMyOrders, getOrderDetailById) vẫn dùng getUserAuthHeaders()
    placeOrder: (orderData) => {
        const headers = getUserAuthHeaders();
        if (headers.Authorization) {
            return httpAxios.post("/orders/place", orderData, { headers });
        } else {
            return Promise.reject(new Error("User not logged in"));
        }
    },

    getMyOrders: () => {
        const headers = getUserAuthHeaders();
        if (headers.Authorization) {
            return httpAxios.get("/orders/my-history", { headers });
        } else {
            return Promise.reject(new Error("User not logged in"));
        }
    },

    getOrderDetailById: (orderId) => {
        const headers = getUserAuthHeaders();
        if (!headers.Authorization) return Promise.reject(new Error("User not logged in"));
        return httpAxios.get(`/orders/${orderId}`, { headers });
    },

    // ========================================================
    // ===           API CHO ADMIN (QUẢN TRỊ VIÊN)         ===
    // ========================================================

    /**
     * [ADMIN] Lấy TẤT CẢ đơn hàng.
     */
    getAllOrders: () => {
        // === SỬ DỤNG HÀM MỚI ===
        const headers = getAdminAuthHeaders(); 
        if (!headers.Authorization) return Promise.reject(new Error("Admin not logged in"));
        // Backend sẽ kiểm tra token này có phải ROLE_ADMIN không
        return httpAxios.get("/orders", { headers });
    },

    /**
     * [ADMIN] Lấy CHI TIẾT 1 đơn hàng bất kỳ.
     */
    getOrderDetailForAdmin: (orderId) => {
        // === SỬ DỤNG HÀM MỚI ===
        const headers = getAdminAuthHeaders();
        if (!headers.Authorization) return Promise.reject(new Error("Admin not logged in"));
        return httpAxios.get(`/orders/admin/${orderId}`, { headers });
    },

    /**
     * [ADMIN] Cập nhật trạng thái đơn hàng.
     */
    updateOrderStatus: (orderId, newStatus) => {
        // === SỬ DỤNG HÀM MỚI ===
        const headers = getAdminAuthHeaders();
        if (!headers.Authorization) return Promise.reject(new Error("Admin not logged in"));
        
        const body = { status: newStatus };
        
        return httpAxios.put(`/orders/admin/${orderId}/status`, body, { headers });
    }
};

export default OrderService;