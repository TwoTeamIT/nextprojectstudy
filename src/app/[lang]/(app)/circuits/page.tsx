"use server";

import PageHeader from "@/components/PageHeader/PageHeader";
import { Locale } from "@/i18n-config";
import { getDictionary } from "@/lib/get-dictionary";
import {
  Download, Upload, Edit,
} from "@mui/icons-material";
import { getAllCircuits } from "@/data/circuits/circuits";
//import DataGridGenerator from "@/components/DataGrid/DataGridGenerator";
//import { generateColumnsFromZodSchema } from "@/components/DataGrid/ColumnsGenerator";
//import { Circuit } from "@/data/circuits/definitions";
import { GetButtonCtaExample } from "@/components/ButtonCtaExample/ButtonCtaExample";
import CircuitDatagrid from "@/components/CircuitDatagrid";

//questo va definito qui (il costruttore automatico me li mette dopo i params della async funcion circuitPage)
type CircuitPageProps =
  {
    params: Promise<{ lang: Locale }>; //LANG è sempre di tipo locale
  };

export default async function CircuitPage
  ({
    params,
  }: CircuitPageProps) {
  const { lang } = await params;
  //..masterDict seleziona tutto il json  del dictionary
  const masterDict = await getDictionary(lang);

  //prendo solo lo std 8standard) ed il dictionary relativo alla Circuit
  const dict = { ...masterDict.Std, ...masterDict.CircuitPage };

  const circuits = await getAllCircuits(true);



  return (
    <>
      <PageHeader title={dict.Title}
        cta={[<GetButtonCtaExample key={'button1'} label='SCARICA' icon={<Download />} />,
        <GetButtonCtaExample key={'button2'} label='button 2' icon={<Upload />} />,
        <GetButtonCtaExample key={'button3'} label='button 3' icon={<Edit />} />,
        ]}

        addCta={{ label: dict.NewCircuit, href: "/circuit/new" }}
      />
      <div className="flex flex-col mt-3 h-[86%]">
        <CircuitDatagrid circuits={circuits} lang={lang} detailsLabel={dict.ViewDetails} />
      </div>
    </>
  );
}