"use server";

import { Locale } from "@/i18n-config";
import { getDictionary } from "@/lib/get-dictionary";
import { Container } from "@mui/material";
import { ResetForgottenPasswordForm } from "./form";
import { checkResetTokenValidity } from "@/data/user/user";
import { AlertOptions } from "@/context/Alerter";
import AlertObserver from "@/context/AlertObserver";

interface ForgotPasswordPageProps {
  params: Promise<{ resetToken: string; lang: Locale }>;
}

export default async function ForgotPasswordPage({
  params,
}: ForgotPasswordPageProps) {
  const { resetToken, lang } = await params;
  

  const masterDict = await getDictionary(lang);
  const dict = { ...masterDict.Std, ...masterDict.ResetPasswordPage };

  await checkResetTokenValidity(resetToken).then((res) => {
    const { success, error } = res;
    if (success || error === undefined) return;

    try {
      const parsedAlert = JSON.parse(error);
      const alert: AlertOptions = {
        title: parsedAlert.title || "Error",
        message: parsedAlert.message || "An error has occurred",
        severity: parsedAlert.severity,
        variant: parsedAlert.variant,
      };

      AlertObserver.notify(alert);
    } catch (err) {
      console.error("Error parsing message:", err);
    }
  });

  return (
    <>
      <Container maxWidth="sm" className="mt-28 content-center">
        <div>
          <ResetForgottenPasswordForm
            title={dict.Title}
            submitLabel={dict.Submit}
            submittingLabel={dict.Submitting}
            cancelLabel={dict.GoBack}
            passwordMismatchError={dict.PasswordMismatchError}
            resetToken={resetToken}
          />
        </div>
      </Container>
    </>
  );
}
