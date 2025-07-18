"use server";

import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import PageHeader from "@/components/PageHeader/PageHeader";
import { Locale } from "@/i18n-config";
import { getDictionary } from "@/lib/get-dictionary";

interface GraphDetailPageProps {
  params: Promise<{ idGraph: string; lang: Locale }>;
}

export default async function GraphDetailModal({
  params,
}: GraphDetailPageProps) {
  const { idGraph, lang } = await params;
  const masterDict = await getDictionary(lang);
  const dict = { ...masterDict.Std, ...masterDict.GraphsPage };

  return (
    <>
      <Breadcrumbs
        lang={lang}
        baseLink="/graphs"
        label={dict.New}
      />
      <PageHeader
        title={dict.GraphDetail}
      />
      <div className="flex flex-col mt-3 h-[86%]">
        <p className="text-sm text-gray-500">{idGraph.toString()}</p>
      </div>
    </>
  );
}