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
  const dict = { ...masterDict.Std, ...masterDict.GraphsPage };

  return (
    <>
      <PageHeader
        title={dict.Title}
        addCta={{ label: dict.NewGraph, href: "/graphs/new" }}
      />
      <div className="flex flex-col mt-3 h-[86%]">
        
        </div>
    </>
  );
}
