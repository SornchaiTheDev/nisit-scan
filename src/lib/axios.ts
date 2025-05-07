import axios from "axios";

export const api = axios.create({
  baseURL: typeof window !== "undefined" ? window.env.API_URL : undefined,
  withCredentials: true,
});
