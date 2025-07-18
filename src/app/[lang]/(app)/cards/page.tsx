"use server";

import CircuitCard from "@/components/CircuitRenderer/CircuitCard";
import GridList from "@/components/GridList/GridList";
import PageHeader from "@/components/PageHeader/PageHeader";
import { getAllCircuits } from "@/data/circuits/circuits";
import { Locale } from "@/i18n-config";
import { getDictionary } from "@/lib/get-dictionary";

export default async function CircuitsPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const masterDict = await getDictionary(lang);
  const dict = { ...masterDict.Std, ...masterDict.CardsPage };

  const circuits = await getAllCircuits();

  return (
    <>
      <PageHeader
        title={dict.Title}
        addCta={{ label: dict.AddCard, href: "/cards/new" }}
      />

      <GridList
        elements={circuits.map((circuit) => (
          <CircuitCard
            key={circuit.idC}
            circuit={circuit}
            activeLabel={dict.Active}
            editLabel={dict.Edit}
            stateLabel={dict.State}
          />
        ))}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        getElementId={(element: any) => element.props.circuit.idC}
      />
    </>
  );
}
