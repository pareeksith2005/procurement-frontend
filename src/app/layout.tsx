"use client";
import './globals.css';
import { Inter } from 'next/font/google';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const inter = Inter({ subsets: ['latin'] });

const navItems = [
  { label: 'Dashboard',       href: '/',             icon: '🏠', accent: false },
  { label: 'Materials',       href: '/materials',    icon: '📦', accent: false },
  { label: 'Suppliers',       href: '/suppliers',    icon: '🏢', accent: false },
  { label: 'Mapping',         href: '/mapping',      icon: '🔗', accent: false },
  { label: 'Inventory',       href: '/inventory',    icon: '📋', accent: false },
  { label: 'Purchase Orders', href: '/orders',       icon: '🛒', accent: false },
  { label: 'Search',          href: '/search',       icon: '🔍', accent: false },
  { label: 'Reports',         href: '/reports',      icon: '📊', accent: false },
  { label: 'AI Assistant',    href: '/ai-assistant', icon: '🤖', accent: true  },
  { label: 'Notifications',   href: '/notifications',icon: '🔔', accent: false },
  { label: 'Settings',        href: '/settings',     icon: '⚙️', accent: false },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <html lang="en">
      <head>
        <title>ProcureAI OS — Material Procurement System</title>
        <meta name="description" content="AI-powered Material Procurement Management Dashboard for enterprise supply chain operations" />
      </head>
      <body className={`${inter.className} min-h-screen flex bg-[#F8FAFC]`}>
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Sidebar */}
        <aside className={`
          fixed md:sticky top-0 left-0 h-screen w-[260px] z-40
          bg-[#081B3A] text-white flex flex-col
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          {/* Logo */}
          <div className="p-5 flex items-center gap-3 border-b border-white/10">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#2563EB] to-[#38BDF8] flex items-center justify-center text-lg font-bold shadow-lg shadow-blue-500/30">P</div>
            <div>
              <h1 className="text-base font-bold tracking-tight">ProcureAI OS</h1>
              <p className="text-[10px] text-blue-300 tracking-widest uppercase">Material Procurement</p>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto scrollbar-thin">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                  transition-all duration-200 group
                  ${item.accent
                    ? 'text-[#38BDF8] hover:bg-[#38BDF8]/10'
                    : 'text-gray-300 hover:text-white hover:bg-white/8'}
                `}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </a>
            ))}
          </nav>

          {/* Bottom */}
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#A855F7] to-[#2563EB] flex items-center justify-center text-xs font-bold">A</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Admin User</p>
                <p className="text-xs text-gray-400 truncate">admin@procureai.com</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-h-screen">
          {/* Top Header */}
          <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-200/60 flex items-center justify-between px-6 sticky top-0 z-20">
            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <span className="text-xl">☰</span>
            </button>
            <div className="hidden md:flex items-center gap-3">
              <h2 className="text-lg font-semibold text-[#081B3A]">Dashboard</h2>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2 w-64">
                <span className="text-gray-400 mr-2 text-sm">🔍</span>
                <input 
                  type="text" 
                  placeholder="Search materials, orders..." 
                  className="bg-transparent text-sm outline-none flex-1 text-gray-700" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearch}
                />
              </div>
              {/* Notifications bell */}
              <a href="/notifications" className="relative p-2 rounded-lg hover:bg-gray-100 group">
                <span className="text-lg group-hover:scale-110 transition-transform block">🔔</span>
              </a>
              {/* Avatar */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700 hidden sm:inline">Admin</span>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2563EB] to-[#A855F7] text-white flex items-center justify-center text-xs font-bold shadow-md">A</div>
              </div>
            </div>
          </header>

          {/* Page content with subtle background pattern */}
          <div className="p-6 flex-1 overflow-auto relative">
            {/* Subtle background watermark */}
            <div 
              className="absolute inset-0 opacity-[0.03] pointer-events-none z-0"
              style={{
                backgroundImage: 'url(/bg-pattern.png)',
                backgroundSize: '800px',
                backgroundRepeat: 'repeat',
              }}
            />
            <div className="relative z-10">
              {children}
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
