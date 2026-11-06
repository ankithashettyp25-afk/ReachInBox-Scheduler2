import React, { useState } from 'react';
import axios from 'axios';

interface ComposeModalProps {
  onClose: () => void;
  onSuccess: () => void;
  slackWebhook: string;
}

export default function ComposeModal({ onClose, onSuccess, slackWebhook }: ComposeModalProps) {
  const [recipients, setRecipients] = useState<string[]>([]);
  const [recipientInput, setRecipientInput] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [delayBetweenMs, setDelayBetweenMs] = useState(2000);
  const [hourlyLimit, setHourlyLimit] = useState(200);
  const [scheduledAt, setScheduledAt] = useState('');
  const [showSchedulePicker, setShowSchedulePicker] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const emailsParsed = text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi) || [];
      setRecipients(Array.from(new Set([...recipients, ...emailsParsed])));
    };
    reader.readAsText(file);
  };

  const handleScheduleSubmit = async () => {
    if (recipients.length === 0 || !subject || !body) {
      alert('Please fill in all required fields and add at least one recipient.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/emails/schedule', {
        senderEmail: 'oliver.brown@domain.io',
        recipients,
        subject,
        body,
        scheduledAt: scheduledAt || new Date().toISOString(),
        delayBetweenMs: Number(delayBetweenMs),
        hourlyLimit: Number(hourlyLimit),
        slackWebhookUrl: slackWebhook,
      });
      onSuccess();
    } catch (err) {
      alert('Failed to schedule emails. Ensure backend is running.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl p-6 shadow-2xl relative border border-gray-100">
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <h2 className="text-lg font-bold text-gray-900">Compose New Email</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg">✕</button>
        </div>

        <div className="space-y-4 text-sm">
          <div className="flex items-center gap-3">
            <span className="w-20 font-medium text-gray-500">From:</span>
            <input type="text" disabled value="oliver.brown@domain.io" className="bg-gray-100 px-3 py-2 rounded-xl w-full text-gray-600 border border-gray-200" />
          </div>

          <div className="flex items-start gap-3">
            <span className="w-20 font-medium text-gray-500 pt-2">To:</span>
            <div className="flex-1 flex flex-wrap gap-1.5 p-2 border border-gray-200 rounded-xl max-h-32 overflow-y-auto bg-gray-50/50">
              {recipients.map((email, idx) => (
                <span key={idx} className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5 font-medium">
                  {email}
                  <button onClick={() => setRecipients(recipients.filter((_, i) => i !== idx))} className="hover:text-red-600">×</button>
                </span>
              ))}
              <input
                type="text"
                placeholder="Type email & press Enter..."
                value={recipientInput}
                onChange={(e) => setRecipientInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && recipientInput) {
                    e.preventDefault();
                    setRecipients([...recipients, recipientInput]);
                    setRecipientInput('');
                  }
                }}
                className="outline-none flex-1 min-w-[180px] bg-transparent px-2 py-1"
              />
            </div>
            <label className="cursor-pointer bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-3 py-2.5 rounded-xl text-xs font-semibold transition border border-emerald-200 flex items-center gap-1">
              ⬆ Upload CSV
              <input type="file" accept=".csv,.txt" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          <div className="flex gap-4">
            <div className="flex-1 flex items-center gap-2">
              <span className="w-28 font-medium text-gray-500 text-xs">Delay (ms):</span>
              <input type="number" value={delayBetweenMs} onChange={(e) => setDelayBetweenMs(Number(e.target.value))} className="border border-gray-200 p-2 rounded-xl w-full" />
            </div>
            <div className="flex-1 flex items-center gap-2">
              <span className="w-28 font-medium text-gray-500 text-xs">Hourly Limit:</span>
              <input type="number" value={hourlyLimit} onChange={(e) => setHourlyLimit(Number(e.target.value))} className="border border-gray-200 p-2 rounded-xl w-full" />
            </div>
          </div>

          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full border border-gray-200 p-3 rounded-xl font-medium outline-none focus:border-emerald-500"
          />

          <textarea
            rows={5}
            placeholder="Type your email body here..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex justify-between items-center mt-6 border-t pt-4">
          <div className="relative">
            <button
              onClick={() => setShowSchedulePicker(!showSchedulePicker)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 transition"
            >
              📅 Send Later
            </button>

            {showSchedulePicker && (
              <div className="absolute left-0 bottom-12 bg-white border border-gray-200 rounded-2xl p-4 shadow-2xl w-64 z-20">
                <label className="block text-xs font-bold text-gray-700 mb-1">Pick Date & Time</label>
                <input
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  className="border border-gray-200 p-2 rounded-xl w-full text-sm mb-3 outline-none focus:border-emerald-500"
                />
                <button
                  onClick={() => setShowSchedulePicker(false)}
                  className="w-full bg-emerald-500 text-white text-xs py-2 rounded-xl font-medium hover:bg-emerald-600"
                >
                  Done
                </button>
              </div>
            )}
          </div>

          <button
            onClick={handleScheduleSubmit}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-medium text-sm shadow transition"
          >
            Schedule & Send
          </button>
        </div>
      </div>
    </div>
  );
}
