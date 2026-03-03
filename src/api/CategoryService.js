// src/api/CategoryService.js
import httpAxios from "./httpAxios"; // Đảm bảo đường dẫn đúng

// --- Hàm hỗ trợ lấy TOKEN ADMIN ---
const getAdminToken = () => localStorage.getItem('adminToken');
const getAdminAuthHeaders = () => {
    const token = getAdminToken();
    // Các hàm admin yêu cầu bắt buộc phải có token
    if (token) {
        return { Authorization: `Bearer ${token}` };
    } else {
        console.error("Không tìm thấy admin token cho cuộc gọi API Category");
        // Quan trọng: Ném lỗi hoặc trả về một cách xử lý phù hợp
        // thay vì header rỗng để tránh gọi API không cần thiết
        throw new Error("Admin token is missing");
        // return {};
    }
};

const CategoryService = {
    // === HÀM CÔNG KHAI (Cho trang người dùng - Không cần token) ===
    /**
     * Lấy tất cả danh mục (dùng cho client-side).
     */
    getAll: () => httpAxios.get("/categories"),

    /**
     * Lấy chi tiết danh mục theo ID (dùng cho client-side nếu cần).
     * Sửa lại: Không cần token admin ở đây nếu client cần xem chi tiết.
     * Nếu chỉ admin xem thì dùng getByIdAdmin.
     */
    getById: (id) => httpAxios.get(`/categories/${id}`),


    // === CÁC HÀM CHO ADMIN (Yêu cầu token Admin) ===
    /**
     * Lấy tất cả danh mục (dùng cho trang quản lý admin, cần token).
     * Đây là hàm mà CategoryList.jsx đang gọi.
     */
    getAllAdmin: () => httpAxios.get("/categories", { headers: getAdminAuthHeaders() }),

    /**
     * Lấy chi tiết danh mục theo ID (Admin).
     * Dùng hàm này trong EditCategory.jsx thay vì getById công khai.
     */
    getByIdAdmin: (id) => httpAxios.get(`/categories/${id}`, { headers: getAdminAuthHeaders() }),

    /**
     * Tạo danh mục mới (Admin).
     * Hàm này AddCategory.jsx đang gọi.
     */
    create: (categoryData) => {
         // Quan trọng: Khi gửi multipart/form-data, Content-Type phải do trình duyệt tự đặt
         const headers = getAdminAuthHeaders();
         // delete headers['Content-Type']; // Xóa Content-Type mặc định nếu gửi FormData
         // Tạm thời vẫn dùng JSON cho AddCategory (chưa có upload ảnh)
        return httpAxios.post("/categories", categoryData, { headers });
    },

    /**
     * Cập nhật danh mục (Admin).
     * Hàm này EditCategory.jsx đang gọi.
     */
    update: (id, formData) => { // <-- Nhận FormData thay vì categoryData
        const headers = getAdminAuthHeaders();
        // KHÔNG set 'Content-Type': 'multipart/form-data'
        // Axios sẽ tự động làm điều đó khi nhận FormData
        // delete headers['Content-Type']; // Không cần xóa nếu httpAxios không set mặc định

        // Truyền trực tiếp formData vào data của request
        return httpAxios.put(`/categories/${id}`, formData, { headers });
    },

    /**
     * Xóa danh mục (Admin).
     * Hàm này CategoryList.jsx đang gọi.
     */
    remove: (id) => httpAxios.delete(`/categories/${id}`, { headers: getAdminAuthHeaders() }),
};

export default CategoryService;