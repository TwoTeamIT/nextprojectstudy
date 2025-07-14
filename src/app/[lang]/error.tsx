"use client";

import ThemeProvider from "@/components/styles/ThemeProvider";
import { Replay, Undo } from "@mui/icons-material";
import {
  Backdrop,
  Box,
  Button,
  Container,
  Divider,
  Paper,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useState, useCallback, useEffect } from "react";
import { Locale } from "@/i18n-config";
import it from "@/dictionaries/it.json";
import en from "@/dictionaries/en.json";
import { MAX_ERROR_RETRY } from "@/configs";

const dictionaries = {
  it: it.ErrorPage,
  en: en.ErrorPage,
};

export default function Error({
  error,
  reset,
  params,
}: {
  error: Error & { digest?: string };
  reset: () => void;
  params: { lang: Locale };
}) {
  const router = useRouter();
  const [retryCount, setRetryCount] = useState(0);
  const [isLoginPage, setIsLoginPage] = useState(false);

  const dict = dictionaries[params.lang] || dictionaries.en;

  useEffect(() => {
    setIsLoginPage(window.location.pathname.includes("login"));
  }, []);

  const handleGoBack = () =>
    isLoginPage ? router.push("/login") : router.back();

  const handleRetry = useCallback(() => {
    if (retryCount < MAX_ERROR_RETRY) {
      setRetryCount((prev) => prev + 1);
      reset();
    }
  }, [retryCount, reset]);

  return (
    <>
      <ThemeProvider>
        <Backdrop open>
          <Container maxWidth="md">
            <Paper sx={{ padding: 3 }}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <Typography variant="h4">{dict.Title}</Typography>
                <Divider className="my-3" />
                <Typography variant="subtitle1">
                  {dict.Error}: {error.name}
                </Typography>
                <Typography variant="body1">
                  {dict.Message}: {error.message}
                </Typography>
                <Typography variant="body1">
                  {dict.Digest}: {error.digest}
                </Typography>
                <Divider className="my-3" />
                {retryCount >= MAX_ERROR_RETRY && (
                  <Typography variant="caption" color="error">
                    {dict.MaxRetryMessage}
                  </Typography>
                )}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Button
                    variant="outlined"
                    onClick={handleGoBack}
                    startIcon={<Undo />}
                  >
                    {dict.GoBack}
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleRetry}
                    endIcon={<Replay />}
                    disabled={retryCount >= MAX_ERROR_RETRY}
                  >
                    {dict.TryAgain}
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Container>
        </Backdrop>
      </ThemeProvider>
    </>
  );
}
