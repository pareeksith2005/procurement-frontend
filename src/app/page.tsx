"use client";
import React, { useEffect, useState } from 'react';
import { API } from '@/lib/api';

interface Analytics {
  totalMaterials: number; totalSuppliers: number; totalMappings: number;
  totalOrders: number; pendingOrders: number; deliveredOrders: number;
  inventoryValue: number; monthlyProcurement: number;
}
interface Order {
  id: string; orderId: string; supplierName: string; items: string;
  totalAmount: number; status: string; createdAt: string;
}

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  APPROVED: 'bg-blue-100 text-blue-700',
  PROCESSING: 'bg-indigo-100 text-indigo-700',
  SHIPPED: 'bg-purple-100 text-purple-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

export default function Dashboard() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API}/analytics`).then(r => r.json()),
      fetch(`${API}/orders`).then(r => r.json()),
    ]).then(([a, o]) => {
      setAnalytics(a);
      setOrders(Array.isArray(o) ? o : []);
    }).catch(() => {
      setAnalytics({ totalMaterials: 8, totalSuppliers: 5, totalMappings: 5, totalOrders: 6, pendingOrders: 1, deliveredOrders: 1, inventoryValue: 137080, monthlyProcurement: 47675 });
      setOrders([]);
    }).finally(() => setLoading(false));
  }, []);

  const stats = analytics ? [
    { title: 'Total Materials',   value: analytics.totalMaterials.toLocaleString(),        icon: '📦', color: 'from-blue-500 to-blue-600' },
    { title: 'Active Suppliers',  value: analytics.totalSuppliers.toLocaleString(),         icon: '🏢', color: 'from-green-500 to-green-600' },
    { title: 'Pending Orders',    value: analytics.pendingOrders.toLocaleString(),          icon: '⏳', color: 'from-orange-500 to-orange-600' },
    { title: 'Delivered Orders',  value: analytics.deliveredOrders.toLocaleString(),        icon: '✅', color: 'from-emerald-500 to-emerald-600' },
    { title: 'Inventory Value',   value: `₹${analytics.inventoryValue.toLocaleString()}`,  icon: '💰', color: 'from-purple-500 to-purple-600' },
    { title: 'Supplier Mappings', value: analytics.totalMappings.toLocaleString(),          icon: '🔗', color: 'from-cyan-500 to-cyan-600' },
    { title: 'Total Orders',      value: analytics.totalOrders.toLocaleString(),            icon: '🛒', color: 'from-rose-500 to-rose-600' },
    { title: 'Monthly Spend',     value: `₹${analytics.monthlyProcurement.toLocaleString()}`, icon: '📈', color: 'from-amber-500 to-amber-600' },
  ] : [];

  if (loading) return (
    <div className="space-y-6 animate-pulse">
      <div className="h-48 bg-gray-200 rounded-2xl"></div>
      <div className="grid grid-cols-4 gap-6">{[1,2,3,4].map(i => <div key={i} className="h-28 bg-gray-200 rounded-xl"></div>)}</div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div 
        className="rounded-2xl p-8 text-white shadow-xl relative overflow-hidden min-h-[220px] flex items-center bg-cover bg-center"
        style={{ backgroundImage: 'url(/bg-warehouse.png)' }}
      >
        <div className="absolute inset-0 bg-[#081B3A]/70 backdrop-blur-[2px]"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#081B3A] via-[#081B3A]/90 to-transparent"></div>
        <div className="relative z-10 max-w-xl">
          <p className="text-blue-300 text-sm font-medium tracking-wider uppercase mb-2">AI Procurement Dashboard</p>
          <h2 className="text-3xl font-bold mb-3">Welcome Back, Admin 👋</h2>
          <p className="text-blue-200/80 leading-relaxed">
            You have <span className="text-yellow-300 font-semibold">{analytics?.pendingOrders || 0} pending orders</span> and{' '}
            <span className="text-red-300 font-semibold">{analytics?.totalMaterials || 0} materials</span> tracked.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="/orders" className="bg-white text-[#081B3A] px-5 py-2.5 rounded-lg font-semibold text-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5">View Pending Orders</a>
            <a href="/ai-assistant" className="bg-gradient-to-r from-[#2563EB] to-[#38BDF8] text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 shadow-blue-500/30 shadow-md">🤖 AI Assistant</a>
          </div>
        </div>
        <div className="absolute right-10 top-1/2 -translate-y-1/2 opacity-10 hidden lg:flex gap-4">
          <div className="w-40 h-40 border-4 border-white rounded-full"></div>
          <div className="w-24 h-24 border-4 border-blue-400 rounded-full self-end"></div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-xl text-white shadow-md group-hover:scale-110 transition-transform`}>{stat.icon}</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{stat.title}</p>
              <h3 className="text-xl font-bold text-[#081B3A] mt-0.5">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex justify-between items-center p-6 pb-0">
            <h3 className="text-lg font-bold text-[#081B3A]">Recent Purchase Orders</h3>
            <a href="/orders" className="text-sm text-[#2563EB] font-medium hover:underline">View All →</a>
          </div>
          <div className="p-6 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs text-gray-400 uppercase tracking-wider border-b">
                  <th className="pb-3 font-medium">Order ID</th>
                  <th className="pb-3 font-medium">Supplier</th>
                  <th className="pb-3 font-medium">Items</th>
                  <th className="pb-3 font-medium">Amount</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {orders.slice(0, 5).map(order => (
                  <tr key={order.id} className="border-b last:border-0 hover:bg-gray-50/50 transition">
                    <td className="py-3.5 font-semibold text-[#2563EB]">{order.orderId}</td>
                    <td className="py-3.5 text-[#081B3A] font-medium">{order.supplierName}</td>
                    <td className="py-3.5 text-gray-500 text-xs max-w-[160px] truncate">{order.items}</td>
                    <td className="py-3.5 font-semibold text-[#081B3A]">₹{order.totalAmount.toLocaleString()}</td>
                    <td className="py-3.5"><span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>{order.status}</span></td>
                  </tr>
                ))}
                {orders.length === 0 && <tr><td colSpan={5} className="py-8 text-center text-gray-400">Backend connecting... data will appear shortly.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-[#081B3A] mb-5">Quick Actions</h3>
          <div className="space-y-2.5">
            {[
              { label: 'Add New Material',        icon: '➕', href: '/materials',    bg: 'bg-blue-50 hover:bg-blue-100 text-[#2563EB] border-blue-200' },
              { label: 'Create Purchase Order',   icon: '📄', href: '/orders',       bg: 'bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200' },
              { label: 'Add Supplier',             icon: '🏢', href: '/suppliers',    bg: 'bg-green-50 hover:bg-green-100 text-green-700 border-green-200' },
              { label: 'Map Supplier & Material',  icon: '🔗', href: '/mapping',      bg: 'bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200' },
              { label: 'Generate Report',          icon: '📊', href: '/reports',      bg: 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200' },
              { label: 'AI Procurement Assistant', icon: '🤖', href: '/ai-assistant', bg: 'bg-cyan-50 hover:bg-cyan-100 text-cyan-700 border-cyan-200' },
            ].map((action, i) => (
              <a key={i} href={action.href} className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm ${action.bg}`}>
                <span className="font-medium text-sm">{action.label}</span>
                <span className="text-lg">{action.icon}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
