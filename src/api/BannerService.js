import httpAxios from "./httpAxios";

// === HÀM HỖ TRỢ LẤY TOKEN VÀ TẠO HEADER ===
const getToken = () => localStorage.getItem('adminToken');

const getAuthHeaders = () => {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const BannerService = {
    // Lấy tất cả banner
    getAll: () => httpAxios.get("/banners"),
    // Lấy banner theo ID (ví dụ)
    getById: (id) => httpAxios.get(`/banners/${id}`),   
    // Tạo banner mới (cần gửi data banner)
    create: (bannerData) => httpAxios.post("/banners", bannerData, { headers: getAuthHeaders() }),

    // Cập nhật banner (cần id và data banner)
    update: (id, bannerData) => httpAxios.put(`/banners/${id}`, bannerData, { headers: getAuthHeaders() }),

    // Xóa banner
    remove: (id) => httpAxios.delete(`/banners/${id}`, { headers: getAuthHeaders() }),

    // Có thể cần hàm upload ảnh riêng nếu backend yêu cầu
    // uploadImage: (formData) => httpAxios.post("/files/upload/banner", formData, {
    //     headers: { ...getAuthHeaders(), 'Content-Type': 'multipart/form-data' }
    // }),
};

export default BannerService;