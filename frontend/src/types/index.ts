
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export type EmailStatus = "scheduled" | "sent" | "failed";

export interface Email {
  id: string;
  to: string;
  subject: string;
  body?: string;
  status: EmailStatus;
  scheduledAt?: string;
  sentAt?: string;
  createdAt?: string;
  sender?: string;
}

export interface ScheduleEmailPayload {
  subject: string;
  body: string;
  recipients: string[];
  startTime: string;
  delaySeconds: number;
  hourlyLimit: number;
}
