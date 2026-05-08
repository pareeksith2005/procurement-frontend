"use client";
import React, { useEffect, useState } from 'react';
import { API } from '@/lib/api';

export default function ReportsPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [materials, setMaterials] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API}/analytics`).then(r => r.json()),
      fetch(`${API}/materials`).then(r => r.json()),
      fetch(`${API}/orders`).then(r => r.json()),
    ]).then(([a, m, o]) => {
      setAnalytics(a); setMaterials(Array.isArray(m) ? m : []); setOrders(Array.isArray(o) ? o : []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const topMaterials = [...materials].sort((a, b) => b.unitPrice * b.quantity - a.unitPrice * a.quantity).slice(0, 5);
  const ordersByStatus = orders.reduce((acc: Record<string, number>, o) => { acc[o.status] = (acc[o.status] || 0) + 1; return acc; }, {});
  const statusColors: Record<string, string> = { PENDING: 'bg-yellow-400', APPROVED: 'bg-blue-400', PROCESSING: 'bg-indigo-400', SHIPPED: 'bg-purple-400', DELIVERED: 'bg-green-400', CANCELLED: 'bg-red-400' };

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400">Loading reports...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#081B3A]">Reports & Analytics</h1>
        <p className="text-gray-500 text-sm mt-1">Procurement insights and performance overview</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: 'Total Materials', value: analytics?.totalMaterials || 0, icon: '📦', color: 'from-blue-500 to-blue-600' },
          { label: 'Total Suppliers', value: analytics?.totalSuppliers || 0, icon: '🏢', color: 'from-green-500 to-green-600' },
          { label: 'Total Orders', value: analytics?.totalOrders || 0, icon: '🛒', color: 'from-orange-500 to-orange-600' },
          { label: 'Total Spend', value: `₹${(analytics?.monthlyProcurement || 0).toLocaleString()}`, icon: '💰', color: 'from-purple-500 to-purple-600' },
        ].map((s, i) => (
          <div key={i} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-xl text-white shadow-md`}>{s.icon}</div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-medium">{s.label}</p>
              <p className="text-xl font-bold text-[#081B3A]">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders by Status */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-[#081B3A] mb-4">Orders by Status</h3>
          <div className="space-y-3">
            {Object.entries(ordersByStatus).map(([status, count]) => {
              const pct = orders.length > 0 ? Math.round(((count as number) / orders.length) * 100) : 0;
              return (
                <div key={status}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{status}</span>
                    <span className="text-gray-500">{count as number} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className={`${statusColors[status] || 'bg-gray-400'} h-2 rounded-full transition-all duration-500`} style={{ width: `${pct}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Materials by Value */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-[#081B3A] mb-4">Top Materials by Inventory Value</h3>
          <div className="space-y-3">
            {topMaterials.map((m, i) => {
              const val = m.unitPrice * m.quantity;
              const maxVal = topMaterials[0] ? topMaterials[0].unitPrice * topMaterials[0].quantity : 1;
              const pct = Math.round((val / maxVal) * 100);
              return (
                <div key={m.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700 truncate max-w-[200px]">{i + 1}. {m.name}</span>
                    <span className="text-gray-500 ml-2">₹{val.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-gradient-to-r from-[#2563EB] to-[#38BDF8] h-2 rounded-full transition-all duration-500" style={{ width: `${pct}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stock Distribution */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-[#081B3A] mb-4">Stock Distribution</h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'In Stock', count: materials.filter(m => m.status === 'IN_STOCK').length, color: 'bg-green-500', textColor: 'text-green-700', bgLight: 'bg-green-50' },
            { label: 'Low Stock', count: materials.filter(m => m.status === 'LOW_STOCK').length, color: 'bg-yellow-500', textColor: 'text-yellow-700', bgLight: 'bg-yellow-50' },
            { label: 'Out of Stock', count: materials.filter(m => m.status === 'OUT_OF_STOCK').length, color: 'bg-red-500', textColor: 'text-red-700', bgLight: 'bg-red-50' },
          ].map(s => (
            <div key={s.label} className={`${s.bgLight} rounded-xl p-5 text-center`}>
              <div className={`text-3xl font-bold ${s.textColor}`}>{s.count}</div>
              <div className="text-sm text-gray-600 mt-1">{s.label}</div>
              <div className={`${s.color} h-1 rounded-full mt-3 mx-auto`} style={{ width: `${materials.length > 0 ? (s.count / materials.length) * 100 : 0}%` }}></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
