// src/components/ScrollToTop.jsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Tự động cuộn lên đầu trang (0, 0)
    // mỗi khi 'pathname' (đường dẫn URL) thay đổi
    window.scrollTo(0, 0);
  }, [pathname]);

  return null; // Component này không render ra bất cứ thứ gì
}

export default ScrollToTop;