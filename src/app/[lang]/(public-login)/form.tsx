"use client";

import { useFormStatus } from "react-dom";
import {
  Box,
  Button,
  Link,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { login } from "@/data/auth/auth";
import { useActionState, useEffect, useState } from "react";
import { VisibilityOffOutlined, VisibilityOutlined } from "@mui/icons-material";
import React from "react";
import AlertObserver from "@/context/AlertObserver";

type LoginFormProps = {
  forgotLabel: string;
  buttonLabel: string;
  submittingLabel: string;
  emailLabel: string;
  passwordLabel: string;
  showLabel: string;
  hideLabel: string;
};

export function LoginForm({
  forgotLabel,
  buttonLabel,
  submittingLabel,
  emailLabel,
  passwordLabel,
  showLabel,
  hideLabel,
}: LoginFormProps) {
  const [state, action] = useActionState(login, undefined);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (state?.message) {
      const errorMessage = state?.message;

      try {
        const parsedMessage = JSON.parse(errorMessage);
        const alert = {
          title: parsedMessage.title || "Login Error",
          message: parsedMessage.message || "Please check your credentials.",
          severity: parsedMessage.severity || "error",
        };

        AlertObserver.notify(alert);
      } catch (err) {
        console.error("Error parsing message:", err);
      }
    }
  }, [state?.errors, state?.message]);

  return (
    <form action={action}>
      <Box
        className="gap-6 md:gap-10"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: "95vw",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            width: "80%",
            maxWidth: "480px",
          }}
        >
          <TextField
            id="email"
            name="email"
            type="email"
            fullWidth
            label={emailLabel}
            title={emailLabel}
            autoComplete="none"
            variant="standard"
            sx={{
              textTransform: "uppercase",
            }}
          />
          {state?.errors?.email && (
            <Typography variant="subtitle2" color="#cc0000">
              {state.errors.email}
            </Typography>
          )}
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            width: "80%",
            maxWidth: "480px",
          }}
        >
          <Box
            sx={{
              width: "100%",
              justifyContent: "space-between",
              alignItems: "baseline",
              position: "relative",
            }}
          >
            <TextField
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              fullWidth
              label={passwordLabel}
              title={passwordLabel}
              autoComplete="none"
              variant="standard"
              sx={{
                textTransform: "uppercase",
              }}
            />
            <div
              className="absolute top-[60%] -translate-y-1/2 right-[5px] cursor-pointer"
              onClick={() => setShowPassword((s) => !s)}
            >
              <Tooltip title={showPassword ? hideLabel : showLabel}>
                {showPassword ? (
                  <VisibilityOffOutlined />
                ) : (
                  <VisibilityOutlined />
                )}
              </Tooltip>
            </div>
          </Box>
          {state?.errors?.password && (
            <Typography variant="subtitle2" color="#cc0000">
              {state.errors.password}
            </Typography>
          )}
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 1,
            width: "80%",
            maxWidth: "480px",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 5,
          }}
        >
          <Link
            href="/forgot-password"
            color="textPrimary"
            fontFamily={"var(--font-regular)"}
            fontSize={14}
          >
            {forgotLabel}
          </Link>
          <LoginButton login={buttonLabel} submitting={submittingLabel} />
        </Box>
        {/* {state?.message && <p className="text-sm">{state.message}</p>} */}
      </Box>
    </form>
  );
}

export function LoginButton({
  login,
  submitting,
}: {
  login: string;
  submitting: string;
}) {
  const { pending } = useFormStatus();

  return (
    <Button
      aria-disabled={pending}
      type="submit"
      color="primary"
      variant="contained"
      fullWidth
      sx={{ maxWidth: "40%", marginRight: "15px" }}
    >
      {pending ? submitting : login}
    </Button>
  );
}

export const MemoizedLoginForm = React.memo(LoginForm);
