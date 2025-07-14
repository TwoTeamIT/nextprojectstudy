"use client";

import { Add } from "@mui/icons-material";
import { Box, Button, ButtonGroup, Toolbar, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

type PageHeaderProps = {
  title: string;
  size?: "small" | "medium";
  cta?: React.ReactNode[] | JSX.Element[] | undefined;
  addCta?: { label: string; href: string } | undefined;
};

export default function PageHeader({
  title,
  size = "medium",
  cta = undefined,
  addCta = undefined,
}: PageHeaderProps) {
  const router = useRouter();

  return (
    <Toolbar
      variant={size === "medium" ? "regular" : "dense"}
      className={`border-b ${size === "medium" ? "mt-1" : "m-0"}`}
    >
      <Typography
        variant={size === "medium" ? "h5" : "h6"}
        sx={{ flexGrow: 1 }}
      >
        {title}
      </Typography>
      {(cta || addCta) && (
        <>
          <Box sx={{ flexGrow: 1 }} />
          <ButtonGroup key="header-button-group" variant="text">
            {addCta && (
              <Button
                variant="contained"
                sx={{ padding: "0.8rem 1.2rem" }}
                startIcon={<Add />}
                onClick={() => router.push(addCta.href)}
              >
                {addCta.label}
              </Button>
            )}
            {cta && cta.map((el) => el)}
          </ButtonGroup>
        </>
      )}
    </Toolbar>
  );
}
