"use server";

import { Box, Container, Typography, Button } from "@mui/material";

import { MemoizedLoginForm } from "./form";
import Logo from "@/components/styles/Icons/Logo";
import { getDictionary } from "@/lib/get-dictionary";
import { Locale } from "@/i18n-config";
import { DEBUG } from "@/configs";

export default async function LoginPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;

  const dict = (await getDictionary(lang)).LoginPage;

  let langPath = "ww/en";
  if (lang === "it") langPath = "it/it";
  if (DEBUG) {
    console.log("LoginPage", langPath);
  }
  return (
    <Container maxWidth="xl">
      <Box
        className="pt-8 md:pt-16 h-svh gap-10"
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box
          className="gap-7 md:gap-16"
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "start",
            alignItems: "center",
          }}
        >
          <Logo size={60} />
          <Typography variant="h3" className="text-lg md:text-3xl">
            {dict.Title}
          </Typography>
          <MemoizedLoginForm
            buttonLabel={dict.LoginBtn}
            submittingLabel={dict.SubmittingBtn}
            emailLabel={dict.Email}
            passwordLabel={dict.Password}
            forgotLabel={dict.ForgotPassword}
            hideLabel={dict.HidePassword}
            showLabel={dict.ShowPassword}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "95%",
            paddingBlock: 4,
            borderTop: "1px solid rgba(187, 188, 188, 0.5)",
            height: 60,
          }}
        >
          <LinkButton label={dict.TermsOfUse} href="" />
          <LinkButton label={dict.PrivacyPolicy} href={``} />
          <LinkButton label={dict.CookiesPolicy} href={``} />
        </Box>
      </Box>
    </Container>
  );
}

function LinkButton({ label, href }: { label: string; href: string }) {
  return (
    <Button
      title={label}
      variant="text"
      href={href}
      sx={{
        color: "#666666",
        fontFamily: "var(--font-bold-it)",
        ":hover": { backgroundColor: "transparent" },
      }}
      size="small"
    >
      {label}
    </Button>
  );
}
