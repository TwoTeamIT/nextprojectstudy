"use server";

import PageHeader from "@/components/PageHeader/PageHeader";
import { Locale } from "@/i18n-config";
import { getDictionary } from "@/lib/get-dictionary";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const masterDict = await getDictionary(lang);
  const dict = { ...masterDict.DashboardPage };

  return (
    <>
      <PageHeader title={dict.Title} />
    </>
  );
}
