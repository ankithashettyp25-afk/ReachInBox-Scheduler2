import React, { useEffect, useState } from 'react';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  slackWebhook: string;
}

export default function Header({ searchQuery, setSearchQuery, slackWebhook }: HeaderProps) {
  const [user, setUser] = useState({ name: 'Oliver Brown', email: 'oliver.brown@domain.io', avatar: '' });

  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (saved) setUser(JSON.parse(saved));
  }, []);

  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center gap-4 w-1/3">
        <input
          type="text"
          placeholder="Search emails, subjects, or recipients..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-gray-100 border border-transparent focus:border-emerald-500 outline-none px-4 py-2 rounded-lg text-sm w-full transition"
        />
      </div>

      <div className="flex items-center gap-4">
        <a
          href="http://localhost:5000/api/slack/connect"
          className={`text-xs px-3 py-1.5 rounded-lg font-medium border flex items-center gap-1.5 transition ${
            slackWebhook ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
          }`}
        >
          <span>💬</span> {slackWebhook ? 'Slack Connected' : 'Connect Slack'}
        </a>

        <div className="flex items-center gap-3 border-l pl-4">
          <img
            src={user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces"}
            alt="Avatar"
            className="w-9 h-9 rounded-full object-cover border"
          />
          <div className="text-left">
            <p className="text-xs font-bold text-gray-900">{user.name}</p>
            <p className="text-[10px] text-gray-500">{user.email}</p>
          </div>
        </div>
      </div>
    </header>
  );
}