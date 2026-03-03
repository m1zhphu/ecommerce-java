// src/components/Banner.jsx
import React, { useState, useEffect } from 'react';
import BannerService from '../api/BannerService';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';

import FileUploadService from '../api/FileUploadService';
//const IMAGE_BANNER_URL = "http://localhost:8080/uploads/images/banners/";

export default function Banner() {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        BannerService.getAll()
            .then(response => {
                const bannerData = response.data?._embedded?.bannerDtoList ?? response.data ?? [];
                setBanners(bannerData.filter(b => b.status === true));
            })
            .catch(error => {
                console.error("Lỗi khi tải banner!", error);
                setBanners([]);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    // Placeholder khi đang tải
    if (loading) {
        return (
            // Chiếm gần hết màn hình
            <div className="w-full h-[80vh] md:h-[90vh] bg-gray-200 animate-pulse"></div>
        );
    }

    if (banners.length === 0) {
        return null; // Hoặc hiển thị placeholder mặc định
    }

    return (
        // Banner nằm trong luồng bình thường, không absolute
        <div className="w-full relative"> {/* Relative để chứa nút/chấm */}
            <Swiper
                modules={[Pagination, Navigation, Autoplay]}
                pagination={{
                    clickable: true,
                    bulletClass: 'swiper-pagination-bullet bg-gray-400 opacity-50',
                    bulletActiveClass: 'swiper-pagination-bullet-active bg-white opacity-100',
                }}
                navigation={true}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                }}
                loop={banners.length > 1}
                className="mySwiper w-full h-[80vh] md:h-[90vh]" // Chiều cao banner
            >
                {banners.map(banner => (
                    <SwiperSlide key={banner.id}>
                        <a href={banner.linkUrl || '#'} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                            <img
                                src={FileUploadService.getImageUrl(banner.imageUrl, "banners")}
                                alt={banner.name || "Banner"}
                                className="w-full h-full object-cover" // Ảnh cover
                            />
                        </a>
                    </SwiperSlide>
                ))}
            </Swiper>

        </div>
    );
}