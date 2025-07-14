"use client";

import React, { useState, useCallback, useEffect } from "react";
import {
  Snackbar,
  Alert,
  AlertColor,
  Typography,
  Paper,
  AlertTitle,
  LinearProgress,
  useTheme,
  AlertProps,
} from "@mui/material";
import ToastObserver from "./ToastObserver";
import { DEBUG } from "@/configs";

export type Toast = {
  id: string;
  title?: string;
  message: string;
  severity?: AlertColor; // "success" | "error" | "warning" | "info"
  durationMs?: number;
  variant?: AlertProps["variant"];
};

export type ToastOptions = {
  message: string;
  severity?: AlertColor;
  title?: string;
  durationMs?: number;
  variant?: AlertProps["variant"];
};

export function Toaster() {
  const { success, error, warning, info } = useTheme().palette;
  const palette = {
    success: success.main,
    error: error.main,
    warning: warning.main,
    info: info.main,
  };

  const autoHideDuration = 5000;
  const [queue, setQueue] = useState<Toast[]>([]);
  const [currentToast, setCurrentToast] = useState<Toast | null>(null);

  const [progress, setProgress] = useState(100);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const showToast = useCallback(
    ({
      message,
      severity = "info",
      title,
      durationMs = autoHideDuration,
      variant = "outlined",
    }: ToastOptions) => {
      const id = Date.now().toString();
      setQueue((prev) => [
        ...prev,
        { id, open: true, title, message, severity, durationMs, variant },
      ]);
    },
    []
  );

  const handleClose = useCallback(() => {
    setCurrentToast(null);
    setProgress(100);
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  }, [intervalId]);

  useEffect(() => {
    if (!currentToast && queue.length > 0) {
      const nextToast = queue[0];
      setCurrentToast(nextToast);
      setQueue((prev) => prev.slice(1));
      setProgress(100);

      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const newProgress =
          100 - (elapsed / (nextToast.durationMs || autoHideDuration)) * 100;
        if (newProgress <= 0) {
          handleClose();
          clearInterval(interval);
        } else setProgress(newProgress);
      }, 50);

      setIntervalId(interval);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [currentToast, queue, handleClose, intervalId]);

  useEffect(() => {
    if (DEBUG) console.log("Toaster montato!");

    const observerFunction = (toast: ToastOptions) => {
      if (DEBUG) console.log("Toast ricevuto in Toaster:", toast);
      showToast(toast);
    };

    ToastObserver.subscribe(observerFunction);
    if (DEBUG) console.log("Sottoscritto a ToastObserver!");

    return () => {
      if (DEBUG) console.log("Toaster smontato, annullata sottoscrizione!");
      ToastObserver.unsubscribe(observerFunction);
    };
  }, [showToast]);

  return (
    <>
      {currentToast && (
        <Snackbar
          open={!!currentToast}
          autoHideDuration={autoHideDuration}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Paper
            sx={{
              borderColor: palette[currentToast.severity || "success"],
              borderWidth: "2px",
              borderBottomWidth: 0,
            }}
            elevation={3}
          >
            <Alert
              onClose={handleClose}
              severity={currentToast.severity}
              sx={{
                ...{
                  width: "100%",
                  borderBottomRightRadius: "0px",
                  borderBottomLeftRadius: "0px",
                },
                ...(!currentToast.title && { alignItems: "center" }),
              }}
              variant={currentToast.variant}
            >
              {currentToast.title && (
                <AlertTitle>{currentToast.title}</AlertTitle>
              )}
              <Typography>{currentToast.message}</Typography>
            </Alert>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: "5px",
                borderBottomRightRadius: "2px",
                borderBottomLeftRadius: "2px",
              }}
              color={currentToast.severity}
            />
          </Paper>
        </Snackbar>
      )}
    </>
  );
}
