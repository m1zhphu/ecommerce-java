// src/pages/AboutPage.jsx

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Target, Eye, Star, ArrowRight } from 'lucide-react';

// (Bạn có thể thay thế các link ảnh placeholder này bằng ảnh thật của shop)
const heroImage = "https://images.unsplash.com/photo-1551803223-F3f38018d361?q=80&w=1887&auto=format&fit=crop";
const missionImage = "https://images.unsplash.com/photo-1523381294911-8d3cead13475?q=80&w=2070&auto=format&fit=crop";

export default function AboutPage() {
    
    // Tự động cuộn lên đầu trang
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-white">
            {/* --- 1. Hero Section (Phần đầu trang) --- */}
            {/* Thêm pt-24 để không bị header che */}
            <div className="relative bg-gray-900 pt-24 sm:pt-32">
                <div className="absolute inset-0">
                    <img
                        src={heroImage}
                        alt="Không gian cửa hàng Minh Phu Shop"
                        className="w-full h-full object-cover opacity-30"
                    />
                </div>
                <div className="relative container mx-auto px-4 lg:px-6 py-24 sm:py-32 text-center">
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-white">
                        Về Minh Phu Shop
                    </h1>
                    <p className="mt-6 text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
                        Câu chuyện đằng sau phong cách của bạn.
                    </p>
                </div>
            </div>

            {/* --- 2. Sứ mệnh (Our Mission) --- */}
            <div className="py-16 md:py-24">
                <div className="container mx-auto px-4 lg:px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">
                        {/* Cột hình ảnh */}
                        <div className="rounded-lg overflow-hidden shadow-xl">
                            <img
                                src={missionImage}
                                alt="Quần áo được treo trên giá"
                                className="w-full h-full object-cover aspect-[4/3]"
                            />
                        </div>
                        {/* Cột nội dung */}
                        <div className="max-w-xl">
                            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-6">
                                Sứ mệnh của chúng tôi
                            </h2>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                Tại Minh Phu Shop, chúng tôi tin rằng thời trang không chỉ là quần áo. 
                                Đó là cách bạn thể hiện con người mình với thế giới.
                            </p>
                            <p className="text-gray-600 leading-relaxed mb-6">
                                Sứ mệnh của chúng tôi là mang đến những bộ sưu tập được tuyển chọn kỹ lưỡng, 
                                kết hợp giữa xu hướng hiện đại và chất lượng bền bỉ, giúp bạn tự tin
                                thể hiện phong cách cá nhân độc đáo mỗi ngày.
                            </p>
                            <Link 
                                to="/products" 
                                className="inline-flex items-center gap-2 bg-gray-900 text-white font-semibold py-3 px-6 rounded-lg hover:bg-black transition-colors"
                            >
                                Khám phá Bộ sưu tập
                                <ArrowRight size={18} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- 3. Cam kết (Our Values) --- */}
            <div className="bg-gray-50 py-16 md:py-24">
                <div className="container mx-auto px-4 lg:px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">
                            Cam kết của chúng tôi
                        </h2>
                        <p className="text-lg text-gray-600 mt-4">
                            Chúng tôi tập trung vào 3 giá trị cốt lõi để phục vụ bạn tốt nhất.
                        </p>
                    </div>
                    
                    {/* Lưới 3 cột giá trị */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {/* Giá trị 1 */}
                        <div className="text-center p-6">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-4">
                                <Star size={32} />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Chất lượng hàng đầu</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Từng sản phẩm đều được kiểm tra kỹ lưỡng từ chất liệu vải, 
                                đường may cho đến độ bền, đảm bảo bạn nhận được giá trị tốt nhất.
                            </p>
                        </div>
                        {/* Giá trị 2 */}
                        <div className="text-center p-6">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-4">
                                <Eye size={32} />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Cập nhật xu hướng</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Đội ngũ của chúng tôi liên tục nghiên cứu và cập nhật 
                                các xu hướng thời trang mới nhất từ khắp nơi trên thế giới.
                            </p>
                        </div>
                        {/* Giá trị 3 */}
                        <div className="text-center p-6">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-4">
                                <Target size={32} />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Trải nghiệm khách hàng</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Từ giao diện website đến dịch vụ chăm sóc sau mua hàng, 
                                chúng tôi cam kết mang lại trải nghiệm mua sắm mượt mà và hài lòng.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}