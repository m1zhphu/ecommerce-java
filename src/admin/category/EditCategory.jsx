// src/admin/category/EditCategory.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CategoryService from "../../api/CategoryService";
import CloudinaryService from "../../api/CloudinaryService"; // <-- 1. DÙNG CLOUDINARY
import FileUploadService from "../../api/FileUploadService"; // <-- 2. DÙNG ĐỂ HIỂN THỊ ẢNH
import { ArrowLeft, UploadCloud, XCircle, Loader2 } from "lucide-react"; 

// Bỏ URL cũ
// const IMAGE_CATEGORY_URL = "http://localhost:8080/uploads/images/categories/";

export default function EditCategory() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [category, setCategory] = useState({
    id: null,
    name: "",
    description: "",
    image: null, // Sẽ lưu URL đầy đủ từ Cloudinary
  });
  
  const [imageFile, setImageFile] = useState(null); // State lưu file ảnh mới chọn
  const [imagePreview, setImagePreview] = useState(null); // State lưu URL xem trước (cho ảnh mới)

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch dữ liệu category
  useEffect(() => {
    setLoading(true);
    setMessage(""); 
    CategoryService.getByIdAdmin(id) 
      .then((res) => {
        setCategory(res.data); 
        // Không cần set imagePreview ở đây, <img> sẽ tự động hiển thị ảnh gốc
      })
      .catch((err) => {
        console.error("Lỗi tải category:", err);
        setMessage("Không thể tải dữ liệu danh mục!");
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          setMessage("Bạn không có quyền truy cập hoặc phiên đăng nhập hết hạn.");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  // Xử lý thay đổi input text
  const handleChange = (e) => {
    setCategory({ ...category, [e.target.name]: e.target.value });
  };

  // Xử lý thay đổi input file ảnh
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file); // Lưu file mới
      setImagePreview(URL.createObjectURL(file)); // Hiện preview file mới
    }
  };

  // Xử lý xóa ảnh (quay về ảnh gốc)
  const handleRemoveImage = () => {
     setImageFile(null);
     setImagePreview(null); // Bỏ preview ảnh mới
     document.getElementById('imageFile').value = null;
  }

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
        let finalImageUrl = category.image; // Mặc định là URL ảnh gốc

        // BƯỚC 1: UPLOAD ẢNH MỚI NẾU CÓ
        if (imageFile) {
            setMessage("Đang tải ảnh mới lên Cloudinary...");
            const newUrl = await CloudinaryService.upload(imageFile, "categories");
            if (!newUrl) {
                throw new Error("Không nhận được URL mới từ Cloudinary.");
            }
            finalImageUrl = newUrl; // Lấy URL mới
        }

        // BƯỚC 2: TẠO DỮ LIỆU GỬI ĐI (JSON)
        // Lưu ý: Backend của bạn phải được thiết kế để nhận JSON cho hàm update
        const categoryData = {
            name: category.name,
            description: category.description,
            image: finalImageUrl // Gửi URL (mới hoặc cũ)
        };
        
        setMessage("Đang cập nhật danh mục...");
        // BƯỚC 3: GỌI API UPDATE
        await CategoryService.update(id, categoryData); 
        
        setMessage("Cập nhật danh mục thành công! Sẽ tự động quay lại sau 2 giây.");
        setTimeout(() => navigate("/admin/categories"), 2000);

    } catch (err) {
        console.error("Lỗi cập nhật category:", err);
        let errorMsg = "Cập nhật danh mục thất bại! Vui lòng thử lại.";
         if (err.response) {
            if(err.response.status === 400) { 
                 errorMsg += ` (${err.response.data?.message || 'Dữ liệu không hợp lệ'})`;
            } else if (err.response.status === 401 || err.response.status === 403) {
                 errorMsg = "Phiên đăng nhập hết hạn hoặc bạn không có quyền.";
            }
         }
        setMessage(errorMsg);
        setIsSubmitting(false); // Cho phép thử lại
    }
  };

  // ---- RENDER ----

  if (loading) {
     return (
        <div className="flex justify-center items-center min-h-[500px]">
            <Loader2 size={40} className="animate-spin text-blue-500" />
            <span className="ml-3 text-lg text-gray-600">Đang tải dữ liệu...</span>
        </div>
    );
  }

  // Hiển thị lỗi nếu không tải được category ban đầu
  if (!loading && !category.id && message) {
      return (
        <div className="container mx-auto px-4 py-10 text-center">
            <p className="text-red-600 font-semibold mb-4">{message}</p>
            <button
                onClick={() => navigate("/admin/categories")}
                className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg transition duration-200 mx-auto"
            >
                <ArrowLeft size={20} />
                Quay lại Danh sách
            </button>
        </div>
      );
  }

  // Xác định URL ảnh để hiển thị:
  // 1. Ưu tiên ảnh preview (ảnh mới chọn)
  // 2. Nếu không, dùng ảnh gốc (lấy từ FileUploadService)
  const displayImageUrl = imagePreview || FileUploadService.getImageUrl(category.image, "categories");

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Chỉnh sửa danh mục #{id}</h1>
          <p className="text-gray-500 mt-1">Cập nhật thông tin và hình ảnh.</p>
        </div>
        <button
          onClick={() => navigate("/admin/categories")}
          className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg transition duration-200"
        >
          <ArrowLeft size={20} />
          Quay lại
        </button>
      </div>

      {/* Thông báo */}
      {message && (
        <div className={`mb-4 p-4 rounded-lg text-center font-medium ${
            message.includes("thành công") ? "bg-green-100 text-green-800" 
            : (message.includes("Đang tải") || message.includes("Đang cập nhật") ? "bg-blue-100 text-blue-800" : "bg-red-100 text-red-800")
        }`}>
            {message.includes("Đang") && <Loader2 size={20} className="inline-block animate-spin mr-2" />}
            {message}
        </div>
      )}

      {/* Form */}
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tên danh mục */}
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">Tên danh mục <span className="text-red-500">*</span></label>
            <input
              id="name"
              type="text"
              name="name"
              value={category.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500 transition"
              required
            />
          </div>

          {/* Mô tả */}
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">Mô tả</label>
            <textarea
              id="description"
              name="description"
              value={category.description || ''}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500 transition"
              rows={4}
            />
          </div>

          {/* Upload Ảnh */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Hình ảnh</label>
            <div className="flex items-center gap-4">
              {/* Phần hiển thị ảnh preview */}
              <div className="w-32 h-32 border border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden relative group">
                {displayImageUrl && displayImageUrl !== "https://via.placeholder.com/150?text=No+Image" ? (
                  <>
                    <img src={displayImageUrl} alt="Xem trước" className="w-full h-full object-contain" />
                    {/* Nút xóa ảnh (chỉ khi có ảnh MỚI) */}
                    {imagePreview && (
                        <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Quay lại ảnh gốc"
                        >
                            <XCircle size={16} />
                        </button>
                    )}
                  </>
                ) : (
                  <span className="text-xs text-gray-400">Chưa có ảnh</span>
                )}
              </div>
              {/* Phần input file */}
              <label htmlFor="imageFile" className="cursor-pointer bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition flex items-center gap-2">
                <UploadCloud size={18} />
                <span>{category.image || imageFile ? 'Thay đổi ảnh' : 'Chọn ảnh'}</span>
                <input
                  id="imageFile"
                  type="file"
                  name="imageFile"
                  onChange={handleImageChange}
                  className="hidden" 
                  accept="image/png, image/jpeg, image/gif, image/webp" 
                />
              </label>
            </div>
             <p className="text-xs text-gray-500 mt-1">Chọn ảnh mới nếu muốn thay đổi ảnh hiện tại.</p>
          </div>

          {/* Nút Submit */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}