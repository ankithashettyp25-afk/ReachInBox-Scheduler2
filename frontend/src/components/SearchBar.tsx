
import { Search, Filter, RefreshCw } from "lucide-react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  onRefresh: () => void;
}

export default function SearchBar({
  value,
  onChange,
  onRefresh,
}: Props) {
  return (
    <div className="flex items-center gap-3 w-full max-w-[470px]">
      <div className="flex items-center flex-1 bg-[#f3f6f4] rounded-full h-[34px] px-3 gap-2">
        <Search size={13} className="text-gray-400" />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search"
          className="bg-transparent w-full outline-none text-[11px] placeholder:text-gray-400"
        />
      </div>

      <button title="Filter" className="text-gray-400 hover:text-gray-700">
        <Filter size={14} />
      </button>

      <button
        title="Refresh"
        onClick={onRefresh}
        className="text-gray-400 hover:text-gray-700"
      >
        <RefreshCw size={13} />
      </button>
    </div>
  );
}
