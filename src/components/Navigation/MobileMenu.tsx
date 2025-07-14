"use client";

import {
  Box,
  ClickAwayListener,
  Drawer,
  IconButton,
  Typography,
} from "@mui/material";
import { Apps } from "@mui/icons-material";
import { MouseEvent, useState } from "react";
import { SidebarItems } from "./configs/sidebar-configs";
import ThemeSwitcher from "../styles/ThemeSwitcher";
import SidebarMenuMobile from "./SidebarMenuMobile";
import LanguageSwitch from "../LanguageSwitch/LanguageSwitch";
import { Locale } from "@/i18n-config";
import { TITLE } from "@/configs";

export default function MobileMenu({ lang }: { lang: Locale }) {
  const sidebarItems = SidebarItems(lang);

  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: MouseEvent<HTMLElement>) =>
    setAnchorElNav(event.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);

  return (
    <div className="sm:hidden">
      <ClickAwayListener onClickAway={handleCloseNavMenu}>
        <Box sx={{ position: "relative" }}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 1 }}
            onClick={handleOpenNavMenu}
          >
            <Apps />
          </IconButton>
          <Drawer
            key={"mobile-menu"}
            variant="temporary"
            open={Boolean(anchorElNav)}
            sx={{
              width: "60%",
              height: "100%",
              transition: "width 0.3s",
              "& .MuiDrawer-paper": {
                width: "60%",
                transition: "width 0.4s",
                paddingTop: "2px",
                borderEndEndRadius: "12px",
                borderStartEndRadius: "12px",
              },
            }}
            hideBackdrop
          >
            <Box
              sx={{
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                rowGap: 2,
                alignItems: "center",
                marginInline: 0,
              }}
            >
              <Typography
                variant="h6"
                noWrap
                className="flex w-full justify-center items-center border-b-2 h-[56px]"
              >
                {TITLE}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  columnGap: "1rem",
                  alignContent: "center",
                  width: "90%",
                }}
              >
                <SidebarMenuMobile
                  sidebarItems={sidebarItems}
                  onClickCallback={handleCloseNavMenu}
                />
              </Box>
              <Box sx={{ flexGrow: 1 }} />
              <Box className="border-t w-full p-4 flex gap-3 flex-col">
                <LanguageSwitch type="mobile" className="w-full" />
                <ThemeSwitcher lang={lang} type="mobile" className="w-full" />
              </Box>
            </Box>
          </Drawer>
        </Box>
      </ClickAwayListener>
    </div>
  );
}
