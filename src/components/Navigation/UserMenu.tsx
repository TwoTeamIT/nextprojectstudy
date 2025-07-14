"use client";

import {
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import { MouseEvent, useState } from "react";
import { UserMenuItems } from "./configs/user-menu-configs";
import { useRouter } from "next/navigation";
import { stringAvatar } from "@/lib/avatarFormatter";
import { useSession } from "@/context/SessionContext";
import { Locale } from "@/i18n-config";
import { toCapitalize } from "@/lib/stringHelper";
import it from "@/dictionaries/it.json";
import en from "@/dictionaries/en.json";

export default function UserMenu({ lang }: { lang: Locale }) {
  const { session } = useSession();
  const userMenuItems = UserMenuItems(lang);
  const router = useRouter();
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const dictionaries = { it, en };

  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) =>
    setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  return (
    <>
      <Tooltip title={dictionaries[lang].UserMenu.Tooltip}>
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <Avatar
            {...stringAvatar(
              toCapitalize(
                session
                  ? session.user.firstName && session.user.lastName
                    ? `${session.user.firstName} ${session.user.lastName}`
                    : session.user.firstName ||
                    session.user.lastName
                  : "Unknown"
              )
            )}
            alt="Avatar"
          /*src="/static/images/avatar/2.jpg"*/
          />
        </IconButton>
      </Tooltip>
      <Menu
        sx={{ mt: "45px" }}
        id="user-menu"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        {userMenuItems.map((item) => (
          <MenuItem
            key={item.key}
            className={`w-full flex flex-row gap-3 content-start ${item.key === "logout"
                ? "border-solid border-t border-y-stone-300 mt-2 pt-2 "
                : ""
              }`}
            onClick={() => {
              if (item.href) return router.push(item.href);
              return item.action?.();
            }}
          >
            {item.icon}
            <Typography
              color={item.key === "logout" ? "primary" : "textPrimary"}
              sx={{ textAlign: "center" }}
            >
              {item.name}
            </Typography>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
