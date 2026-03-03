// src/admin/category/AddCategory.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CategoryService from "../../api/CategoryService";
import CloudinaryService from "../../api/CloudinaryService"; // <-- 1. DÙNG CLOUDINARY
// import axios from "axios"; // Bỏ axios
import { ArrowLeft, Loader2, UploadCloud } from "lucide-react"; // Thêm icon

// const UPLOAD_API_URL = "http://localhost:8080/api/files/upload"; // <-- 2. BỎ URL CŨ

export default function AddCategory() {
  const [category, setCategory] = useState({
    name: "",
    description: "",
    image: "", // Trường này sẽ giữ URL Cloudinary
  });

  const [imageFile, setImageFile] = useState(null); 
  const [imagePreview, setImagePreview] = useState(""); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCategory({ ...category, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file)); 
    } else {
      setImageFile(null);
      setImagePreview("");
    }
  };

  // --- 3. HÀM SUBMIT ĐÃ ĐƯỢC CẬP NHẬT ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category.name.trim()) {
      alert("Tên danh mục không được để trống!");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      let finalImageUrl = ""; 

      // === BƯỚC 1: UPLOAD FILE LÊN CLOUDINARY (NẾU CÓ) ===
      if (imageFile) {
        setMessage("Đang tải ảnh lên Cloudinary...");
        // Gọi CloudinaryService, gửi file và tên thư mục "categories"
        finalImageUrl = await CloudinaryService.upload(imageFile, "categories");
        
        if (!finalImageUrl) {
            throw new Error("Không nhận được URL ảnh từ Cloudinary.");
        }
      }

      // === BƯỚC 2: TẠO CATEGORY (GỬI JSON VỚI URL ẢNH) ===
      setMessage("Đang tạo danh mục...");
      const categoryData = {
        name: category.name,
        description: category.description,
        image: finalImageUrl, // Gửi URL Cloudinary (hoặc chuỗi rỗng)
      };

      // Gọi API create category (CategoryController của bạn)
      await CategoryService.create(categoryData);

      setMessage("Thêm danh mục thành công! Sẽ tự động quay lại sau 2 giây.");
      setTimeout(() => navigate("/admin/categories"), 2000);

    } catch (err) {
      console.error("Lỗi khi thêm danh mục:", err);
      const errorMsg = err.response?.data?.message || err.message || "Thêm danh mục thất bại!";
      setMessage(errorMsg);
      setIsSubmitting(false);
    }
  };

  // --- RENDER ---
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Tạo danh mục mới</h1>
          <p className="text-gray-500 mt-1">Điền thông tin cho danh mục sản phẩm của bạn.</p>
        </div>
        <button 
          onClick={() => navigate("/admin/categories")} 
          className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg transition duration-200"
        >
          <ArrowLeft size={20} />
          Quay lại
        </button>
      </div>

      {message && (
        <div className={`mb-4 p-4 rounded-lg text-center font-medium ${
            message.includes("thành công") ? "bg-green-100 text-green-800" 
            : (message.includes("Đang tải") || message.includes("Đang tạo") ? "bg-blue-100 text-blue-800" : "bg-red-100 text-red-800")
        }`}>
            {message.includes("Đang") && <Loader2 size={20} className="inline-block animate-spin mr-2" />}
            {message}
        </div>
      )}

      <div className="bg-white p-8 rounded-xl shadow-lg max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">Tên danh mục</label>
            <input
              id="name"
              type="text"
              name="name"
              value={category.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="Ví dụ: Áo Thun, Quần Jeans..."
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">Mô tả</label>
            <textarea
              id="description"
              name="description"
              value={category.description}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500 transition"
              rows={4}
              placeholder="Mô tả ngắn về các sản phẩm trong danh mục này..."
            />
          </div>

          {/* === Ô UPLOAD ẢNH (Sửa lại giao diện) === */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Hình ảnh</label>
            <div className="mt-2 flex justify-center rounded-lg border-2 border-dashed border-gray-300 px-6 py-10">
                <div className="text-center">
                  {imagePreview ? ( 
                    <img src={imagePreview} alt="Xem trước" className="mx-auto h-40 w-auto object-contain rounded-md" /> 
                  ) : (
                    <>
                      <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-4 flex text-sm justify-center leading-6 text-gray-600">
                        <label htmlFor="imageFile" className="relative cursor-pointer rounded-md font-semibold text-blue-600 hover:text-blue-500">
                          <span>Tải ảnh lên</span>
                          <input id="imageFile" name="imageFile" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                        </label>
                      </div>
                      <p className="text-xs leading-5 text-gray-500">PNG, JPG, GIF...</p>
                    </>
                  )}
                </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-300 disabled:bg-gray-400"
            >
              {isSubmitting ? 'Đang lưu...' : 'Tạo danh mục'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}