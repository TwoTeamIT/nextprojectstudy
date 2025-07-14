'use server'

import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import PageHeader from "@/components/PageHeader/PageHeader";
import { getCircuitById } from "@/data/circuits/circuits";
import { Locale } from "@/i18n-config";
import { getDictionary } from "@/lib/get-dictionary";
import { CircuitDetailsForm } from "./form";

type CircuitDetailPageProps = {
    params: Promise<{ idC: string; lang: Locale }>;
}


export default async function CircuitDetailPage({
    params,
}: CircuitDetailPageProps) {
    const { idC, lang } = await params;
    const masterDict = await getDictionary(lang);
    const dict = { ...masterDict.Std, ...masterDict.CircuitPage };


    const circuitDetail = idC === 'new' ? null : await getCircuitById(parseInt(idC)); // Assuming this function fetches the circuit details by ID

    return (
        <>
            <Breadcrumbs
                lang={lang}
                baseLink="/circuits"
                label={circuitDetail?.name || dict.New}
            />
            <PageHeader
                title={dict.CircuitDetailTitle}
            />
            <div className="h-4" />
            <CircuitDetailsForm
                cancelLabel={dict.Cancel}
                submitLabel={dict.Save}
                submittingLabel={dict.Save} //saving mi piaceva
                lang={lang}
                key='circuitform' //deve essere senza maiuscole , ne spazi
                circuit={circuitDetail}
            />
        </>
    );
}
