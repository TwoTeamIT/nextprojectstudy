import Link from "next/link";
import { SidebarItem } from "./configs/sidebar-configs";
import { Icon, Skeleton, Typography, useTheme, Box } from "@mui/material";

type SidebarMenuProps = {
  mounted: boolean;
  sidebarExpanded: boolean;
  sidebarItems: SidebarItem[];
  mode: "dark" | "light";
};

export default function SidebarMenu({
  mounted,
  sidebarExpanded,
  sidebarItems,
  mode,
}: SidebarMenuProps) {
  const { palette } = useTheme();

  if (!mounted)
    return (
      <>
        <Skeleton variant="rounded" height={30} className="mx-6 my-3" />
        <Skeleton variant="rounded" height={20} className="mx-6 my-3" />
        <Skeleton variant="rounded" height={30} className="mx-6 my-3" />
        <Skeleton variant="rounded" height={20} className="mx-6 my-3" />
        <Skeleton variant="rounded" height={30} className="mx-6 my-3" />
      </>
    );

  const primaryColor = palette.primary.main;
  const bgColorTheme =
    mode === "dark" ? palette.primary.light : palette.primary.main;
  const values = bgColorTheme.match(/\w\w/g);
  const [r, g, b] = values!.map((k) => parseInt(k, 16));
  const bgColor = `rgba( ${r}, ${g}, ${b}, 0.1 )`;

  const transitionClass = "transition-all duration-500 ease-in-out";
  return (
    <>
      {sidebarItems.map((item, index) => (
        <Link
          key={`${item.key}-${index}`}
          href={item.href}
          className={`${transitionClass} relative overflow-hidden ${
            sidebarExpanded
              ? `w-full h-10 border-b-2`
              : "border-2 h-[50px] w-max mx-auto my-2 p-1 rounded-full"
          }`}
          style={{ borderColor: item.active ? primaryColor : undefined }}
        >
          {sidebarExpanded && (
            <div
              className="absolute h-full ms-2 rounded-lg transition-all duration-200 delay-100 ease-in-out"
              style={{
                backgroundColor: item.active ? bgColor : undefined,
                width: item.active ? "100%" : "0",
              }}
            />
          )}
          <Box
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "row",
              columnGap: 1.5,
              alignItems: "center",
              marginInlineStart: sidebarExpanded ? 0.5 : 0,
              paddingInlineStart: sidebarExpanded ? 2 : 1,
              paddingInlineEnd: sidebarExpanded ? 0 : 1,
            }}
          >
            {sidebarExpanded && (
              <div
                className={`border-2 rounded-full transition-all duration-500 ${
                  item.active ? "w-1 h-8" : "w-0 h-0"
                }`}
                style={{
                  borderColor: item.active ? primaryColor : "transparent",
                  backgroundColor: item.active ? primaryColor : "transparent",
                }}
              />
            )}

            <Box
              sx={{
                height: "100%",
                flexGrow: 1,
                display: "flex",
                columnGap: 3,
                alignItems: "center",
              }}
            >
              <Icon
                className={`w-max p-0 m-0 ${transitionClass}`}
                color={item.active ? "primary" : "inherit"}
              >
                <div className="-translate-y-[22.5%]">{item.icon}</div>
              </Icon>
              {sidebarExpanded && (
                <Typography
                  variant="h6"
                  color={item.active ? primaryColor : "textPrimary"}
                  className={`${transitionClass}`}
                >
                  {item.name}
                </Typography>
              )}
            </Box>
          </Box>
        </Link>
      ))}
    </>
  );
}
