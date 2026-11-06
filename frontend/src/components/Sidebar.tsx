import React from 'react';
import { useRouter } from 'next/router';

interface SidebarProps {
  activeTab: 'scheduled' | 'sent';
  setActiveTab: (tab: 'scheduled' | 'sent') => void;
  onOpenCompose: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, onOpenCompose }: SidebarProps) {
  const router = useRouter();

  return (
    <aside className="w-64 border-r bg-white flex flex-col justify-between p-4">
      <div>
        <div className="flex items-center gap-2 px-2 py-3 mb-6">
          <div className="bg-black text-white font-black text-xs px-2 py-1 rounded">ONB</div>
          <span className="font-bold text-sm tracking-wide text-gray-900">Outbox Labs</span>
        </div>

        <button
          onClick={onOpenCompose}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2.5 px-4 rounded-xl shadow-sm transition mb-6 text-sm text-center"
        >
          Compose
        </button>

        <nav className="space-y-1">
          <button
            onClick={() => setActiveTab('scheduled')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition ${
              activeTab === 'scheduled' ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span>Scheduled</span>
            <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full text-gray-600">Active</span>
          </button>

          <button
            onClick={() => setActiveTab('sent')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition ${
              activeTab === 'sent' ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span>Sent</span>
            <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full text-gray-600">Logs</span>
          </button>
        </nav>
      </div>

      <div className="border-t pt-4">
        <button
          onClick={() => {
            localStorage.removeItem('user');
            router.push('/');
          }}
          className="w-full text-left px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}