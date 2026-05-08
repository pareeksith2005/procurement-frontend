"use client";
import React, { useEffect, useState } from 'react';
import { API } from '@/lib/api';

interface Material {
  id: string; materialId: string; name: string; category: string;
  unitPrice: number; quantity: number; unitType: string; status: string;
}

const statusColors: Record<string, string> = {
  IN_STOCK: 'bg-green-100 text-green-700',
  LOW_STOCK: 'bg-yellow-100 text-yellow-700',
  OUT_OF_STOCK: 'bg-red-100 text-red-700',
};

export default function InventoryPage() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    setLoading(true);
    fetch(`${API}/materials${filter ? `?status=${filter}` : ''}`)
      .then(r => r.json()).then(d => setMaterials(Array.isArray(d) ? d : []))
      .catch(() => setMaterials([])).finally(() => setLoading(false));
  }, [filter]);

  const inStock = materials.filter(m => m.status === 'IN_STOCK').length;
  const lowStock = materials.filter(m => m.status === 'LOW_STOCK').length;
  const outOfStock = materials.filter(m => m.status === 'OUT_OF_STOCK').length;
  const totalValue = materials.reduce((s, m) => s + m.unitPrice * m.quantity, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#081B3A]">Inventory</h1>
        <p className="text-gray-500 text-sm mt-1">Real-time stock monitoring and alerts</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: 'In Stock',      value: inStock,    icon: '✅', color: 'from-green-500 to-emerald-600' },
          { label: 'Low Stock',     value: lowStock,   icon: '⚠️', color: 'from-yellow-500 to-orange-500' },
          { label: 'Out of Stock',  value: outOfStock, icon: '❌', color: 'from-red-500 to-rose-600' },
          { label: 'Total Value',   value: `₹${Math.round(totalValue).toLocaleString()}`, icon: '💰', color: 'from-purple-500 to-violet-600' },
        ].map((s, i) => (
          <div key={i} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-all hover:-translate-y-0.5">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-xl shadow-md`}>{s.icon}</div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">{s.label}</p>
              <p className="text-xl font-bold text-[#081B3A]">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 flex-wrap">
        {[{ label: 'All', value: '' }, { label: 'In Stock', value: 'IN_STOCK' }, { label: 'Low Stock', value: 'LOW_STOCK' }, { label: 'Out of Stock', value: 'OUT_OF_STOCK' }].map(f => (
          <button key={f.value} onClick={() => setFilter(f.value)} className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${filter === f.value ? 'bg-[#2563EB] text-white border-[#2563EB]' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}>
            {f.label}
          </button>
        ))}
      </div>

      {lowStock > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center gap-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <p className="font-semibold text-yellow-800">Low Stock Alert</p>
            <p className="text-yellow-700 text-sm">{lowStock} material(s) are running low. Consider creating a purchase order.</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading inventory...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr className="text-xs text-gray-500 uppercase tracking-wider">
                  {['Material ID', 'Name', 'Category', 'Quantity', 'Unit', 'Unit Price', 'Total Value', 'Status'].map(h => (
                    <th key={h} className="px-5 py-3.5 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-50">
                {materials.map(m => (
                  <tr key={m.id} className="hover:bg-gray-50/50 transition">
                    <td className="px-5 py-4 font-semibold text-[#2563EB]">{m.materialId}</td>
                    <td className="px-5 py-4 font-medium text-[#081B3A]">{m.name}</td>
                    <td className="px-5 py-4 text-gray-500">{m.category}</td>
                    <td className="px-5 py-4 font-bold">{m.quantity.toLocaleString()}</td>
                    <td className="px-5 py-4 text-gray-500">{m.unitType}</td>
                    <td className="px-5 py-4">₹{m.unitPrice.toLocaleString()}</td>
                    <td className="px-5 py-4 font-semibold">₹{(m.unitPrice * m.quantity).toLocaleString()}</td>
                    <td className="px-5 py-4"><span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[m.status] || 'bg-gray-100 text-gray-600'}`}>{m.status.replace(/_/g, ' ')}</span></td>
                  </tr>
                ))}
                {materials.length === 0 && <tr><td colSpan={8} className="px-5 py-10 text-center text-gray-400">No inventory data found.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
