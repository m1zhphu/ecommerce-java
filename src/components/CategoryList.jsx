// src/components/CategoryList.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryService from '../api/CategoryService.js';

// 1. Import Swiper components and styles
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation'; // Import navigation styles if using arrows
import 'swiper/css/scrollbar'; // Import scrollbar styles if using scrollbar

// 2. Import Swiper modules
import { Navigation } from 'swiper/modules'; // Add Navigation
// import { Scrollbar } from 'swiper/modules'; // Add Scrollbar if needed

// URL ảnh
import FileUploadService from '../api/FileUploadService.js';
//const IMAGE_CATEGORY_URL = "http://localhost:8080/uploads/images/categories/";

export default function CategoryList() {
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    // Logic fetch dữ liệu (Giữ nguyên)
    useEffect(() => {
        CategoryService.getAll()
            .then(response => {
                const categoryData = response.data?._embedded?.categoryDtoList ?? response.data ?? [];
                // setCategories(categoryData.filter(c => c.status === true)); // Chỉ lấy active
                setCategories(categoryData); // Lấy tất cả
            })
            .catch(error => console.error("CategoryList: Lỗi khi tải danh mục!", error));
    }, []);

    const handleCategoryClick = (categoryId) => {
        navigate(`/products/category/${categoryId}`);
    };

    // --- RENDER ---
    return (
        // Nền trắng, padding dọc
        <div className="bg-white py-16 md:py-10">
            <div className="container mx-auto px-4 lg:px-6">
                {/* Tiêu đề */}
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-center text-gray-900 mb-12">
                    Khám Phá Danh Mục
                </h2>
                {/* THAY ĐỔI: Sử dụng Swiper */}
                <Swiper
                    modules={[Navigation]} // Thêm Navigation vào modules
                    spaceBetween={16} // Khoảng cách giữa các slide (thay cho space-x) - md: 24px
                    slidesPerView={2.3} // Hiển thị hơn 2 slide một chút trên mobile nhỏ
                    navigation={true} // Bật nút mũi tên
                    // Cấu hình breakpoints cho responsive
                    breakpoints={{
                        // >= 640px (sm)
                        640: {
                          slidesPerView: 3.3, // Hiển thị hơn 3 slide
                          spaceBetween: 20,
                        },
                        // >= 768px (md)
                        768: {
                          slidesPerView: 4, // Hiển thị đúng 4 slide
                          spaceBetween: 24,
                        },
                        // >= 1024px (lg)
                        1024: {
                          slidesPerView: 5, // Hiển thị đúng 5 slide
                          spaceBetween: 24,
                        },
                    }}
                    className="category-swiper pb-4" // Thêm class để style mũi tên + padding bottom nếu cần
                >
                    {categories.map(category => (
                        <SwiperSlide key={category.id} className="h-auto"> {/* Thêm h-auto */}
                            <div
                                // Kích thước card (giữ nguyên hoặc điều chỉnh nếu cần)
                                // Bỏ flex-shrink-0 vì Swiper quản lý
                                className="relative w-full h-full aspect-square rounded-md overflow-hidden group cursor-pointer shadow-sm hover:shadow-lg transition-shadow duration-300" // Dùng aspect-square để giữ tỷ lệ vuông
                                onClick={() => handleCategoryClick(category.id)}
                            >
                                {/* Ảnh nền */}
                                <img
                                    src={FileUploadService.getImageUrl(category.image, "categories")}                                    alt={category.name}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                                />
                                {/* Lớp phủ tối */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-opacity duration-300 group-hover:from-black/70"></div>
                                {/* Tên Category */}
                                <p className="absolute bottom-3 left-3 right-3 text-white text-base font-serif text-center group-hover:text-gray-100 transition-colors duration-300 line-clamp-2">
                                    {category.name}
                                </p>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
                 
            </div>
        </div>
    );
}