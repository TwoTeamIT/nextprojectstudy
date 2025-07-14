"use server";

import { generateColumnsFromZodSchema } from "@/components/DataGrid/ColumnsGenerator";
import DataGridGenerator from "@/components/DataGrid/DataGridGenerator";
import PageHeader from "@/components/PageHeader/PageHeader";
import { getAllAudits } from "@/data/audits/audits";
import { Audit } from "@/data/audits/definitions";
import { Locale } from "@/i18n-config";
import { getDictionary } from "@/lib/get-dictionary";

export default async function AuditsPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const masterDict = await getDictionary(lang);
  const dict = { ...masterDict.Std, ...masterDict.AuditsPage };
  const audits = await getAllAudits();

  return (
    <>
      <PageHeader title={dict.Title} />
      <div className="flex flex-col mt-3 h-[86%]">
        <DataGridGenerator
          data={audits}
          columns={generateColumnsFromZodSchema(Audit, [
            "id",
            "auditFilterEvent",
            "requestHeaders",
            "requestConnection",
            "requestPayload",
            "responseResult",
          ])}
          rowIdField="id"
          loading={false}
          lang={lang}
          viewDetails={{ baseRoute: "audits", detailsLabel: dict.ViewDetails }}
        />
      </div>
    </>
  );
}
