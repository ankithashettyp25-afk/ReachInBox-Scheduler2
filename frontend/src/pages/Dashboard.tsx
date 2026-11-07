
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import Sidebar from "../components/Sidebar";
import SearchBar from "../components/SearchBar";
import EmailList from "../components/EmailList";
import ComposeEmail from "../components/ComposeEmail";

import {
  getScheduledEmails,
  getSentEmails,
} from "../services/email";

import type { Email } from "../types";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<
    "scheduled" | "sent"
  >("scheduled");

  const [scheduled, setScheduled] = useState<Email[]>([]);
  const [sent, setSent] = useState<Email[]>([]);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showCompose, setShowCompose] = useState(false);

  const fetchEmails = useCallback(async () => {
    setLoading(true);

    try {
      const [scheduledData, sentData] = await Promise.all([
        getScheduledEmails(),
        getSentEmails(),
      ]);

      setScheduled(scheduledData);
      setSent(sentData);
    } catch {
      toast.error("Unable to load emails. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchEmails();
  }, [fetchEmails]);

  const currentEmails = activeTab === "scheduled" ? scheduled : sent;

  const filteredEmails = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) return currentEmails;

    return currentEmails.filter(
      (email) =>
        email.to.toLowerCase().includes(query) ||
        email.subject.toLowerCase().includes(query) ||
        (email.body || "").toLowerCase().includes(query)
    );
  }, [currentEmails, search]);

  return (
    <div className="flex min-h-screen bg-white">

      <Sidebar
        activeTab={activeTab}
        onChange={(tab) => {
          setActiveTab(tab);
          setSearch("");
        }}
        scheduledCount={scheduled.length}
        sentCount={sent.length}
        onCompose={() => setShowCompose(true)}
      />

      <main className="flex-1 min-w-0 px-4 sm:px-7 py-5">

        <div className="flex items-center gap-4">
          <SearchBar
            value={search}
            onChange={setSearch}
            onRefresh={() => void fetchEmails()}
          />
        </div>

        <div className="mt-3">
          <EmailList
            emails={filteredEmails}
            loading={loading}
            type={activeTab}
          />
        </div>

      </main>

      {showCompose && (
        <ComposeEmail
          onClose={() => setShowCompose(false)}
          onScheduled={() => {
            void fetchEmails();
            setActiveTab("scheduled");
          }}
        />
      )}

    </div>
  );
}
