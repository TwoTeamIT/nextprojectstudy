"use client";

import { Breadcrumbs as B, Tooltip, Typography } from "@mui/material";
import Link from "next/link";
import { SidebarItems } from "../Navigation/configs/sidebar-configs";
import { useRouter } from "next/navigation";
import { Locale } from "@/i18n-config";

export default function Breadcrumbs({
  element,
  baseLink,
  navigation,
  label,
  lang,
}: {
  element?: { icon: JSX.Element | undefined; name: string } | undefined;
  baseLink: string;
  navigation?: { label: string; href: string } | undefined;
  label: string;
  lang: Locale;
}) {
  const router = useRouter();
  const sidebarItems = SidebarItems(lang);
  const item = element
    ? element
    : sidebarItems.find((item) => item.href === baseLink);

  return (
    <div role="presentation" className="mt-4">
      <B aria-label="breadcrumb">
        <Tooltip title={item?.name}>
          <Link
            style={{ display: "flex", alignItems: "center" }}
            href={`${baseLink}`}
          >
            <Typography color="primary" className="flex items-center">
              {item?.icon}
              {item?.name}
            </Typography>
          </Link>
        </Tooltip>
        {navigation && (
          <Tooltip
            key={navigation.label.toLowerCase().replaceAll(" ", "")}
            title={navigation.label}
            onClick={() => router.back()}
            sx={{ cursor: "pointer" }}
          >
            <Typography color="primary" className="flex items-center">
              {navigation.label}
            </Typography>
          </Tooltip>
        )}
        <Typography sx={{ display: "flex", alignItems: "center" }}>
          {label}
        </Typography>
      </B>
    </div>
  );
}
