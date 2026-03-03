// src/admin/menu/AddMenu.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MenuService from "../../api/MenuService";
import { Save, XCircle, ArrowLeft, Loader2 } from "lucide-react"; // Thêm Loader2

export default function AddMenu() {
    // State cho các trường của form
    const [name, setName] = useState("");
    const [link, setLink] = useState("");
    const [displayOrder, setDisplayOrder] = useState(0);
    const [parentId, setParentId] = useState(""); 
    const [position, setPosition] = useState("main_menu");
    const [status, setStatus] = useState(true);

    // --- THAY ĐỔI STATE CHO THÔNG BÁO ---
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState(""); // Thay thế cho error

    const navigate = useNavigate();

    // Hàm xử lý khi submit form
    const handleSubmit = async (e) => {
        e.preventDefault(); 
        setMessage(""); // Xóa thông báo cũ

        // --- Validate đơn giản ---
        if (!name.trim()) {
            setMessage("Tên menu không được để trống."); // Dùng setMessage
            return;
        }
        if (!link.trim()) {
            setMessage("Đường dẫn (link) không được để trống."); // Dùng setMessage
            return;
        }
        
        setIsSubmitting(true);

        // --- Tạo đối tượng DTO để gửi đi ---
        const menuData = {
            name: name,
            link: link,
            displayOrder: parseInt(displayOrder) || 0,
            parentId: parentId ? parseInt(parentId) : null,
            position: position,
            status: status,
        };

        try {
            // --- Gọi API tạo mới từ MenuService ---
            await MenuService.create(menuData); 
            
            // --- THAY THẾ ALERT() BẰNG MESSAGE VÀ TIMEOUT ---
            setMessage("Thêm menu mới thành công! Sẽ tự động quay lại sau 2 giây.");
            setTimeout(() => navigate("/admin/menus"), 2000); 

        } catch (err) {
            console.error("Lỗi khi thêm menu:", err);
            // --- CẬP NHẬT LỖI VÀO MESSAGE ---
            const errorMsg = err.response?.data?.message || err.message || "Có lỗi xảy ra. Vui lòng thử lại.";
            setMessage(errorMsg);
            setIsSubmitting(false); // Cho phép thử lại nếu lỗi
        }
        // Bỏ 'finally' vì logic đã xử lý ở trên
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Thêm Menu Mới</h1>
                <button
                    onClick={() => navigate("/admin/menus")} 
                    className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition duration-200"
                >
                    <ArrowLeft size={20} />
                    Quay lại danh sách
                </button>
            </div>

            {/* --- DIV THÔNG BÁO MỚI (GIỐNG ADDPRODUCT) --- */}
            {message && (
                <div className={`mb-4 p-4 rounded-lg text-center font-medium ${
                    message.includes("thành công") 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                }`}>
                    {message}
                </div>
            )}

            {/* Form Thêm Mới */}
            <form onSubmit={handleSubmit}>
                {/* Grid layout cho form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Cột 1 */}
                    <div className="space-y-4">
                        {/* Tên Menu */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                Tên Menu <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Ví dụ: Trang chủ"
                            />
                        </div>

                        {/* Đường dẫn (Link) */}
                        <div>
                            <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-1">
                                Đường dẫn (Link) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="link"
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                                className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Ví dụ: / hoặc /san-pham"
                            />
                        </div>
                        
                        {/* Vị trí */}
                        <div>
                            <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
                                Vị trí
                            </label>
                            <select
                                id="position"
                                value={position}
                                onChange={(e) => setPosition(e.target.value)}
                                className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                            >
                                <option value="main_menu">Main Menu</option>
                                <option value="footer_menu">Footer Menu</option>
                            </select>
                        </div>
                    </div>
                    
                    {/* Cột 2 */}
                    <div className="space-y-4">
                        {/* Thứ tự hiển thị */}
                        <div>
                            <label htmlFor="displayOrder" className="block text-sm font-medium text-gray-700 mb-1">
                                Thứ tự hiển thị
                            </label>
                            <input
                                type="number"
                                id="displayOrder"
                                value={displayOrder}
                                onChange={(e) => setDisplayOrder(e.target.value)}
                                className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        {/* Menu Cha (Parent ID) */}
                        <div>
                            <label htmlFor="parentId" className="block text-sm font-medium text-gray-700 mb-1">
                                Menu Cha (Nhập ID)
                            </label>
                            <input
                                type="number"
                                id="parentId"
                                value={parentId}
                                onChange={(e) => setParentId(e.target.value)}
                                className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Bỏ trống nếu là menu gốc"
                            />
                        </div>
                        
                        {/* Trạng thái */}
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                                Trạng thái
                            </label>
                            <select
                                id="status"
                                value={status}
                                onChange={(e) => setStatus(e.target.value === "true")}
                                className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                            >
                                <option value="true">Hiển thị</option>
                                <option value="false">Đang ẩn</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Nút Submit và Hủy */}
                <div className="flex justify-end items-center gap-4 mt-8 pt-6 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={() => navigate("/admin/menus")}
                        disabled={isSubmitting} // Cập nhật disable
                        className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50"
                    >
                        <XCircle size={20} />
                        Hủy
                    </button>
                    {/* --- CẬP NHẬT NÚT SUBMIT --- */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center justify-center gap-2 w-36 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <Loader2 size={20} className="animate-spin" />
                        ) : (
                            <Save size={20} />
                        )}
                        {isSubmitting ? "Đang lưu..." : "Lưu Menu"}
                    </button>
                </div>
            </form>
        </div>
    );
}