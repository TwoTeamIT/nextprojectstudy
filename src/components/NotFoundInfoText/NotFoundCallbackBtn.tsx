"use client";

import Link from "next/link";
import { Button } from "@mui/material";
import { SidebarItems } from "../Navigation/configs/sidebar-configs";
import { Locale } from "@/i18n-config";

export default function NotFoundCallbackBtn({ lang }: { lang: Locale }) {
  const homePageItem = SidebarItems(lang).find((s) => s.isHomePage)!;

  return (
    <Button color="primary" variant="contained">
      <Link key={`${homePageItem.name}-navigate`} href={homePageItem.href}>
        Go to {homePageItem.name}
      </Link>
    </Button>
  );
}
