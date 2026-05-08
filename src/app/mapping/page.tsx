"use client";
import React, { useEffect, useState } from 'react';
import { API } from '@/lib/api';

interface Mapping {
  id: string; materialName: string; supplierName: string; isPreferred: boolean; price: number;
}

const emptyForm = { materialName: '', supplierName: '', price: '', isPreferred: false };

export default function MappingPage() {
  const [mappings, setMappings] = useState<Mapping[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<any>(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchMappings = () => {
    setLoading(true);
    fetch(`${API}/mappings`).then(r => r.json())
      .then(d => setMappings(Array.isArray(d) ? d : []))
      .catch(() => setMappings([])).finally(() => setLoading(false));
  };

  useEffect(() => { fetchMappings(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    const body = { ...form, price: parseFloat(form.price) };
    await fetch(`${API}/mappings`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    setShowForm(false); setForm(emptyForm); setSaving(false); fetchMappings();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this mapping?')) return;
    await fetch(`${API}/mappings/${id}`, { method: 'DELETE' });
    fetchMappings();
  };

  const grouped = mappings.reduce((acc: Record<string, Mapping[]>, m) => {
    if (!acc[m.materialName]) acc[m.materialName] = [];
    acc[m.materialName].push(m);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#081B3A]">Supplier–Material Mapping</h1>
          <p className="text-gray-500 text-sm mt-1">Link suppliers to materials for procurement</p>
        </div>
        <button onClick={() => setShowForm(true)} className="bg-[#2563EB] text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-blue-700 transition-all hover:shadow-lg hover:-translate-y-0.5">
          + Create Mapping
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-[#081B3A] mb-5">Create New Mapping</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { label: 'Material Name', key: 'materialName', type: 'text', required: true },
                { label: 'Supplier Name', key: 'supplierName', type: 'text', required: true },
                { label: 'Price (₹)', key: 'price', type: 'number', required: true },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                  <input type={f.type} required={f.required} value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB]" />
                </div>
              ))}
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isPreferred} onChange={e => setForm({ ...form, isPreferred: e.target.checked })} className="w-4 h-4 text-[#2563EB] rounded" />
                <span className="text-sm text-gray-700 font-medium">Mark as Preferred Supplier</span>
              </label>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="flex-1 bg-[#2563EB] text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-blue-700 transition disabled:opacity-60">
                  {saving ? 'Saving...' : 'Create Mapping'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-lg font-semibold text-sm hover:bg-gray-50 transition">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-10 text-gray-400">Loading mappings...</div>
      ) : Object.keys(grouped).length === 0 ? (
        <div className="text-center py-16 text-gray-400 bg-white rounded-xl border">No mappings found. Create one to get started.</div>
      ) : (
        <div className="space-y-4">
          {Object.entries(grouped).map(([materialName, maps]) => (
            <div key={materialName} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-[#081B3A] to-[#2563EB] px-5 py-3 flex items-center gap-2">
                <span className="text-white font-semibold">📦 {materialName}</span>
                <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">{maps.length} supplier(s)</span>
              </div>
              <div className="divide-y divide-gray-50">
                {maps.map(m => (
                  <div key={m.id} className="px-5 py-3.5 flex items-center justify-between hover:bg-gray-50/50 transition">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-sm">🏢</div>
                      <div>
                        <p className="font-medium text-[#081B3A] text-sm">{m.supplierName}</p>
                        <p className="text-xs text-gray-500">₹{m.price.toLocaleString()} per unit</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {m.isPreferred && <span className="bg-green-100 text-green-700 text-xs px-2.5 py-1 rounded-full font-semibold">⭐ Preferred</span>}
                      <button onClick={() => handleDelete(m.id)} className="text-red-500 text-xs font-medium px-3 py-1 border border-red-200 rounded-lg hover:bg-red-50 transition">Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
