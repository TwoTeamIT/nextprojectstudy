"use client";

import React from "react";
import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import ThemeSwitcher from "../styles/ThemeSwitcher";
import Logo from "../styles/Icons/Logo";
import Link from "next/link";
import UserMenu from "./UserMenu";
import MobileMenu from "./MobileMenu";
import LanguageSwitch from "../LanguageSwitch/LanguageSwitch";
import { SessionProvider } from "@/context/SessionContext";
import { Locale } from "@/i18n-config";
import { TITLE } from "@/configs";

export default function Navbar({ lang }: { lang: Locale }) {
  return (
    <SessionProvider>
      <AppBar position="sticky" color="inherit" className="border-b">
        {/* <Container maxWidth="xl"> */}
        <Toolbar>
          <MobileMenu lang={lang} />
          <Box sx={{ flexGrow: 1 }} className="sm:hidden" />

          <Link className="flex" href="/dashboard">
            <Logo className="mr-4" />
            <div className="items-baseline hidden sm:flex">
              <Typography variant="h4" noWrap>
                {TITLE}
              </Typography>
            </div>
          </Link>
          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ display: "flex", columnGap: "1rem" }}>
            <LanguageSwitch className="hidden sm:block" />
            <ThemeSwitcher lang={lang} className="hidden sm:block" />
            <UserMenu lang={lang} />
          </Box>
        </Toolbar>
        {/* </Container> */}
      </AppBar>
    </SessionProvider>
  );
}
