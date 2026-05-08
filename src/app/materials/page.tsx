"use client";
import React, { useEffect, useState } from 'react';
import { API } from '@/lib/api';

interface Material {
  id: string; materialId: string; name: string; category: string;
  unitPrice: number; quantity: number; unitType: string;
  description?: string; vendorAvail: boolean; status: string; createdAt: string;
}

const statusColors: Record<string, string> = {
  IN_STOCK: 'bg-green-100 text-green-700',
  LOW_STOCK: 'bg-yellow-100 text-yellow-700',
  OUT_OF_STOCK: 'bg-red-100 text-red-700',
};

const emptyForm = { name: '', category: '', unitPrice: '', quantity: '', unitType: '', description: '' };

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchMaterials = () => {
    setLoading(true);
    fetch(`${API}/materials${search ? `?search=${search}` : ''}`)
      .then(r => r.json()).then(setMaterials).catch(() => setMaterials([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchMaterials(); }, [search]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    const body = { ...form, unitPrice: parseFloat(form.unitPrice), quantity: parseInt(form.quantity) };
    const url = editId ? `${API}/materials/${editId}` : `${API}/materials`;
    const method = editId ? 'PUT' : 'POST';
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    setShowForm(false); setForm(emptyForm); setEditId(null); setSaving(false); fetchMaterials();
  };

  const handleEdit = (m: Material) => {
    setForm({ name: m.name, category: m.category, unitPrice: String(m.unitPrice), quantity: String(m.quantity), unitType: m.unitType, description: m.description || '' });
    setEditId(m.id); setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this material?')) return;
    await fetch(`${API}/materials/${id}`, { method: 'DELETE' });
    fetchMaterials();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#081B3A]">Materials</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your procurement materials inventory</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditId(null); setForm(emptyForm); }} className="bg-[#2563EB] text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-blue-700 transition-all hover:shadow-lg hover:-translate-y-0.5">
          + Add Material
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search materials by name or ID..." className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB]" />
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
            <h2 className="text-xl font-bold text-[#081B3A] mb-5">{editId ? 'Edit Material' : 'Add New Material'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { label: 'Material Name', key: 'name', type: 'text', required: true },
                { label: 'Category', key: 'category', type: 'text', required: true },
                { label: 'Unit Price (₹)', key: 'unitPrice', type: 'number', required: true },
                { label: 'Quantity', key: 'quantity', type: 'number', required: true },
                { label: 'Unit Type (e.g. kg, ton, piece)', key: 'unitType', type: 'text', required: true },
                { label: 'Description', key: 'description', type: 'text', required: false },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                  <input type={f.type} required={f.required} value={(form as any)[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB]" />
                </div>
              ))}
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="flex-1 bg-[#2563EB] text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-blue-700 transition disabled:opacity-60">
                  {saving ? 'Saving...' : editId ? 'Update Material' : 'Add Material'}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setEditId(null); }} className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-lg font-semibold text-sm hover:bg-gray-50 transition">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading materials...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr className="text-xs text-gray-500 uppercase tracking-wider">
                  {['Material ID', 'Name', 'Category', 'Unit Price', 'Quantity', 'Unit', 'Status', 'Actions'].map(h => (
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
                    <td className="px-5 py-4 font-semibold">₹{m.unitPrice.toLocaleString()}</td>
                    <td className="px-5 py-4">{m.quantity.toLocaleString()}</td>
                    <td className="px-5 py-4 text-gray-500">{m.unitType}</td>
                    <td className="px-5 py-4"><span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[m.status] || 'bg-gray-100 text-gray-600'}`}>{m.status.replace('_', ' ')}</span></td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(m)} className="text-[#2563EB] hover:text-blue-800 text-xs font-medium px-3 py-1 border border-blue-200 rounded-lg hover:bg-blue-50 transition">Edit</button>
                        <button onClick={() => handleDelete(m.id)} className="text-red-500 hover:text-red-700 text-xs font-medium px-3 py-1 border border-red-200 rounded-lg hover:bg-red-50 transition">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {materials.length === 0 && <tr><td colSpan={8} className="px-5 py-10 text-center text-gray-400">No materials found. Click "Add Material" to get started.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
