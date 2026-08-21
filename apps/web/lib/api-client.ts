import axios from "axios";

export type ApiError = {
  status: number;
  message: string;
  fieldErrors?: Record<string, string>;
  raw?: unknown;
};

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});
