"use server";

import PageHeader from "@/components/PageHeader/PageHeader";
import SnackbarClient from "@/components/SnackBar/SnackbarClient";
import { Locale } from "@/i18n-config";
import { getDictionary } from "@/lib/get-dictionary";


export default async function SnackBarPage({
}: {
    params: Promise<{ lang: Locale }>;
}) {
    //const { lang } = await params;
    const masterDict = await getDictionary("it");
    const dict = { ...masterDict.Std, ...masterDict.SnackBar };

    return (
        <>
            <PageHeader
                title={dict.Title}

            />
            <div className="flex flex-col mt-3 h-[86%]">
                <SnackbarClient />
            </div>


        </>
    );
}
