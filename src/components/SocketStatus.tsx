"use client";

import React from "react";
import { useState, useEffect } from "react";
import { getSocket } from "@/lib/socket";

export default function SocketStatus() {
  const [status, setStatus] = useState<string>(() => {
    // If there's no token, report not-authenticated to guide debugging
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("swappio_token")
          : null;
      if (!token) return "not-authenticated";
    } catch {}
    const s = getSocket();
    if (!s) return "no-socket";
    return s.connected ? "connected" : "connecting";
  });

  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("swappio_token")
        : null;
    if (!token) {
      // defer to avoid synchronous setState inside effect
      setTimeout(() => setStatus("not-authenticated"), 0);
      return;
    }
    const s = getSocket();
    if (!s) {
      setTimeout(() => setStatus("no-socket"), 0);
      return;
    }

    const onConnect = () => setStatus("connected");
    const onDisconnect = () => setStatus("disconnected");
    const onError = () => setStatus("error");

    s.on("connect", onConnect);
    s.on("disconnect", onDisconnect);
    s.on("connect_error", onError);

    return () => {
      s.off("connect", onConnect);
      s.off("disconnect", onDisconnect);
      s.off("connect_error", onError);
    };
  }, []);

  const color =
    status === "connected"
      ? "bg-emerald-500 shadow-emerald-500/50"
      : status === "connecting"
      ? "bg-amber-400 shadow-amber-400/50"
      : status === "not-authenticated"
      ? "bg-gray-400 shadow-gray-400/50"
      : "bg-red-500 shadow-red-500/50";

  const textColor =
    status === "connected"
      ? "text-emerald-700 dark:text-emerald-400"
      : status === "connecting"
      ? "text-amber-700 dark:text-amber-400"
      : status === "not-authenticated"
      ? "text-gray-600 dark:text-gray-400"
      : "text-red-700 dark:text-red-400";

  return (
    <div
      className={`inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-border/50 bg-card backdrop-blur-sm shadow-sm ${textColor}`}
    >
      <span className={`relative flex h-2.5 w-2.5`}>
        <span
          className={`animate-ping absolute inline-flex h-full w-full rounded-full ${color} opacity-75`}
        ></span>
        <span
          className={`relative inline-flex rounded-full h-2.5 w-2.5 ${color} shadow-md`}
        ></span>
      </span>
      <span className="text-xs font-medium capitalize">{status}</span>
    </div>
  );
}
