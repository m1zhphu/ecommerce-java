// src/admin/menu/EditMenu.jsx

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MenuService from "../../api/MenuService";
import { Save, XCircle, ArrowLeft, Loader2 } from "lucide-react";

export default function EditMenu() {
    const { id } = useParams();
    const navigate = useNavigate();

    // State cho các trường của form
    const [name, setName] = useState("");
    const [link, setLink] = useState("");
    const [displayOrder, setDisplayOrder] = useState(0);
    const [parentId, setParentId] = useState(""); 
    const [position, setPosition] = useState("main_menu");
    const [status, setStatus] = useState(true);

    // --- THAY ĐỔI STATE CHO THÔNG BÁO ---
    const [pageLoading, setPageLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false); // Thay thế 'formLoading'
    const [message, setMessage] = useState(""); // Thay thế 'error'

    // --- 1. Tải dữ liệu menu cần chỉnh sửa ---
    useEffect(() => {
        const fetchMenuData = async () => {
            setPageLoading(true);
            setMessage(""); // Dùng setMessage
            try {
                const res = await MenuService.getByIdAdmin(id);
                const menu = res.data;

                // Điền dữ liệu vào state
                setName(menu.name);
                setLink(menu.link);
                setDisplayOrder(menu.displayOrder);
                setParentId(menu.parentId ? String(menu.parentId) : "");
                setPosition(menu.position);
                setStatus(menu.status);

            } catch (err) {
                console.error("Lỗi khi tải chi tiết menu:", err);
                setMessage("Không thể tải dữ liệu menu. Vui lòng thử lại."); // Dùng setMessage
            } finally {
                setPageLoading(false);
            }
        };

        fetchMenuData();
    }, [id]); 

    // --- 2. Hàm xử lý khi submit form ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(""); // Xóa thông báo cũ

        if (!name.trim() || !link.trim()) {
            setMessage("Tên menu và Đường dẫn không được để trống."); // Dùng setMessage
            return;
        }

        setIsSubmitting(true);

        const menuData = {
            name: name,
            link: link,
            displayOrder: parseInt(displayOrder) || 0,
            parentId: parentId ? parseInt(parentId) : null,
            position: position,
            status: status,
        };

        try {
            await MenuService.update(id, menuData); 
            
            // --- THAY THẾ ALERT() BẰNG MESSAGE VÀ TIMEOUT ---
            setMessage("Cập nhật menu thành công! Sẽ tự động quay lại sau 2 giây.");
            setTimeout(() => navigate("/admin/menus"), 2000);

        } catch (err) {
            console.error("Lỗi khi cập nhật menu:", err);
            // --- CẬP NHẬT LỖI VÀO MESSAGE ---
            const errorMsg = err.response?.data?.message || "Có lỗi xảy ra khi cập nhật.";
            setMessage(errorMsg);
            setIsSubmitting(false); // Cho phép thử lại nếu lỗi
        }
    };

    // --- 3. Render ---

    // Hiển thị loading khi đang tải dữ liệu
    if (pageLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 size={40} className="animate-spin text-blue-500" />
                <span className="ml-3 text-lg text-gray-600">Đang tải dữ liệu...</span>
            </div>
        );
    }

    // Hiển thị lỗi nếu không tải được dữ liệu (dùng message)
    if (message && !name) { 
        return (
             <div className="max-w-4xl mx-auto p-6">
                 <button
                    onClick={() => navigate("/admin/menus")}
                    className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition duration-200 mb-4"
                >
                    <ArrowLeft size={20} />
                    Quay lại danh sách
                </button>
                {/* --- DIV THÔNG BÁO LỖI FETCH --- */}
                <div className="p-4 rounded-lg bg-red-100 text-red-800 text-center font-medium">
                    {message}
                </div>
            </div>
        );
    }

    // Hiển thị form
    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Chỉnh Sửa Menu (ID: {id})</h1>
                <button
                    onClick={() => navigate("/admin/menus")}
                    className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition duration-200"
                >
                    <ArrowLeft size={20} />
                    Quay lại danh sách
                </button>
            </div>

            {/* --- DIV THÔNG BÁO MỚI (CHO SUBMIT) --- */}
            {message && name && ( // Chỉ hiển thị lỗi submit nếu 'name' đã được load
                <div className={`mb-4 p-4 rounded-lg text-center font-medium ${
                    message.includes("thành công") 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                }`}>
                    {message}
                </div>
            )}

            {/* Form Chỉnh Sửa */}
            <form onSubmit={handleSubmit}>
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
                        className="flex items-center justify-center gap-2 w-44 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <Loader2 size={20} className="animate-spin" />
                        ) : (
                            <Save size={20} />
                        )}
                        {isSubmitting ? "Đang lưu..." : "Lưu Thay Đổi"}
                    </button>
                </div>
            </form>
        </div>
    );
}