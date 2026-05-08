"use client";
import React, { useEffect, useState } from 'react';
import { API } from '@/lib/api';

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

const STATUSES = ['PENDING','APPROVED','PROCESSING','SHIPPED','DELIVERED','CANCELLED'];
const emptyForm = { supplierName: '', items: '', totalAmount: '' };

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [filter, setFilter] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchOrders = () => {
    setLoading(true);
    fetch(`${API}/orders${filter ? `?status=${filter}` : ''}`)
      .then(r => r.json()).then(d => setOrders(Array.isArray(d) ? d : []))
      .catch(() => setOrders([])).finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, [filter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    const body = { ...form, totalAmount: parseFloat(form.totalAmount) };
    await fetch(`${API}/orders`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    setShowForm(false); setForm(emptyForm); setSaving(false); fetchOrders();
  };

  const handleStatusChange = async (id: string, status: string) => {
    await fetch(`${API}/orders/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
    fetchOrders();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this order?')) return;
    await fetch(`${API}/orders/${id}`, { method: 'DELETE' });
    fetchOrders();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#081B3A]">Purchase Orders</h1>
          <p className="text-gray-500 text-sm mt-1">Manage and track all procurement orders</p>
        </div>
        <button onClick={() => setShowForm(true)} className="bg-[#2563EB] text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-blue-700 transition-all hover:shadow-lg hover:-translate-y-0.5">
          + Create Order
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {['', ...STATUSES].map(s => (
          <button key={s} onClick={() => setFilter(s)} className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${filter === s ? 'bg-[#2563EB] text-white border-[#2563EB]' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}>
            {s || 'All Orders'}
          </button>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-[#081B3A] mb-5">Create Purchase Order</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { label: 'Supplier Name', key: 'supplierName', type: 'text', required: true },
                { label: 'Items (description)', key: 'items', type: 'text', required: true },
                { label: 'Total Amount (₹)', key: 'totalAmount', type: 'number', required: true },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                  <input type={f.type} required={f.required} value={(form as any)[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB]" />
                </div>
              ))}
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="flex-1 bg-[#2563EB] text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-blue-700 transition disabled:opacity-60">
                  {saving ? 'Creating...' : 'Create Order'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-lg font-semibold text-sm hover:bg-gray-50 transition">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading orders...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr className="text-xs text-gray-500 uppercase tracking-wider">
                  {['Order ID', 'Supplier', 'Items', 'Total Amount', 'Status', 'Date', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-3.5 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-50">
                {orders.map(o => (
                  <tr key={o.id} className="hover:bg-gray-50/50 transition">
                    <td className="px-5 py-4 font-semibold text-[#2563EB]">{o.orderId}</td>
                    <td className="px-5 py-4 font-medium text-[#081B3A]">{o.supplierName}</td>
                    <td className="px-5 py-4 text-gray-500 text-xs max-w-[180px] truncate">{o.items}</td>
                    <td className="px-5 py-4 font-semibold">₹{o.totalAmount.toLocaleString()}</td>
                    <td className="px-5 py-4">
                      <select value={o.status} onChange={e => handleStatusChange(o.id, e.target.value)} className={`px-2.5 py-1 rounded-full text-xs font-semibold border-0 cursor-pointer ${statusColors[o.status] || 'bg-gray-100 text-gray-600'}`}>
                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="px-5 py-4 text-gray-400 text-xs">{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-4">
                      <button onClick={() => handleDelete(o.id)} className="text-red-500 text-xs font-medium px-3 py-1 border border-red-200 rounded-lg hover:bg-red-50 transition">Delete</button>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && <tr><td colSpan={7} className="px-5 py-10 text-center text-gray-400">No orders found.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
