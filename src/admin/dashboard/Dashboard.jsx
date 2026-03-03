import React, { useEffect, useState } from "react";
import ProductService from "../../api/ProductService";
import CategoryService from "../../api/CategoryService";
import { ShoppingCart, Box, Users, DollarSign } from "lucide-react";

// Import các component mới
import StatsCard from "../components/StatsCard";
import BarChart from "../components/BarChart";
import LineChart from "../components/LineChart";

export default function Dashboard() {
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
            ProductService.getAll(),
            CategoryService.getAll()
        ]);
        setTotalProducts(productsRes.data.length);
        setTotalCategories(categoriesRes.data.length);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Tổng quan</h1>

      {/* Khu vực Stats Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatsCard
          title="Tổng sản phẩm"
          value={loading ? '...' : totalProducts}
          percentage={12.5} // Dữ liệu giả
          icon={<ShoppingCart size={24} className="text-white" />}
          iconBgColor="bg-blue-500"
        />
        <StatsCard
          title="Tổng danh mục"
          value={loading ? '...' : totalCategories}
          percentage={5.2} // Dữ liệu giả
          icon={<Box size={24} className="text-white" />}
          iconBgColor="bg-green-500"
        />
        <StatsCard
          title="Tổng khách hàng"
          value={loading ? '...' : '1,250'} // Dữ liệu giả
          percentage={-2.1} // Dữ liệu giả
          icon={<Users size={24} className="text-white" />}
          iconBgColor="bg-yellow-500"
        />
        <StatsCard
          title="Doanh thu tháng"
          value={loading ? '...' : '150M'} // Dữ liệu giả
          percentage={20.8} // Dữ liệu giả
          icon={<DollarSign size={24} className="text-white" />}
          iconBgColor="bg-indigo-500"
        />
      </div>

      {/* Khu vực Biểu đồ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Biểu đồ cột chiếm 2 phần */}
        <div className="lg:col-span-2">
            <BarChart />
        </div>
        {/* Biểu đồ đường chiếm 1 phần */}
        <div className="lg:col-span-3">
            <LineChart />
        </div>
      </div>
    </>
  );
}