
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Star,
  Archive,
  Trash2,
} from "lucide-react";

import { getEmailById } from "../services/email";
import type { Email } from "../types";

export default function EmailDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [email, setEmail] = useState<Email | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    getEmailById(id)
      .then(setEmail)
      .catch(() => setEmail(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="p-10 text-center text-sm text-gray-400">
        Loading email...
      </div>
    );
  }

  if (!email) {
    return (
      <div className="p-10 text-center">
        <p className="text-sm">Email not found.</p>
        <button onClick={() => navigate("/")} className="text-green-600 text-xs mt-3">
          Return to dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">

      <header className="h-[58px] border-b flex items-center justify-between px-5">

        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/")}>
            <ArrowLeft size={17} />
          </button>

          <h2 className="text-sm font-medium">
            {email.subject}
          </h2>
        </div>

        <div className="flex items-center gap-3 text-gray-400">
          <Star size={15} />
          <Archive size={15} />
          <Trash2 size={15} />
          <img
            src="https://ui-avatars.com/api/?name=User"
            alt="User"
            className="w-7 h-7 rounded-full"
          />
        </div>

      </header>

      <div className="max-w-[850px] mx-auto px-5 py-7">

        <div className="flex items-center gap-3 mb-7">

          <div className="w-10 h-10 bg-[#00bd53] text-white rounded-full flex items-center justify-center text-sm">
            {email.sender?.charAt(0).toUpperCase() || "S"}
          </div>

          <div className="flex-1">
            <p className="text-xs font-semibold">
              {email.sender || "Sender"}
            </p>
            <p className="text-[10px] text-gray-400">
              To: {email.to}
            </p>
          </div>

          <p className="text-[10px] text-gray-400">
            {email.sentAt
              ? new Date(email.sentAt).toLocaleString()
              : email.scheduledAt
                ? new Date(email.scheduledAt).toLocaleString()
                : ""}
          </p>

        </div>

        <div className="ml-[52px]">

          <div className="text-sm leading-7 whitespace-pre-wrap text-gray-700">
            {email.body || "No email content available."}
          </div>

          <div className="mt-7 border-t pt-4">
            <p className="text-[10px] text-gray-400">
              Email status: {email.status}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
