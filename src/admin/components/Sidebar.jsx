import React from 'react';
import { NavLink } from 'react-router-dom'; 
// 1. Import thêm icon Users
import { 
    LayoutDashboard, 
    ShoppingCart, 
    Tags, 
    Users,
    Image,         // Icon cho Banners
    List,          // Icon cho Menus
    FileText,      // Icon cho Posts
    Package        // Icon cho Orders
} from 'lucide-react';
export default function Sidebar() {
  // 2. Thêm mục Users vào menuItems
  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Products', path: '/admin/products', icon: <ShoppingCart size={20} /> },
    { name: 'Categories', path: '/admin/categories', icon: <Tags size={20} /> },
    { name: 'Users', path: '/admin/users', icon: <Users size={20} /> },
    { name: 'Banners', path: '/admin/banners', icon: <Image size={20} /> },
    { name: 'Menus', path: '/admin/menus', icon: <List size={20} /> },
    { name: 'Posts', path: '/admin/posts', icon: <FileText size={20} /> },
    { name: 'Orders', path: '/admin/orders', icon: <Package size={20} /> },

  ];

  // (Phần style giữ nguyên)
  const linkStyle = "flex items-center gap-3 rounded-md py-3 px-4 text-base font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-100";
  const activeLinkStyle = "bg-blue-100 text-blue-600";

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-72 flex-col overflow-y-auto border-r border-gray-200 bg-white shadow-lg">
      
      {/* Khu vực Logo (giữ nguyên) */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-200">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
          A
        </div>
        <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
      </div>

      {/* Khu vực điều hướng (giữ nguyên) */}
      <nav className="flex flex-col gap-y-2 px-4 py-4">
        <h3 className="mb-2 ml-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">
          MENU
        </h3>

        {/* Danh sách các link (sẽ tự động thêm Users) */}
        <ul className="flex flex-col gap-y-1">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  isActive ? `${linkStyle} ${activeLinkStyle}` : linkStyle
                }
              >
                {item.icon}
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

    </aside>
  );
}