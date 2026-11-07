
import { useState } from "react";
import Papa from "papaparse";
import { ArrowLeft, Paperclip, Clock, Send } from "lucide-react";
import { toast } from "sonner";

import { scheduleEmails } from "../services/email";
import type { ScheduleEmailPayload } from "../types";

interface Props {
  onClose: () => void;
  onScheduled: () => void;
}

export default function ComposeEmail({
  onClose,
  onScheduled,
}: Props) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [recipients, setRecipients] = useState<string[]>([]);
  const [startTime, setStartTime] = useState("");
  const [delaySeconds, setDelaySeconds] = useState(2);
  const [hourlyLimit, setHourlyLimit] = useState(200);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);

  const extractEmails = (text: string) => {
    return [
      ...new Set(
        text.match(
          /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
        ) || []
      ),
    ];
  };

  const handleFile = (file?: File) => {
    if (!file) return;

    setFileName(file.name);

    if (!/\.(csv|txt)$/i.test(file.name)) {
      toast.error("Please upload a CSV or TXT file");
      return;
    }

    if (file.name.toLowerCase().endsWith(".txt")) {
      const reader = new FileReader();

      reader.onload = () => {
        const emails = extractEmails(String(reader.result));
        setRecipients(emails);
        toast.success(`${emails.length} email addresses detected`);
      };

      reader.readAsText(file);
      return;
    }

    Papa.parse(file, {
      complete: (results) => {
        const emails = extractEmails(
          results.data.map((row) => JSON.stringify(row)).join(" ")
        );

        setRecipients(emails);
        toast.success(`${emails.length} email addresses detected`);
      },
      error: () => toast.error("Unable to read CSV file"),
    });
  };

  const handleSchedule = async () => {
    if (!subject.trim() || !body.trim()) {
      toast.error("Enter both subject and email body");
      return;
    }

    if (!recipients.length) {
      toast.error("Upload a file containing email addresses");
      return;
    }

    if (!startTime || new Date(startTime).getTime() <= Date.now()) {
      toast.error("Choose a future start time");
      return;
    }

    if (delaySeconds < 1 || hourlyLimit < 1) {
      toast.error("Delay and hourly limit must be positive");
      return;
    }

    const payload: ScheduleEmailPayload = {
      subject,
      body,
      recipients,
      startTime: new Date(startTime).toISOString(),
      delaySeconds,
      hourlyLimit,
    };

    try {
      setLoading(true);

      await scheduleEmails(payload);

      toast.success("Emails scheduled successfully!");
      onScheduled();
      onClose();
    } catch {
      toast.error("Unable to schedule emails");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/20 flex justify-center items-center p-3">

      <div className="bg-white w-full max-w-[700px] max-h-[95vh] overflow-y-auto rounded-xl shadow-xl">

        <div className="flex items-center justify-between border-b p-4">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-sm"
          >
            <ArrowLeft size={17} />
            Compose New Email
          </button>

          <div className="flex items-center gap-3">
            <label className="cursor-pointer text-green-600">
              <Paperclip size={17} />
              <input
                type="file"
                accept=".csv,.txt,text/csv,text/plain"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
            </label>

            <button
              onClick={handleSchedule}
              disabled={loading}
              className="border border-green-500 text-green-600 rounded-full px-5 py-1.5 text-xs hover:bg-green-50 disabled:opacity-50"
            >
              {loading ? "Scheduling..." : "Send Later"}
            </button>
          </div>
        </div>

        <div className="p-5 space-y-4">

          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-400">From</span>
            <span className="font-medium">Authenticated sender</span>
          </div>

          <div className="flex items-center gap-2 text-xs border-b pb-3">
            <span className="text-gray-400">To</span>
            <span className="text-gray-600">
              {recipients.length
                ? `${recipients.length} recipients uploaded`
                : "Upload your CSV/TXT leads file"}
            </span>
          </div>

          {fileName && (
            <div className="rounded-lg bg-[#f2f8f4] p-3 text-xs">
              <p className="font-medium">{fileName}</p>
              <p className="text-green-600 mt-1">
                {recipients.length} email addresses detected
              </p>
            </div>
          )}

          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject"
            className="w-full border-b py-3 text-sm outline-none focus:border-green-500"
          />

          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write your email..."
            rows={9}
            className="w-full resize-y text-sm outline-none leading-6"
          />

          <div className="border-t pt-4 space-y-4">

            <p className="text-sm font-semibold">
              Scheduling settings
            </p>

            <div className="grid sm:grid-cols-3 gap-4">

              <label className="text-xs text-gray-500">
                Start time
                <input
                  type="datetime-local"
                  value={startTime}
                  min={new Date(Date.now() + 60000)
                    .toISOString()
                    .slice(0, 16)}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="mt-2 w-full rounded-md border p-2 text-xs text-gray-700"
                />
              </label>

              <label className="text-xs text-gray-500">
                Delay between emails (seconds)
                <input
                  type="number"
                  min="1"
                  value={delaySeconds}
                  onChange={(e) =>
                    setDelaySeconds(Number(e.target.value))
                  }
                  className="mt-2 w-full rounded-md border p-2 text-xs"
                />
              </label>

              <label className="text-xs text-gray-500">
                Hourly limit
                <input
                  type="number"
                  min="1"
                  value={hourlyLimit}
                  onChange={(e) =>
                    setHourlyLimit(Number(e.target.value))
                  }
                  className="mt-2 w-full rounded-md border p-2 text-xs"
                />
              </label>

            </div>

            <div className="flex items-center gap-2 text-[11px] text-gray-400">
              <Clock size={13} />
              {recipients.length} recipients ready for scheduling
            </div>

            <button
              onClick={handleSchedule}
              disabled={loading}
              className="flex items-center justify-center gap-2 bg-[#00a63e] hover:bg-green-700 text-white rounded-lg px-6 py-2.5 text-xs disabled:opacity-50"
            >
              <Send size={14} />
              {loading ? "Scheduling..." : "Schedule Emails"}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}
