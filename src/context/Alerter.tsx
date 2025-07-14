"use client";

import React, { useState, useCallback, useEffect } from "react";
import {
  Alert,
  AlertColor,
  Typography,
  Paper,
  useTheme,
  AlertProps,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@mui/material";
import AlertObserver from "./AlertObserver";
import { CheckCircle, Close, Error, Info, Warning } from "@mui/icons-material";
import { DEBUG } from "@/configs";

export type Alert = {
  id: string;
  title?: string;
  message: string;
  severity?: AlertColor; // "success" | "error" | "warning" | "info"
  variant?: AlertProps["variant"];
};

export type AlertOptions = {
  message: string;
  severity?: AlertColor;
  title?: string;
  variant?: AlertProps["variant"];
};

export function Alerter() {
  const { success, error, warning, info } = useTheme().palette;
  const palette = {
    success: success.main,
    error: error.main,
    warning: warning.main,
    info: info.main,
  };

  const [queue, setQueue] = useState<Alert[]>([]);
  const [currentAlert, setCurrentAlert] = useState<Alert | null>(null);

  const showAlert = useCallback(
    ({
      message,
      severity = "info",
      title,
      variant = "outlined",
    }: AlertOptions) => {
      const id = Date.now().toString();
      setQueue((prev) => [
        ...prev,
        { id, open: true, title, message, severity, variant },
      ]);
    },
    []
  );

  const handleClose = () => setCurrentAlert(null);

  useEffect(() => {
    if (!currentAlert && queue.length > 0) {
      const nextAlert = queue[0];
      setCurrentAlert(nextAlert);
      setQueue((prev) => prev.slice(1));
    }
  }, [currentAlert, queue]);

  useEffect(() => {
    if (DEBUG) console.log("Alerter montato!");

    const observerFunction = (alert: AlertOptions) => {
      if (DEBUG) console.log("Alert ricevuto in Alerter:", alert);
      showAlert(alert);
    };

    AlertObserver.subscribe(observerFunction);
    if (DEBUG) console.log("Sottoscritto a AlertObserver!");

    return () => {
      if (DEBUG) console.log("Alerter smontato, annullata sottoscrizione!");
      AlertObserver.unsubscribe(observerFunction);
    };
  }, [showAlert]);

  const getIcon = (
    severity: AlertOptions["severity"],
    variant: AlertOptions["variant"]
  ) => {
    switch (severity) {
      case "success":
        return (
          <CheckCircle
            {...(variant !== "filled" ? { color: "success" } : {})}
          />
        );
      case "error":
        return <Error {...(variant !== "filled" ? { color: "error" } : {})} />;
      case "warning":
        return (
          <Warning {...(variant !== "filled" ? { color: "warning" } : {})} />
        );
      case "info":
      default:
        return <Info {...(variant !== "filled" ? { color: "info" } : {})} />;
    }
  };

  const getBgColor = (
    variant: AlertOptions["variant"],
    severity: AlertOptions["severity"]
  ) => {
    switch (variant) {
      case "filled":
        return palette[severity || "info"];
      case "outlined":
      case "standard":
      default:
        return undefined;
    }
  };

  const getTextColor = (
    variant: AlertOptions["variant"],
    severity: AlertOptions["severity"]
  ) => {
    switch (variant) {
      case "filled":
        return !["warning"].includes(severity || "info") ? "white" : "black";
      case "outlined":
      case "standard":
      default:
        return undefined;
    }
  };

  return (
    <>
      {currentAlert && (
        <Dialog open fullWidth>
          <Paper
            sx={{
              width: "100%",
              height: "100%",
              minWidth: "320px",
              minHeight: "200px",
              borderColor: palette[currentAlert.severity || "success"],
              borderWidth: "3px",
              backgroundColor: getBgColor(
                currentAlert.variant,
                currentAlert.severity
              ),
              color: getTextColor(currentAlert.variant, currentAlert.severity),
            }}
          >
            <div
              aria-label="severity"
              style={{
                position: "absolute",
                left: 20,
                top: 20,
              }}
            >
              {getIcon(currentAlert.severity, currentAlert.variant)}
            </div>
            <DialogTitle className="border-b" sx={{ m: 0, p: 2, pl: 7 }}>
              {currentAlert.title && currentAlert.title}
            </DialogTitle>
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{
                position: "absolute",
                right: 15,
                top: 15,
                color: getTextColor(
                  currentAlert.variant,
                  currentAlert.severity
                ),
              }}
            >
              <Close />
            </IconButton>

            <DialogContent sx={{ m: 0, p: 2 }}>
              <Typography>{currentAlert.message}</Typography>
            </DialogContent>
          </Paper>
        </Dialog>
      )}
    </>
  );
}
