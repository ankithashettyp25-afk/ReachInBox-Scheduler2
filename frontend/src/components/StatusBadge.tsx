
import type { EmailStatus } from "../types";

export default function StatusBadge({
  status,
}: {
  status: EmailStatus;
}) {
  const styles: Record<EmailStatus, string> = {
    scheduled: "bg-[#fff0df] text-[#e77b24]",
    sent: "bg-[#edf0f2] text-[#68727d]",
    failed: "bg-[#feecec] text-red-600",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-[3px] text-[9px] whitespace-nowrap ${styles[status]}`}
    >
      {status === "scheduled" ? "◷ " : ""}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
