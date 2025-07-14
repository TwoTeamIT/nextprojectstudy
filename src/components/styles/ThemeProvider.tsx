"use client";
import { CssBaseline, ThemeProvider as MuiThemeProvider } from "@mui/material";
import { theme } from "./theme";
import { Toaster } from "@/context/Toaster";
import { Alerter } from "@/context/Alerter";

type ThemeProviderProps = {
  children: React.ReactNode | JSX.Element;
};

export default function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <MuiThemeProvider theme={theme} defaultMode="light">
      <CssBaseline />
      {children}
      <Toaster key={"toaster"} />
      <Alerter key={"alerter"} />
    </MuiThemeProvider>
  );
}
