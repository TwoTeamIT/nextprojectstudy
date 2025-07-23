
import PageHeader from "@/components/PageHeader/PageHeader";
import ListViewClient from "@/components/ListViewClient/ListViewClient";
import { Locale } from "@/i18n-config";

import { getDictionary } from "@/lib/get-dictionary";

export default async function ListViewPage({
    params,
}: {
    params: Promise<{ lang: Locale }>;
}) {


    const { lang } = await params;
    const masterDict = await getDictionary(lang);
    const dict = { ...masterDict.Std, ...masterDict.Listview };

    return (
        <>
            <PageHeader
                title={dict.Title}
            //addCta={{ label: dict.AddUser, href: "/users/new" }}
            />

            <div style={{ width: "100%", maxWidth: 500, height: 600 }}>
                <ListViewClient />
            </div>

        </>
    );
}
