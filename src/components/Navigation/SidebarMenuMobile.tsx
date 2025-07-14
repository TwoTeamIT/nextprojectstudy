import Link from "next/link";
import { SidebarItem } from "./configs/sidebar-configs";
import { Icon, Typography, useTheme } from "@mui/material";

type SidebarMenuMobileProps = {
  sidebarItems: SidebarItem[];
  onClickCallback: () => void;
};

export default function SidebarMenuMobile({
  sidebarItems,
  onClickCallback,
}: SidebarMenuMobileProps) {
  const primaryColor = useTheme().palette.primary.main;

  const values = primaryColor.match(/\w\w/g);
  const [r, g, b] = values!.map((k) => parseInt(k, 16));
  const bgColor = `rgba( ${r}, ${g}, ${b}, 0.1 )`;

  const handleCallbackClick = () => setTimeout(onClickCallback, 300);

  return (
    <>
      {sidebarItems.map((item, index) => (
        <Link
          key={`${item.name}-${index}`}
          href={item.href}
          className={`transition-all duration-500 ease-in-out w-full m-0 mb-2 px-2 rounded-lg`}
          style={{
            backgroundColor: item.active ? bgColor : undefined,
            width: item.active ? "100%" : "0",
          }}
          onClick={handleCallbackClick}
        >
          <div
            className={`w-full flex felx-row align-center items-center gap-4 leading-4 transition-all duration-500 ease-in-out justify-start py-2`}
          >
            <Icon color={item.active ? "primary" : "inherit"}>{item.icon}</Icon>
            <Typography
              variant="h6"
              color={item.active ? primaryColor : "textPrimary"}
              className={`p-0 m-0 leading-4 transition-all duration-500 `}
            >
              {item.name}
            </Typography>
          </div>
        </Link>
      ))}
    </>
  );
}
