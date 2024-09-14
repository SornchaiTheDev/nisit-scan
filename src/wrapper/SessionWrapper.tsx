"use client";
import { useEffect } from "react";
import { api } from "~/lib/axios";

interface Props {
  children: React.ReactNode;
}

function SessionWrapper({ children }: Props) {
  const refreshToken = () => {
    api.post("/auth/refresh");
  };

  useEffect(() => {
    const interval = setInterval(() => {
      refreshToken();
    }, 1000 * 60);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const onFocus = () => {
      refreshToken();
    };

    window.addEventListener("focus", onFocus);

    return () => window.removeEventListener("focus", onFocus);
  }, []);
  return children;
}

export default SessionWrapper;
