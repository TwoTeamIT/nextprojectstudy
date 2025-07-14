"use client";

import { useEffect } from "react";
import { ToastOptions } from "./Toaster";
import ToastObserver from "./ToastObserver";

interface ToastSenderProps {
  messages?: string[] | undefined;
}

export default function ToastSender({ messages }: ToastSenderProps) {
  useEffect(() => {
    if (messages !== undefined) {
      messages.forEach((m) => {
        try {
          const parsedToast = JSON.parse(m);
          const toast: ToastOptions = {
            title: parsedToast.title,
            message: parsedToast.message,
            severity: parsedToast.severity,
            durationMs: parsedToast.duration,
            variant: parsedToast.variant,
          };

          ToastObserver.notify(toast);
        } catch (err) {
          console.error("Error parsing message:", err);
        }
      });
    }
  }, [messages]);

  return null;
}
