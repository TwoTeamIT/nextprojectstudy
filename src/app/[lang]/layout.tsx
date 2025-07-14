import type { Metadata } from "next";
import { type Locale } from "../../i18n-config";
import "./globals.css";
import ThemeProvider from "@/components/styles/ThemeProvider";
import { fontBd, fontButton, fontBdIt, fontExtBd, fontRg } from "../fonts";
import Landing from "./loading";
import MuiXLicense from "@/components/MuiXLicense";
import { TITLE } from "@/configs";

export const metadata: Metadata = {
  title: TITLE,
  description: "description",
};

export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "it" }];
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;

  if (!lang) return <Landing />;

  return (
    <html lang={lang}>
      <body
        className={`
          ${fontBd.variable} ${fontRg.variable} 
          ${fontButton.variable} ${fontBdIt.variable} 
          ${fontExtBd.variable} antialiased`}
      >
        <ThemeProvider>{children}</ThemeProvider>
        <MuiXLicense />
      </body>
    </html>
  );
}
