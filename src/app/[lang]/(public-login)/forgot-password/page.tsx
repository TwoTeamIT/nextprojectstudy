"use server";

import { Locale } from "@/i18n-config";
import { getDictionary } from "@/lib/get-dictionary";
import { Container } from "@mui/material";
import { SendResetLinkForm } from "./form";

interface ForgotPasswordPageProps {
  params: Promise<{ resetToke: string; lang: Locale }>;
}

export default async function ForgotPasswordPage({
  params,
}: ForgotPasswordPageProps) {
  const { lang } = await params;

  const masterDict = await getDictionary(lang);
  const dict = { ...masterDict.Std, ...masterDict.ForgotPasswordPage };

  return (
    <>
      <Container maxWidth="sm" className="mt-28 content-center">
        <div>
          <SendResetLinkForm
            title={dict.Title}
            submitLabel={dict.SendResetLink}
            submittingLabel={dict.Submitting}
            cancelLabel={dict.GoBack}
          />
        </div>
      </Container>
    </>
  );
}
