// src/api/FileUploadService.js

import httpAxios from "./httpAxios";

// Địa chỉ server Spring Boot của bạn (dùng cho ảnh cũ)
const API_URL = "http://localhost:8080"; 

// (Các hàm hỗ trợ token của bạn, giữ nguyên)
const getToken = () => {
  return localStorage.getItem('adminToken');
};

const getAuthHeadersForUpload = () => {
  const token = getToken();
  const headers = {
    'Content-Type': 'multipart/form-data', 
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};


const FileUploadService = {
  
  /**
   * Hàm upload này (tải lên localhost) có thể vẫn cần
   * nếu bạn muốn giữ lại chức năng upload cũ ở đâu đó.
   */
  upload: (file, subDirectory) => { 
    const formData = new FormData(); 
    formData.append("file", file);
    formData.append("dir", subDirectory); 
    
    return httpAxios.post("/files/upload", formData, { headers: getAuthHeadersForUpload() });
  },

  /**
   * === HÀM getImageUrl ĐÃ ĐƯỢC SỬA LỖI ===
   */
  getImageUrl: (fileName, folder) => {
    
    if (!fileName) {
      // 1. Trả về ảnh placeholder nếu không có ảnh
      return "https://via.placeholder.com/150?text=No+Image"; 
    }

    // 2. KIỂM TRA QUAN TRỌNG:
    // Nếu 'fileName' (lấy từ DB) đã là một URL đầy đủ (từ Cloudinary)
    if (fileName.startsWith("http://") || fileName.startsWith("https://")) {
      return fileName; // Trả về URL đó ngay lập tức
    }
    
    // 3. (Dành cho ảnh cũ): Nếu 'fileName' KHÔNG phải là URL,
    //    thì nó là tên file cũ, lúc này mới thêm đường dẫn localhost vào.
    return `${API_URL}/uploads/images/${folder}/${fileName}`;
  }
};

export default FileUploadService;