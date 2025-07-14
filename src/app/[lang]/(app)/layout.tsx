"use server";

import Navbar from "@/components/Navigation/Navbar";
import ContentContainer from "@/components/ContentContainer/ContentContainer";
import { Locale } from "@/i18n-config";

export default async function AppLayout({
  children,
  modal,
  params,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
  params: Promise<{ lang: Locale }>;
}>) {
  const { lang } = await params;

  return (
    <main style={{ overflow: "hidden", maxHeight: "100vh", width: "100vw" }}>
      <link rel="prefetch" href={`/api/dictionary/${lang}`} />
      <Navbar lang={lang} />
      <ContentContainer lang={lang}>
        <>
          {modal}
          {children}
        </>
      </ContentContainer>
    </main>
  );
}
