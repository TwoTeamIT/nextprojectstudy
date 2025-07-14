'use server'


import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import PageHeader from "@/components/PageHeader/PageHeader";
import { DEBUG } from "@/configs";
import { Locale } from "@/i18n-config";
import { getDictionary } from "@/lib/get-dictionary";

type EventDetailPageProps = {
    params: Promise<{ idE: string; lang: Locale }>;
}


export default async function EventDetailPage({
    params,
}: EventDetailPageProps) {

    const { idE, lang } = await params;
    if (DEBUG) {
        console.log("EventDetailPage", idE, lang);
    }
    const masterDict = await getDictionary(lang);
    const dict = { ...masterDict.Std, ...masterDict.CalendarPage };

    return (
        <>
            <Breadcrumbs
                lang={lang}
                baseLink="/calendar"
                label="enevt name" //|| dict.New}
            />
            <PageHeader
                title={dict.CalendarDetailTitle}
            />
            <div className="h-4" />
        </>
    );

}