"use client";

import { MouseEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Locale } from "@/i18n-config";
import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import { ExpandMore, MoreHoriz, Translate } from "@mui/icons-material";
import { createLanguageSession } from "@/data/lang/stateless-session";

type LanguageSwitchProps = {
  className?: string | undefined;
  type?: "desktop" | "mobile";
};

export default function LanguageSwitch({
  className,
  type = "desktop",
}: LanguageSwitchProps) {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  const changeLanguage = async (lang: Locale) => {
    const currentPath = window.location.pathname;
    const windowLang = currentPath.split("/")[1];
    const updatedPath = currentPath.replace(`/${windowLang}`, `/${lang}`);
    if (currentPath === updatedPath) return;

    const cookieEndDate = new Date();
    cookieEndDate.setDate(new Date().getDate() + 365);

    await createLanguageSession(lang, cookieEndDate.toISOString());
    router.replace(updatedPath);
  };

  if (!isClient) return null;

  const currentLang =
    window.location.pathname.split("/")[1] === "en" ? "English" : "Italiano";

  return (
    <>
      {type === "desktop" ? (
        <div className={className}>
          <Button
            id="language-select-menu-button"
            aria-controls={open ? "language-select-menu-button" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            variant={type === "desktop" ? "outlined" : "text"}
            size="small"
            sx={{ padding: "0.6rem 1rem", borderColor: "#ccc" }}
            disableElevation
            onClick={handleClick}
            startIcon={<Translate />}
            endIcon={
              <ExpandMore
                className={`transition-all duration-500 ${
                  open ? "rotate-180" : "rotate-0"
                }`}
              />
            }
          >
            {currentLang}
          </Button>
        </div>
      ) : (
        <>
          <Stack
            direction="row"
            spacing={3}
            sx={{ alignItems: "center", justifyContent: "space-between" }}
          >
            <Box className="flex gap-3 items-center">
              <Translate color="primary" />
              <Typography variant="body1" fontSize={18}>
                {currentLang}
              </Typography>
            </Box>
            <IconButton
              id="language-select-menu-button"
              aria-controls={open ? "language-select-menu-button" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
              size="large"
            >
              <MoreHoriz className={`mr-2`} />
            </IconButton>
          </Stack>
        </>
      )}
      <Menu
        id="language-select-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: type === "mobile" ? "bottom" : "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={() => changeLanguage("en")}>English</MenuItem>
        <MenuItem onClick={() => changeLanguage("it")}>Italiano</MenuItem>
      </Menu>
    </>
  );
}
