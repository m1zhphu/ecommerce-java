// src/api/UserService.js
import axios from 'axios';

// --- Tạo instance Axios với baseURL ---
const httpAxios = axios.create({
    baseURL: 'http://localhost:8080/api', // Đặt baseURL API của bạn ở đây
    headers: {
        'Content-Type': 'application/json',
    },
});

// --- Hàm hỗ trợ lấy TOKEN NGƯỜI DÙNG ---
const getUserToken = () => {
    // *** QUAN TRỌNG: Đảm bảo key 'userToken' là đúng ***
    return localStorage.getItem('userToken');
};
// Hàm tạo header User, trả về null nếu không có token
const getUserAuthHeadersOrNull = () => {
    const token = getUserToken();
    return token ? { Authorization: `Bearer ${token}` } : null;
};

// --- Hàm hỗ trợ lấy TOKEN ADMIN ---
const getAdminToken = () => localStorage.getItem('adminToken');
// Hàm tạo header Admin, trả về null nếu không có token
const getAdminAuthHeadersOrNull = () => {
    const token = getAdminToken();
    return token ? { Authorization: `Bearer ${token}` } : null;
};


const UserService = {

    // === API XÁC THỰC ===
    /**
     * Đăng nhập người dùng.
     * @param {object} credentials - { username: '...', password: '...' }
     */
    login: (credentials) => httpAxios.post("/auth/login", credentials),

    /**
     * Đăng ký người dùng mới.
     * @param {object} userData - { name, username, email, password }
     */
    register: (userData) => httpAxios.post("/auth/register", userData),

    // logout: () => { /* ... */ },


    // === API CHO NGƯỜI DÙNG ĐÃ ĐĂNG NHẬP ===
    /**
     * Lấy thông tin user hiện tại.
     * Trả về Promise.reject nếu chưa đăng nhập.
     */
    getCurrentUser: () => {
    const headers = getUserAuthHeadersOrNull();
    if (headers) {
        // TRẢ VỀ RESPONSE NGUYÊN GỐC (ĐÃ CÓ LOGIC XỬ LÝ DỮ LIỆU Ở BACKEND)
        return httpAxios.get("/users/me", { headers }); 
        
    } else {
        return Promise.reject(new Error("Người dùng chưa đăng nhập (không tìm thấy token)"));
    }
},
    // Ví dụ: Cập nhật profile (cần token user)
    // updateProfile: (userData) => {
    //     const headers = getUserAuthHeadersOrNull();
    //     if (!headers) return Promise.reject(new Error("Yêu cầu đăng nhập"));
    //     return httpAxios.put("/users/profile", userData, { headers });
    // },


    // === API CHO ADMIN ===
    /** Lấy tất cả user (cần token admin) */
    getAllUsers: () => {
        const headers = getAdminAuthHeadersOrNull();
        if (!headers) return Promise.reject(new Error("Yêu cầu quyền Admin"));
        return httpAxios.get("/users", { headers });
    },

    /** Lấy user theo ID (cần token admin) */
    getUserById_Admin: (id) => {
         const headers = getAdminAuthHeadersOrNull();
         if (!headers) return Promise.reject(new Error("Yêu cầu quyền Admin"));
        return httpAxios.get(`/users/${id}`, { headers });
    },

    /** Tạo user (cần token admin) */
    createUser_Admin: (userData) => {
        const headers = getAdminAuthHeadersOrNull();
        if (!headers) return Promise.reject(new Error("Yêu cầu quyền Admin"));
        return httpAxios.post("/users", userData, { headers });
     },

     /** Cập nhật user (cần token admin) */
    updateUser_Admin: (id, userData) => {
        const headers = getAdminAuthHeadersOrNull();
        if (!headers) return Promise.reject(new Error("Yêu cầu quyền Admin"));
        return httpAxios.put(`/users/${id}`, userData, { headers });
     },

     /** Xóa user (cần token admin) */
    deleteUser_Admin: (id) => {
        const headers = getAdminAuthHeadersOrNull();
        if (!headers) return Promise.reject(new Error("Yêu cầu quyền Admin"));
        return httpAxios.delete(`/users/${id}`, { headers });
     },
     updateProfile: (userData) => {
        const headers = getUserAuthHeadersOrNull();
        if (headers) {
            // *** API NÀY BẠN CẦN TẠO Ở BACKEND: PUT /api/users/me/update ***
            return httpAxios.put("/users/me/update", userData, { headers });
        } else {
            return Promise.reject(new Error("User not logged in"));
        }
    },
};

export default UserService;