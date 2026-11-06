import React from 'react';

interface EmailTableProps {
  emails: any[];
  loading: boolean;
  type: 'scheduled' | 'sent';
}

export default function EmailTable({ emails, loading, type }: EmailTableProps) {
  if (loading) {
    return <div className="text-center py-12 text-sm text-gray-400">Loading emails...</div>;
  }

  if (emails.length === 0) {
    return (
      <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-2xl bg-white mt-4">
        <p className="text-sm font-medium text-gray-500">No {type} emails found.</p>
        <p className="text-xs text-gray-400 mt-1">Compose or schedule a new batch to see them here.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="bg-gray-50 border-b text-gray-500 text-xs font-semibold uppercase tracking-wider">
            <th className="p-4">Recipient</th>
            <th className="p-4">Subject</th>
            <th className="p-4">{type === 'scheduled' ? 'Scheduled Time' : 'Sent Time'}</th>
            <th className="p-4">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {emails.map((email) => (
            <tr key={email.id} className="hover:bg-gray-50/50 transition">
              <td className="p-4 font-medium text-gray-900">{email.recipientEmail}</td>
              <td className="p-4 text-gray-600">{email.subject}</td>
              <td className="p-4 text-xs text-gray-500">
                {new Date(type === 'scheduled' ? email.scheduledAt : email.sentAt || email.createdAt).toLocaleString()}
              </td>
              <td className="p-4">
                <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${
                  email.status === 'SENT' ? 'bg-green-100 text-green-700' :
                  email.status === 'RATE_LIMITED' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {email.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}