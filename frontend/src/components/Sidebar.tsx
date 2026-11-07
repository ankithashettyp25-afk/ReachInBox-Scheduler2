
import {
  Clock3,
  Send,

  ChevronDown,
  LogOut,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

interface SidebarProps {
  activeTab: "scheduled" | "sent";
  onChange: (tab: "scheduled" | "sent") => void;
  scheduledCount: number;
  sentCount: number;
  onCompose: () => void;
}

export default function Sidebar({
  activeTab,
  onChange,
  scheduledCount,
  sentCount,
  onCompose,
}: SidebarProps) {
  const { user, logout } = useAuth();

  return (
    <aside className="w-[180px] min-w-[180px] h-screen border-r border-gray-100 bg-white p-3 flex flex-col">

      <h1 className="text-[23px] font-black tracking-tight mb-3 px-1">
        ONB
      </h1>

      <div className="flex items-center gap-2 rounded-xl bg-[#f4f7f5] p-2 mb-3">

        <img
          src={user?.avatar || "https://ui-avatars.com/api/?name=User"}
          alt="Profile"
          className="w-[23px] h-[23px] rounded-full object-cover"
        />

        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-semibold truncate">
            {user?.name || "User"}
          </p>
          <p className="text-[8px] text-gray-400 truncate">
            {user?.email}
          </p>
        </div>

        <ChevronDown size={13} className="text-gray-400" />
      </div>

      <button
        onClick={onCompose}
        className="h-[23px] w-full rounded-full border border-[#00b84a] text-[#00a63e] text-[10px] font-semibold hover:bg-[#e9f8ef]"
      >
        Compose
      </button>

      <p className="text-[8px] text-gray-400 mt-4 mb-2 px-3">
        CORE
      </p>

      <button
        onClick={() => onChange("scheduled")}
        className={`flex items-center gap-2 px-3 py-[5px] rounded-full text-[10px] ${
          activeTab === "scheduled"
            ? "bg-[#e5f5ec] font-semibold"
            : "hover:bg-gray-50"
        }`}
      >
        <Clock3 size={12} />
        <span className="flex-1 text-left">Scheduled</span>
        <span className="text-gray-400">{scheduledCount}</span>
      </button>

      <button
        onClick={() => onChange("sent")}
        className={`flex items-center gap-2 px-3 py-[5px] rounded-full text-[10px] mt-1 ${
          activeTab === "sent"
            ? "bg-[#e5f5ec] font-semibold"
            : "hover:bg-gray-50"
        }`}
      >
        <Send size={12} />
        <span className="flex-1 text-left">Sent</span>
        <span className="text-gray-400">{sentCount}</span>
      </button>

      <div className="mt-auto">
        <button
          onClick={() => void logout()}
          className="w-full flex items-center gap-2 text-[10px] text-gray-500 hover:text-red-500 p-2"
        >
          <LogOut size={13} />
          Logout
        </button>
      </div>
    </aside>
  );
}
