"use client";
import React, { useEffect, useState } from 'react';
import { API } from '@/lib/api';

interface Supplier {
  id: string; name: string; contactPerson: string; phone: string;
  email: string; address: string; gstNumber: string; rating: number; createdAt: string;
}

const emptyForm = { name: '', contactPerson: '', phone: '', email: '', address: '', gstNumber: '', rating: '0' };

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchSuppliers = () => {
    setLoading(true);
    fetch(`${API}/suppliers${search ? `?search=${search}` : ''}`)
      .then(r => r.json()).then(setSuppliers).catch(() => setSuppliers([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchSuppliers(); }, [search]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    const body = { ...form, rating: parseFloat(form.rating) };
    const url = editId ? `${API}/suppliers/${editId}` : `${API}/suppliers`;
    const method = editId ? 'PUT' : 'POST';
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    setShowForm(false); setForm(emptyForm); setEditId(null); setSaving(false); fetchSuppliers();
  };

  const handleEdit = (s: Supplier) => {
    setForm({ name: s.name, contactPerson: s.contactPerson, phone: s.phone, email: s.email, address: s.address, gstNumber: s.gstNumber, rating: String(s.rating) });
    setEditId(s.id); setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this supplier?')) return;
    await fetch(`${API}/suppliers/${id}`, { method: 'DELETE' });
    fetchSuppliers();
  };

  const renderStars = (rating: number) => '⭐'.repeat(Math.round(rating));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#081B3A]">Suppliers</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your vendor and supplier network</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditId(null); setForm(emptyForm); }} className="bg-[#2563EB] text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-blue-700 transition-all hover:shadow-lg hover:-translate-y-0.5">
          + Add Supplier
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search suppliers by name..." className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB]" />
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-[#081B3A] mb-5">{editId ? 'Edit Supplier' : 'Add New Supplier'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { label: 'Supplier Name', key: 'name', required: true },
                { label: 'Contact Person', key: 'contactPerson', required: true },
                { label: 'Phone Number', key: 'phone', required: true },
                { label: 'Email Address', key: 'email', required: true },
                { label: 'Address', key: 'address', required: true },
                { label: 'GST Number', key: 'gstNumber', required: true },
                { label: 'Rating (0-5)', key: 'rating', required: false },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                  <input type={f.key === 'rating' ? 'number' : 'text'} required={f.required} min={0} max={5} step={0.1} value={(form as any)[f.key]}
                    onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB]" />
                </div>
              ))}
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="flex-1 bg-[#2563EB] text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-blue-700 transition disabled:opacity-60">
                  {saving ? 'Saving...' : editId ? 'Update Supplier' : 'Add Supplier'}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setEditId(null); }} className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-lg font-semibold text-sm hover:bg-gray-50 transition">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {loading ? (
          [1,2,3].map(i => <div key={i} className="h-44 bg-gray-100 rounded-xl animate-pulse"></div>)
        ) : suppliers.length === 0 ? (
          <div className="col-span-3 text-center py-16 text-gray-400">No suppliers found. Click "Add Supplier" to get started.</div>
        ) : suppliers.map(s => (
          <div key={s.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all hover:-translate-y-0.5">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                {s.name.charAt(0)}
              </div>
              <span className="text-xs text-gray-400">{renderStars(s.rating)} {s.rating}/5</span>
            </div>
            <h3 className="font-bold text-[#081B3A] text-base mb-1">{s.name}</h3>
            <p className="text-sm text-gray-500 mb-3">👤 {s.contactPerson}</p>
            <div className="space-y-1.5 text-xs text-gray-500">
              <p>📞 {s.phone}</p>
              <p>✉️ {s.email}</p>
              <p>📍 {s.address}</p>
              <p>🏛️ GST: {s.gstNumber}</p>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => handleEdit(s)} className="flex-1 text-[#2563EB] text-xs font-medium py-1.5 border border-blue-200 rounded-lg hover:bg-blue-50 transition">Edit</button>
              <button onClick={() => handleDelete(s.id)} className="flex-1 text-red-500 text-xs font-medium py-1.5 border border-red-200 rounded-lg hover:bg-red-50 transition">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
