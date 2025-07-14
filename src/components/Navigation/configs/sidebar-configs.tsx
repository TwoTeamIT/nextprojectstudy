"use client";

import {
  Dashboard,
  EmojiEvents,  //qui vanno importate le immagini dalla MUi icons che voglio usare
  EventNote,
  GraphicEq,
  Timeline,
} from "@mui/icons-material";
import { usePathname } from "next/navigation";
import it from "@/dictionaries/it.json";
import en from "@/dictionaries/en.json";
import { Locale } from "@/i18n-config";

export type SidebarItem = {
  key: string;
  name: string;
  href: string;
  icon: JSX.Element;
  active: boolean;
  isHomePage?: boolean;
};

export const SidebarItems = (lang: Locale): SidebarItem[] => {
  const pathname = usePathname();
  const dictionaries = { it, en };

  function isSidebarItemActive(pathname: string, nav: string) {
    return pathname.includes(nav);
  }

  return [
    {
      key: "dashboard",
      name: dictionaries[lang]?.Sidebar?.Dashboard || "Dashboard",
      href: "/dashboard",
      icon: <Dashboard />,
      active: isSidebarItemActive(pathname, "/dashboard"),
      isHomePage: true,
    },
    {
      key: "graphs",
      name: dictionaries[lang]?.Sidebar?.Graphs || "graphs",
      href: "/graphs",
      icon: <GraphicEq />,
      active: isSidebarItemActive(pathname, "/graphs"),
      isHomePage: true,
    },
    {
      key: "circuits",
      name: dictionaries[lang]?.Sidebar?.Circuits || "Circuits",
      href: "/circuits",
      icon: <EmojiEvents />,  //questo fa riferimento all'import in testata della MUI
      active: isSidebarItemActive(pathname, "/circuits"),
      isHomePage: true,
    },
    {
      key: "calendar",
      name: dictionaries[lang]?.Sidebar?.Calendar || "Calendar",
      href: "/calendar",
      icon: <EventNote />,  //questo fa riferimento all'import in testata della MUI
      active: isSidebarItemActive(pathname, "/calendar"),
      isHomePage: true,
    },
    {
      key: "audits",
      name: dictionaries[lang]?.Sidebar?.Audits || "Audits",
      href: "/audits",
      icon: <Timeline />,
      active: isSidebarItemActive(pathname, "/audits"),
    },
  ];
};
