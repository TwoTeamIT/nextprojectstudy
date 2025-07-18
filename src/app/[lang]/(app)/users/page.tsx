"use server";

import PageHeader from "@/components/PageHeader/PageHeader";
import DataGridUser from "@/components/DataGridUser/DataGridClient";
import { Locale } from "@/i18n-config";
import { getDictionary } from "@/lib/get-dictionary";
import { getAllDemoUsers } from "@/data/user/user";
import { UserRowSchema } from "@/data/user/definitions";
import { generateColumnsFromZodSchema } from "@/components/DataGrid/ColumnsGenerator";
import DataGridGenerator from "@/components/DataGrid/DataGridGenerator";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const masterDict = await getDictionary(lang);
  const dict = { ...masterDict.Std, ...masterDict.User };

  const data = await getAllDemoUsers();

  return (
    <>
      <PageHeader
        title={dict.Title}
        addCta={{ label: dict.AddUser, href: "/users/new" }}
      />
      <div className="flex flex-col mt-3 h-[86%]">
        <DataGridUser />
      </div>

      <div className="flex flex-col mt-3 h-[86%]">
        <DataGridGenerator
          data={data}
          columns={generateColumnsFromZodSchema(UserRowSchema, [
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
          viewDetails={{ baseRoute: "users", detailsLabel: dict.ViewDetails }}
        />
      </div>
    </>
  );
}
