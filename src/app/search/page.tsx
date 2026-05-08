"use client";
import React, { useState, Suspense } from 'react';
import { API } from '@/lib/api';

interface SearchResults {
  materials: any[]; suppliers: any[]; orders: any[];
}

function SearchContent() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (q: string) => {
    setQuery(q);
    if (!q.trim()) { setResults(null); return; }
    setLoading(true);
    try {
      const data = await fetch(`${API}/search?q=${encodeURIComponent(q)}`).then(r => r.json());
      setResults(data);
    } catch { setResults({ materials: [], suppliers: [], orders: [] }); }
    finally { setLoading(false); }
  };

  const total = results ? results.materials.length + results.suppliers.length + results.orders.length : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#081B3A]">Global Search</h1>
        <p className="text-gray-500 text-sm mt-1">Search across materials, suppliers, and orders</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
          <input value={query} onChange={e => handleSearch(e.target.value)} placeholder="Search by material name, supplier, category, or order ID..." autoFocus
            className="w-full border border-gray-200 rounded-lg pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB]" />
          {loading && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm animate-pulse">Searching...</span>}
        </div>
      </div>

      {results && <p className="text-sm text-gray-500">{total} result{total !== 1 ? 's' : ''} for <span className="font-semibold text-[#081B3A]">"{query}"</span></p>}

      {results && results.materials.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-3 bg-blue-50 border-b font-semibold text-blue-700 text-sm">📦 Materials ({results.materials.length})</div>
          <div className="overflow-x-auto"><table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b"><tr>{['ID','Name','Category','Price','Status'].map(h => <th key={h} className="px-5 py-3 text-xs text-gray-500 font-medium uppercase">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-gray-50">
              {results.materials.map((m: any) => (
                <tr key={m.id} className="hover:bg-gray-50/50">
                  <td className="px-5 py-3 font-semibold text-[#2563EB]">{m.materialId}</td>
                  <td className="px-5 py-3 font-medium">{m.name}</td>
                  <td className="px-5 py-3 text-gray-500">{m.category}</td>
                  <td className="px-5 py-3">₹{m.unitPrice}</td>
                  <td className="px-5 py-3"><span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">{m.status?.replace(/_/g,' ')}</span></td>
                </tr>
              ))}
            </tbody>
          </table></div>
        </div>
      )}

      {results && results.suppliers.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-3 bg-green-50 border-b font-semibold text-green-700 text-sm">🏢 Suppliers ({results.suppliers.length})</div>
          <div className="overflow-x-auto"><table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b"><tr>{['Name','Contact','Phone','Email','Rating'].map(h => <th key={h} className="px-5 py-3 text-xs text-gray-500 font-medium uppercase">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-gray-50">
              {results.suppliers.map((s: any) => (
                <tr key={s.id} className="hover:bg-gray-50/50">
                  <td className="px-5 py-3 font-medium">{s.name}</td>
                  <td className="px-5 py-3 text-gray-500">{s.contactPerson}</td>
                  <td className="px-5 py-3 text-gray-500">{s.phone}</td>
                  <td className="px-5 py-3 text-gray-500">{s.email}</td>
                  <td className="px-5 py-3">⭐ {s.rating}/5</td>
                </tr>
              ))}
            </tbody>
          </table></div>
        </div>
      )}

      {results && results.orders.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-3 bg-orange-50 border-b font-semibold text-orange-700 text-sm">🛒 Orders ({results.orders.length})</div>
          <div className="overflow-x-auto"><table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b"><tr>{['Order ID','Supplier','Items','Amount','Status'].map(h => <th key={h} className="px-5 py-3 text-xs text-gray-500 font-medium uppercase">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-gray-50">
              {results.orders.map((o: any) => (
                <tr key={o.id} className="hover:bg-gray-50/50">
                  <td className="px-5 py-3 font-semibold text-[#2563EB]">{o.orderId}</td>
                  <td className="px-5 py-3 font-medium">{o.supplierName}</td>
                  <td className="px-5 py-3 text-gray-500 text-xs max-w-[180px] truncate">{o.items}</td>
                  <td className="px-5 py-3 font-semibold">₹{o.totalAmount?.toLocaleString()}</td>
                  <td className="px-5 py-3"><span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">{o.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table></div>
        </div>
      )}

      {results && total === 0 && (
        <div className="text-center py-16 bg-white rounded-xl border"><p className="text-4xl mb-3">🔍</p><p className="text-gray-500">No results for "{query}"</p></div>
      )}
      {!results && !loading && (
        <div className="text-center py-20 bg-white rounded-xl border"><p className="text-5xl mb-4">🔍</p><p className="text-gray-500 text-lg font-medium">Start typing to search</p></div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return <Suspense fallback={<div className="p-8 text-gray-400">Loading...</div>}><SearchContent /></Suspense>;
}
