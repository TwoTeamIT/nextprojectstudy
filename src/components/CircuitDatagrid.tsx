
"use client";

import { Locale } from "@/i18n-config";
import DataGridGenerator from "./DataGrid/DataGridGenerator";
import { Circuit } from "@/data/circuits/definitions";
import { generateColumnsFromZodSchema } from "./DataGrid/ColumnsGenerator";
import { deepEqual } from "@/lib/deepCompare";

export default function CircuitDatagrid({ circuits, lang, detailsLabel }: { circuits: Circuit[], lang: Locale, detailsLabel: string }) {
    // funzione handler per il salvataggio dei dati del datagrid
    const saveDatagrid = async (initialData: Circuit[], updatedData: Circuit[]) => {
        // Handle save changes logic here

        for (let i = 0; i < updatedData.length; i++) {
            if (!deepEqual(initialData[i], updatedData[i])) {
                console.log("Initial Data:", initialData[i]);  //initialData è il vecchio array di oggetti
                console.log("Updated Data:", updatedData[i]);  //updatedData è il nuovo array di oggetti
            }
        }

        // Qui puoi implementare la logica per salvare i dati aggiornati nel tuo backend o in un altro luogo
        // Ad esempio, puoi fare una chiamata API per inviare i dati aggiornati al server
        // await saveToBackend(updatedData);
    }

    return <DataGridGenerator
        data={circuits}
        columns={generateColumnsFromZodSchema(Circuit, [
            "idC",
            "circuitImage",
            "active",
        ], ["name"])}
        rowIdField="idC"  //serve per identificare la riga e passarla al path route interna per il detail (gestita poi con la page dentro l a sotto cartella [idC])
        loading={false}
        lang={lang}

        //serve solo per andare nei dettagli --> 
        viewDetails={{ baseRoute: "circuits", detailsLabel: detailsLabel }} //butta su il base route con l'idC del circuito
        //toolbarActions={<></>}
        onSaveChanges={saveDatagrid}
    />
}