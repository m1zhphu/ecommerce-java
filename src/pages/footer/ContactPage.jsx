// src/pages/ContactPage.jsx

import React from 'react';
import { useForm, ValidationError } from '@formspree/react';
import { MapPin, Phone, Mail, Send, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

function ContactForm() {
    const [state, handleSubmit] = useForm("xnnokvrk"); // ID Formspree của bạn

    if (state.succeeded) {
        return (
            <div className="text-center p-10 bg-green-50 rounded-lg shadow-inner">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">Cảm ơn bạn!</h3>
                <p className="text-gray-600">Chúng tôi đã nhận được tin nhắn của bạn và sẽ phản hồi sớm nhất có thể.</p>
                <Link
                    to="/"
                    className="mt-6 inline-block bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                >
                    Về trang chủ
                </Link>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Tên */}
            <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Tên của bạn
                </label>
                <input
                    id="name"
                    type="text"
                    name="name"
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500 transition"
                    required
                />
                <ValidationError
                    prefix="Name"
                    field="name"
                    errors={state.errors}
                    className="text-red-500 text-sm mt-1"
                />
            </div>

            {/* Email */}
            <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                </label>
                <input
                    id="email"
                    type="email"
                    name="email"
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500 transition"
                    required
                />
                <ValidationError
                    prefix="Email"
                    field="email"
                    errors={state.errors}
                    className="text-red-500 text-sm mt-1"
                />
            </div>

            {/* Lời nhắn */}
            <div>
                <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                    Lời nhắn
                </label>
                <textarea
                    id="message"
                    name="message"
                    rows="5"
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500 transition"
                    required
                />
                <ValidationError
                    prefix="Message"
                    field="message"
                    errors={state.errors}
                    className="text-red-500 text-sm mt-1"
                />
            </div>

            {/* Nút Gửi */}
            <div>
                <button
                    type="submit"
                    disabled={state.submitting}
                    className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white text-sm font-semibold py-3 px-8 rounded-lg transition duration-300 disabled:opacity-70"
                >
                    <Send size={18} />
                    {state.submitting ? 'Đang gửi...' : 'Gửi tin nhắn'}
                </button>
            </div>
        </form>
    );
}

export default function ContactPage() {
    return (
        <div className="bg-white pt-32 pb-16"> {/* Thêm padding-top để không bị Header che */}
            <div className="container mx-auto px-4 lg:px-6">

                {/* Tiêu đề trang */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900">
                        Liên hệ với chúng tôi
                    </h1>
                    <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
                        Chúng tôi luôn sẵn lòng lắng nghe bạn. Hãy để lại lời nhắn hoặc ghé thăm chúng tôi!
                    </p>
                </div>

                {/* Lưới 2 cột: Info và Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">

                    {/* Cột 1: Thông tin và Bản đồ */}
                    <div className="space-y-8">
                        {/* Thông tin liên hệ */}
                        <div className="bg-gray-50 p-8 rounded-lg shadow-lg space-y-6">
                            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Thông tin liên hệ</h3>
                            <div className="flex items-start gap-4">
                                <MapPin className="w-6 h-6 text-blue-600 mt-1" />
                                <div>
                                    <h4 className="font-semibold text-gray-700">Địa chỉ</h4>
                                    {/* --- THAY ĐỔI ĐỊA CHỈ --- */}
                                    <p className="text-gray-600">28/15 Đường 45, Hiệp Bình Chánh, Thủ Đức, TP. Hồ Chí Minh</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <Phone className="w-6 h-6 text-blue-600 mt-1" />
                                <div>
                                    <h4 className="font-semibold text-gray-700">Điện thoại</h4>
                                    <a href="tel:0325479684" className="text-gray-600 hover:text-blue-600">0325.479.684</a>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <Mail className="w-6 h-6 text-blue-600 mt-1" />
                                <div>
                                    <h4 className="font-semibold text-gray-700">Email</h4>
                                    <a href="mailto:minhphu25102005@gmail.com" className="text-gray-600 hover:text-blue-600">minhphu25102005@gmail.com</a>
                                </div>
                            </div>
                        </div>

                        {/* --- THAY ĐỔI BẢN ĐỒ --- */}
                        <div className="rounded-lg overflow-hidden shadow-lg">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.858319690184!2d106.7027339750428!3d10.822033089322832!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3175288a38b19e07%3A0x83c4b0754145f096!2zR2lnYW1hbGwgVGjhu6cgxJDhu6lj!5e0!3m2!1svi!2s!4v1730706132474!5m2!1svi!2s"
                                width="100%"
                                height="400"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Bản đồ GigaMall Thủ Đức"
                            ></iframe>
                        </div>
                    </div>

                    {/* Cột 2: Form liên hệ (Giữ nguyên) */}
                    <div className="bg-gray-50 p-8 rounded-lg shadow-lg">
                        <h3 className="text-2xl font-semibold text-gray-800 mb-6">Gửi tin nhắn cho chúng tôi</h3>
                        <ContactForm />
                    </div>

                </div>
            </div>
        </div>
    );
}