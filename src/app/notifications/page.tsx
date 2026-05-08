"use client";
import React, { useEffect, useState } from 'react';
import { API } from '@/lib/api';

interface Notification {
  id: string; type: string; title: string; message: string; read: boolean; createdAt: string;
}

const typeConfig: Record<string, { icon: string; color: string; bg: string }> = {
  warning: { icon: '⚠️', color: 'text-yellow-700', bg: 'bg-yellow-50 border-yellow-200' },
  success: { icon: '✅', color: 'text-green-700', bg: 'bg-green-50 border-green-200' },
  info:    { icon: 'ℹ️', color: 'text-blue-700',  bg: 'bg-blue-50 border-blue-200' },
  error:   { icon: '❌', color: 'text-red-700',   bg: 'bg-red-50 border-red-200' },
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = () => {
    setLoading(true);
    fetch(`${API}/notifications`).then(r => r.json())
      .then(d => setNotifications(Array.isArray(d) ? d : []))
      .catch(() => setNotifications([])).finally(() => setLoading(false));
  };

  useEffect(() => { fetchNotifications(); }, []);

  const markRead = async (id: string) => {
    await fetch(`${API}/notifications/${id}/read`, { method: 'PUT' });
    fetchNotifications();
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#081B3A]">Notifications</h1>
          <p className="text-gray-500 text-sm mt-1">{unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}</p>
        </div>
        {unreadCount > 0 && (
          <span className="bg-red-100 text-red-700 text-sm font-semibold px-3 py-1.5 rounded-full">{unreadCount} unread</span>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse"></div>)}</div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border">
          <p className="text-5xl mb-4">🔔</p>
          <p className="text-gray-500 text-lg font-medium">No notifications</p>
          <p className="text-gray-400 text-sm mt-1">You're all caught up!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map(n => {
            const cfg = typeConfig[n.type] || { icon: '📢', color: 'text-gray-700', bg: 'bg-gray-50 border-gray-200' };
            return (
              <div key={n.id} className={`border rounded-xl p-4 flex items-start gap-4 transition-all ${cfg.bg} ${!n.read ? 'shadow-sm' : 'opacity-70'}`}>
                <span className="text-2xl mt-0.5">{cfg.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className={`font-semibold text-sm ${cfg.color}`}>{n.title}</h3>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-gray-400">{new Date(n.createdAt).toLocaleDateString()}</span>
                      {!n.read && (
                        <button onClick={() => markRead(n.id)} className="text-xs text-[#2563EB] hover:underline font-medium">Mark read</button>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-0.5">{n.message}</p>
                  {!n.read && <span className="inline-block mt-1.5 w-2 h-2 bg-[#2563EB] rounded-full"></span>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
