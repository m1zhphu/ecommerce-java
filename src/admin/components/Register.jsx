import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// === CSS STYLES (Giữ nguyên thiết kế) ===
// (Đây là CSS-in-JS, bạn chỉ cần copy/paste)
const RegisterStyles = () => (
    <style>
        {`
        .register-wrapper {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            padding: 2rem 0;
            background: linear-gradient(135deg, #ece9e6 0%, #ffffff 100%);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }
        .register-card {
            background: #ffffff;
            padding: 2.5rem 3rem;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
            width: 100%;
            max-width: 480px; /* Rộng hơn một chút cho nhiều trường hơn */
            box-sizing: border-box;
            text-align: center;
        }
        .register-icon {
            width: 60px;
            height: 60px;
            margin-bottom: 1rem;
            color: #007bff;
        }
        .register-card h2 {
            text-align: center;
            color: #222;
            font-weight: 700;
            font-size: 1.8rem;
            margin-top: 0;
            margin-bottom: 2rem;
        }
        .form-group {
            margin-bottom: 1rem; /* Giảm khoảng cách một chút */
            text-align: left;
        }
        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            color: #555;
            font-weight: 600;
            font-size: 0.9rem;
        }
        .password-input-wrapper {
            position: relative;
        }
        .form-group input {
            width: 100%;
            padding: 0.85rem 1rem;
            border: 1px solid #ddd;
            border-radius: 8px;
            box-sizing: border-box;
            font-size: 1rem;
            transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        input[type="password"], input[type="text"].password-field {
             padding-right: 3.5rem; 
        }
        .form-group input:focus {
            outline: none;
            border-color: #007bff;
            box-shadow: 0 0 0 3px rgba(0,123,255,0.1);
        }
        .password-toggle-btn {
            position: absolute;
            right: 1rem;
            top: 50%;
            transform: translateY(-50%);
            background: transparent;
            border: none;
            cursor: pointer;
            padding: 0;
            display: flex;
            align-items: center;
            color: #888;
        }
        .password-toggle-btn svg { width: 20px; height: 20px; }
        .password-toggle-btn:hover { color: #333; }

        .register-btn {
            width: 100%;
            padding: 0.9rem;
            border: none;
            border-radius: 8px;
            background-color: #28a745; /* Màu xanh lá cho Đăng ký */
            color: white;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: background-color 0.3s ease, transform 0.1s ease;
            margin-top: 1rem;
        }
        .register-btn:hover {
            background-color: #218838;
        }
        .register-btn:active { transform: scale(0.99); }
        .register-btn:disabled {
            background-color: #aaa;
            cursor: not-allowed;
        }
        .error-message {
            color: #d93025;
            background-color: #fbeae9;
            border: 1px solid #f5c6cb;
            padding: 0.8rem;
            border-radius: 8px;
            text-align: center;
            margin-bottom: 1.25rem;
            font-size: 0.9rem;
        }
        .login-link {
            margin-top: 1.5rem;
            text-align: center;
            color: #555;
            font-size: 0.9rem;
        }
        .login-link a {
            color: #007bff;
            text-decoration: none;
            font-weight: 600;
        }
        .login-link a:hover { text-decoration: underline; }
        `}
    </style>
);

// === ICON ===
const UserPlusIcon = () => (
    <svg className="register-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.5 21h-5.019A12.318 12.318 0 014 19.235z" />
    </svg>
);
const EyeIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> );
const EyeSlashedIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L12 12" /></svg> );
// === KẾT THÚC CSS & ICONS ===


export default function Register() {
    // State cho các trường
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    // State chức năng
    const [error, setError] = useState(''); 
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const navigate = useNavigate();

    // Hàm xử lý submit
    const handleSubmit = async (e) => {
        e.preventDefault(); 
        setLoading(true);
        setError('');

        // 1. Kiểm tra mật khẩu khớp
        if (password !== confirmPassword) {
            setError('Mật khẩu không khớp!');
            setLoading(false);
            return;
        }

        // 2. Tạo đối tượng JSON theo DTO 
        const registerData = {
            username,
            password,
            name,
            email,
            address,
            phoneNumber
        };

        try {
            // 3. Gọi API Đăng Ký 
            const response = await fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(registerData)
            });

            const data = await response.json();

            // 4. Bắt lỗi (ví dụ: "Username already exists")
            if (!response.ok) {
                throw new Error(data.message || 'Đăng ký thất bại.');
            }

            // 5. Đăng ký thành công, nhận token và tự động đăng nhập 
            if (data.token) {
                localStorage.setItem('adminToken', data.token);
                // Chuyển hướng đến dashboard
                navigate('/admin/dashboard'); 
            } else {
                throw new Error('Đăng ký thành công nhưng không nhận được token.');
            }

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false); 
        }
    };

    return (
        <>
            <RegisterStyles /> 
            <div className="register-wrapper">
                <div className="register-card">
                    
                    <UserPlusIcon />
                    <h2>Tạo Tài Khoản</h2>
                    
                    <form onSubmit={handleSubmit}>
                        
                        {error && <p className="error-message">{error}</p>}

                        {/* === CÁC TRƯỜNG MỚI === */}
                        <div className="form-group">
                            <label htmlFor="name">Họ và Tên</label>
                            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                        </div>
                        
                        {/* === MẬT KHẨU === */}
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <div className="password-input-wrapper">
                                <input
                                    type={showPassword ? "text" : "password"} 
                                    id="password"
                                    className="password-field" // Thêm class để CSS nhận diện
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button type="button" className="password-toggle-btn" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <EyeSlashedIcon /> : <EyeIcon />}
                                </button>
                            </div>
                        </div>

                        {/* === XÁC NHẬN MẬT KHẨU === */}
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Xác nhận Password</label>
                            <div className="password-input-wrapper">
                                <input
                                    type={showConfirmPassword ? "text" : "password"} 
                                    id="confirmPassword"
                                    className="password-field" // Thêm class
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                                <button type="button" className="password-toggle-btn" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                    {showConfirmPassword ? <EyeSlashedIcon /> : <EyeIcon />}
                                </button>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="address">Địa chỉ</label>
                            <input type="text" id="address" value={address} onChange={(e) => setAddress(e.target.value)} required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="phoneNumber">Số điện thoại</label>
                            <input type="tel" id="phoneNumber" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
                        </div>
                        
                        <button type="submit" className="register-btn" disabled={loading}>
                            {loading ? 'Đang tạo...' : 'Đăng Ký'}
                        </button>
                    </form>

                    {/* Link quay về Đăng nhập */}
                    <div className="login-link">
                        <p>Đã có tài khoản? <Link to="/admin/login">Đăng nhập ngay</Link></p>
                    </div>

                </div>
            </div>
        </>
    );
}