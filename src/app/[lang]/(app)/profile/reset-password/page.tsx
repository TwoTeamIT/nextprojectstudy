"use server";

import { Locale } from "@/i18n-config";
import { getDictionary } from "@/lib/get-dictionary";
import PageHeader from "@/components/PageHeader/PageHeader";
import { Container } from "@mui/material";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import { Person } from "@mui/icons-material";
import { ResetPasswordForm } from "./form";

interface ResetPasswordPageProps {
  params: Promise<{ lang: Locale }>;
}

export default async function ResetPasswordPage({
  params,
}: ResetPasswordPageProps) {
  const { lang } = await params;

  const masterDict = await getDictionary(lang);
  const dict = {
    ...masterDict.Std,
    ...masterDict.ResetPasswordPage,
  };

  return (
    <>
      <Breadcrumbs
        element={{ icon: <Person />, name: dict.Profile }}
        baseLink="/profile"
        label={"Reset Password"}
        lang={lang}
      />
      <PageHeader key="reset-password-page" title={dict.Title} />
      <Container maxWidth="lg" className="my-4">
        <ResetPasswordForm
          submitLabel={dict.Submit}
          submittingLabel={dict.Submitting}
          cancelLabel={dict.Cancel}
          passwordMismatchError={dict.PasswordMismatchError}
          passwordTooShortError={dict.PasswordTooShortError}
        />
      </Container>
    </>
  );
}
