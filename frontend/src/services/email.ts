
import api from "./api";
import type { Email, ScheduleEmailPayload } from "../types";

export const getScheduledEmails = async (): Promise<Email[]> => {
  const response = await api.get("/emails/scheduled");
  return response.data.emails;
};

export const getSentEmails = async (): Promise<Email[]> => {
  const response = await api.get("/emails/sent");
  return response.data.emails;
};

export const scheduleEmails = async (
  payload: ScheduleEmailPayload
) => {
  const response = await api.post("/emails/schedule", payload);
  return response.data;
};

export const getEmailById = async (id: string): Promise<Email> => {
  const response = await api.get(`/emails/${id}`);
  return response.data.email;
};
