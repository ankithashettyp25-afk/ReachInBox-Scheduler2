
import api from "./api";
import type { User } from "../types";

export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get("/auth/me");
  return response.data.user;
};

export const loginWithGoogle = () => {
  window.location.href =
    `${import.meta.env.VITE_API_URL}/auth/google`;
};

export const logoutUser = async () => {
  await api.post("/auth/logout");
  window.location.href = "/login";
};
