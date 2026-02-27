import { logout } from "@/data/auth/auth";
import { Logout, Person, LiveHelp } from "@mui/icons-material";
import it from "@/dictionaries/it.json";
import en from "@/dictionaries/en.json";
import { Locale } from "@/i18n-config";

export type UserMenuItem = {
  key: string;
  name: string;
  icon?: JSX.Element;
  action?: () => Promise<void> | void;
  href?: string;
  isLogout?: boolean;
};

export const UserMenuItems = (lang: Locale): UserMenuItem[] => {
  const dictionaries = { it, en };

  return [
    {
      key: "profile",
      name: dictionaries[lang]?.UserMenu?.Profile || "Profile",
      icon: <Person />,
      href: "/profile",
    },
    {
      key: "test",
      name: dictionaries[lang]?.UserMenu?.ReportBug || "Report a problem",
      icon: <LiveHelp />,
      href: "/reportbug",
    },
    {
      key: "logout",
      name: dictionaries[lang]?.UserMenu?.Logout || "Logout",
      icon: <Logout color="secondary" />,
      action: async () => await logout(),
      isLogout: true,
    },
  ];
};
