// src/api/CloudinaryService.js

/**
 * Upload file trực tiếp lên Cloudinary từ client.
 * @param {File} file - File người dùng chọn
 * @param {string} folder - Tên thư mục trên Cloudinary (vd: "products", "posts")
 * @returns {Promise<string>} - URL đầy đủ của ảnh đã upload
 */
const uploadImageToCloudinary = async (file, folder) => { // <-- SỬA 1: Thêm 'folder'
    if (!file) return null;

    const cloudName = 'dprmkgydy'; 
    const uploadPreset = 'ml_default'; 

    const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
    const formData = new FormData();

    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    
    // --- SỬA 2: Thêm dòng này ---
    // Gửi tên thư mục cho Cloudinary
    formData.append('folder', folder); 
    // ---------------------------------

    try {
        const res = await fetch(url, {
            method: 'POST',
            body: formData
        });

        if (!res.ok) {
            const text = await res.text();
            throw new Error('Image upload failed: ' + text);
        }

        const data = await res.json();
        return data.secure_url || data.url; // Trả về URL an toàn 

    } catch (err) {
        console.error("Cloudinary upload error:", err);
        throw err; 
    }
};

const CloudinaryService = {
    upload: uploadImageToCloudinary
};

export default CloudinaryService;