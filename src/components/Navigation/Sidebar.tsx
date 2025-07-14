"use client";

import { Drawer, IconButton, useColorScheme } from "@mui/material";
import { useEffect, useState } from "react";
import { SidebarItems } from "./configs/sidebar-configs";
import SidebarMenu from "./SidebarMenu";
import { Close, Menu } from "@mui/icons-material";
import {
  getSidebarSession,
  updateSidebarSession,
} from "@/data/sidebar/stateless-session";
import { Locale } from "@/i18n-config";

const widthFull = "16.5%";
const widthClosed = "60px";
const maxWidth = "15rem"; // ~240px
const minWidth = "200px";

export default function Sidebar({ lang }: { lang: Locale }) {
  const sidebarItems = SidebarItems(lang);
  const { mode } = useColorScheme();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState<boolean>(true);

  const toggleSidebar = async () => {
    const newOpen = !open;
    setOpen(newOpen);
    await updateSidebarSession(newOpen);
  };

  useEffect(() => {
    const syncWithSession = async () => {
      const session = await getSidebarSession();
      if (session?.sidebarExpanded !== undefined)
        setOpen(session.sidebarExpanded);
    };

    syncWithSession();
    setMounted(true);
  }, []);

  return (
    <Drawer
      variant="permanent"
      open={open}
      sx={{
        zIndex: (theme) => theme.zIndex.appBar - 1,
        width: open ? widthFull : widthClosed,
        ...(open ? { minWidth, maxWidth } : { minWidth: widthClosed }),
        transition: "width 0.5s",
        transitionBehavior: "allow-discrete",
        transitionDuration: "500ms",
        "& .MuiDrawer-paper": {
          width: open ? widthFull : widthClosed,
          ...(open ? { minWidth, maxWidth } : { minWidth: widthClosed }),
          transition: "width 0.6s",
          top: 64,
          paddingTop: "2px",
          ...(mode === "dark" && {
            borderRight: "1px solid",
            backgroundColor: "inherit",
          }),
          transitionBehavior: "allow-discrete",
          transitionDuration: "500ms",
        },
      }}
      className={`hidden sm:flex transition-all duration-500 ${
        mode === "light" && "border-r"
      }`}
    >
      <div
        className={`w-full flex border-b ${
          open ? "justify-end" : "justify-center"
        }`}
      >
        <IconButton onClick={toggleSidebar}>
          {open ? <Close /> : <Menu />}
        </IconButton>
      </div>
      <SidebarMenu
        key={"sidebar-menu"}
        mounted={mounted}
        sidebarExpanded={open}
        sidebarItems={sidebarItems}
        mode={mode === "dark" ? "dark" : "light"}
      />
    </Drawer>
  );
}
