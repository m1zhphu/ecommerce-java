// src/api/CartService.js
import httpAxios from "./httpAxios";

// --- Hàm lấy token người dùng (Copy từ UserService) ---
const getUserToken = () => {
    return localStorage.getItem('userToken'); 
};

// --- Hàm tạo header Authorization cho người dùng (Copy từ UserService) ---
const getUserAuthHeaders = () => {
    const token = getUserToken();
    if (token) {
        return { Authorization: `Bearer ${token}` };
    } else {
        console.error("User token not found for Cart API call");
        return {}; 
    }
};

const CartService = {
    /**
     * Lấy thông tin tóm tắt giỏ hàng (ví dụ: số lượng sản phẩm).
     */
    getCartInfo: () => {
        const headers = getUserAuthHeaders();
        if (headers.Authorization) {
            return httpAxios.get("/cart/info", { headers }); 
        } else {
            return Promise.reject(new Error("User not logged in"));
        }
    },

    /**
     * Lấy chi tiết toàn bộ giỏ hàng.
     */
    getCartDetails: () => {
        const headers = getUserAuthHeaders();
        if (headers.Authorization) {
            return httpAxios.get("/cart", { headers });
        } else {
            return Promise.reject(new Error("User not logged in"));
        }
    },

    /**
     * Thêm sản phẩm vào giỏ hàng.
     * @param {object} itemData - Dữ liệu (ví dụ: { productVariantId: 123, quantity: 1 }).
     */
    addItemToCart: (itemData) => {
        const headers = getUserAuthHeaders();
        if (headers.Authorization) {
           return httpAxios.post("/cart/add", itemData, { headers });
        } else {
            return Promise.reject(new Error("User not logged in"));
        }
    },

    /**
     * Cập nhật số lượng sản phẩm trong giỏ hàng.
     */
    updateCartItem: (itemId, quantity) => {
        const headers = getUserAuthHeaders();
        if (headers.Authorization) {
           return httpAxios.put(`/cart/update/${itemId}`, { quantity }, { headers });
        } else {
            return Promise.reject(new Error("User not logged in"));
        }
    },

    /**
     * Xóa sản phẩm khỏi giỏ hàng.
     */
    removeCartItem: (itemId) => {
         const headers = getUserAuthHeaders();
        if (headers.Authorization) {
           return httpAxios.delete(`/cart/remove/${itemId}`, { headers });
        } else {
            return Promise.reject(new Error("User not logged in"));
        }
    },

};

export default CartService;