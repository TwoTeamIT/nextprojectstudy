'use client'

import { FormField, useDynamicForm } from "@/components/FormsGenerator/useDynamicForm";
import { saveOrUpdateCircuit } from "@/data/circuits/circuits";
import { Circuit, CircuitFormFields } from "@/data/circuits/definitions";
import { Locale } from "@/i18n-config";
import { useEffect } from "react";


type CircuitDetailFormProps = {
    lang: Locale;
    submittingLabel: string;
    submitLabel: string;
    cancelLabel: string;
    circuit?: Circuit | null;
}

export function CircuitDetailsForm(
    {
        lang,
        submittingLabel,
        submitLabel,
        cancelLabel,
        circuit = null,
    }: CircuitDetailFormProps) {

    const formFields: FormField[] = CircuitFormFields;

    if (circuit) {
        formFields.forEach((field) => field.default = circuit[field.name as keyof Circuit]);
    }

    const { formRender, formState } = useDynamicForm({
        fields: formFields,
        lang: lang,
        submitLabel: submitLabel,
        submittingLabel: submittingLabel,
        cancelLabel: cancelLabel,
        submitAction: saveOrUpdateCircuit,  // Function to save or update the circuit (/data/circuit/circuits.ts)
        callback: 'refresh',
        cancelCallback: 'goback',
    })

    //la use effect reagisce al cambiamento di stato di tutte le variabili che metto nell'array (i.e. riga 50 }, [formState]);
    useEffect(() => {
        console.log("Form state changed:", formState);


        //formState.state?.message //il notify , toaster o alert, adrebbe QUI
    }, [formState]);


    return (
        <div className="flex flex-col w-1/2 gap-8 mx-auto">
            {formRender}
        </div>
    )

}
/* esempio ducati

const formFields: FormField[] = UserLoginFormFields;
if (existingUser?.id && existingUser.id !== 0) {
    formFields.forEach(
        (field) => (field.default = existingUser[field.name as keyof UserLogin])
    );
    formFields.find((f) => f.name === "userPwd")!.ignored = true;
}

if (newUser) {
    formFields.find((f) => f.name === "id")!.default = 0;
    formFields.find((f) => f.name === "idS")!.default = sponsorId;
}*/