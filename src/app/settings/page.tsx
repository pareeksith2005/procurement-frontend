"use client";
import React from 'react';

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <h2 className="text-2xl font-bold text-[#081B3A]">Settings</h2>

      {/* Profile Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-bold text-[#081B3A] mb-4">Profile Settings</h3>
        <div className="flex items-center gap-5 mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#2563EB] to-[#A855F7] text-white flex items-center justify-center text-2xl font-bold shadow-lg">A</div>
          <div>
            <h4 className="font-bold text-[#081B3A]">Admin User</h4>
            <p className="text-sm text-gray-500">admin@procureai.com</p>
            <p className="text-xs text-[#2563EB] font-medium mt-1">Role: Administrator</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input defaultValue="Admin User" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] outline-none transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input defaultValue="admin@procureai.com" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] outline-none transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input defaultValue="+1-555-0100" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] outline-none transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
            <input defaultValue="ProcureAI Inc" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] outline-none transition" />
          </div>
        </div>
        <button className="mt-4 bg-gradient-to-r from-[#2563EB] to-[#38BDF8] text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:shadow-lg transition-all shadow-blue-500/20 shadow-md">
          Save Changes
        </button>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-bold text-[#081B3A] mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          {[
            { label: 'Email notifications', desc: 'Receive order updates via email', checked: true },
            { label: 'Low stock alerts', desc: 'Get notified when materials are running low', checked: true },
            { label: 'Order status changes', desc: 'Track purchase order progress', checked: true },
            { label: 'New supplier alerts', desc: 'When a new supplier is added', checked: false },
          ].map((pref, i) => (
            <div key={i} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-[#081B3A]">{pref.label}</p>
                <p className="text-xs text-gray-500">{pref.desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked={pref.checked} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-checked:bg-[#2563EB] rounded-full peer-focus:ring-4 peer-focus:ring-blue-100 transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full shadow-inner"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Appearance */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-bold text-[#081B3A] mb-4">Appearance</h3>
        <div className="flex gap-4">
          <button className="flex-1 p-4 rounded-xl border-2 border-[#2563EB] bg-blue-50 text-center transition">
            <span className="text-2xl">☀️</span>
            <p className="text-sm font-medium text-[#081B3A] mt-2">Light Mode</p>
          </button>
          <button className="flex-1 p-4 rounded-xl border-2 border-gray-200 hover:border-gray-400 text-center transition">
            <span className="text-2xl">🌙</span>
            <p className="text-sm font-medium text-gray-600 mt-2">Dark Mode</p>
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-xl shadow-sm border border-red-100 p-6">
        <h3 className="font-bold text-red-600 mb-2">Danger Zone</h3>
        <p className="text-sm text-gray-500 mb-4">These actions are irreversible. Please proceed with caution.</p>
        <div className="flex gap-3">
          <button className="px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition">Reset Database</button>
          <button className="px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition">Delete Account</button>
        </div>
      </div>
    </div>
  );
}
