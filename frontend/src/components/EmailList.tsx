
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Email } from "../types";
import StatusBadge from "./StatusBadge";

interface Props {
  emails: Email[];
  loading: boolean;
  type: "scheduled" | "sent";
}

export default function EmailList({
  emails,
  loading,
  type,
}: Props) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="p-8 text-center text-xs text-gray-400">
        Loading emails...
      </div>
    );
  }

  if (!emails.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-12 h-12 rounded-full bg-[#f1f7f3] flex items-center justify-center mb-3">
          <span className="text-xl">✉</span>
        </div>

        <p className="text-sm font-medium text-gray-600">
          No {type} emails
        </p>

        <p className="text-[11px] text-gray-400 mt-1">
          Your {type} emails will appear here.
        </p>
      </div>
    );
  }

  return (
    <div>
      {emails.map((email) => (
        <div
          key={email.id}
          onClick={() => navigate(`/email/${email.id}`)}
          className="group min-h-[35px] border-b border-gray-100 flex items-center gap-2 px-3 hover:bg-[#f8faf9] cursor-pointer"
        >
          <p className="text-[10px] font-medium w-[130px] min-w-[90px] truncate">
            To: {email.to}
          </p>

          <div className="flex items-center gap-2 min-w-0 flex-1">
            <StatusBadge status={email.status} />

            <p className="text-[10px] font-medium truncate">
              {email.subject}
            </p>

            {email.body && (
              <span className="text-[10px] text-gray-400 truncate hidden md:block">
                - {email.body}
              </span>
            )}
          </div>

          <p className="text-[9px] text-gray-400 whitespace-nowrap hidden sm:block">
            {new Date(
              type === "scheduled"
                ? email.scheduledAt || email.createdAt || ""
                : email.sentAt || ""
            ).toLocaleString()}
          </p>

          <button
            onClick={(e) => e.stopPropagation()}
            className="text-gray-300 hover:text-yellow-500 p-1"
            title="Star email"
          >
            <Star size={13} />
          </button>
        </div>
      ))}
    </div>
  );
}
