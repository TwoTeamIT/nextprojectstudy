"use client";

import { useEffect } from "react";
import { AlertOptions } from "./Alerter";
import AlertObserver from "./AlertObserver";

export type AlertSenderProps = {
  messages?: string[] | undefined;
};

export function AlertSender({ messages }: AlertSenderProps) {
  useEffect(() => {
    if (messages !== undefined) {
      messages.forEach((m) => {
        try {
          const parsedAlert = JSON.parse(m);
          const alert: AlertOptions = {
            title: parsedAlert.title,
            message: parsedAlert.message,
            severity: parsedAlert.severity,
            variant: parsedAlert.variant,
          };

          AlertObserver.notify(alert);
        } catch (err) {
          console.error("Error parsing message:", err);
        }
      });
    }
  }, [messages]);

  return null;
}
