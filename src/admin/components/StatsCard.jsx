//Trang 
import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function StatsCard({ title, value, percentage, icon, iconBgColor }) {
  const isPositive = percentage >= 0;

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg flex items-center gap-5">
      <div className={`rounded-full p-4 ${iconBgColor}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <div className="flex items-end gap-3">
          <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
          <div className={`flex items-center text-sm font-semibold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
            <span>{Math.abs(percentage)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}