'use client';

import { Button } from '@mui/material';
import {
    QuestionAnswer,
} from "@mui/icons-material";
import React from 'react';
import { ToastOptions } from '@/context/Toaster';
import ToastObserver from '@/context/ToastObserver';

export function GetButtonCtaExample({ label, icon }: { label: string, icon?: JSX.Element | undefined | React.ReactNode }) {

    //handler di default (se dovessi passare dei parametri) è solo il nome della funzione handleClick()
    //onClick = { handleClicknoParam }
    //onClick = {() => handleClicknoParam() }
    //const handleClicknoParam = () => {

    //}

    //handler con un parametro, il message, in inpout: message è opzionale
    //nClick = {() =>  handleClickWithMessage('message') }
    //const handleClickWithMessage = (message?: string) => {

    //}

    //handler con il mouse event
    //onClick = { handleClick }
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        //event.currentTarget è il bottone che ha generato l'evento
        //event.currentTarget.value è il valore del bottone (se lo setto)
        //event.currentTarget.innerText è il testo del bottone (se lo setto)
        //console.log(event.currentTarget.value);
        //console.log(event.currentTarget.innerText);



        //esempio di download di un file

        //deriva dall'alerter.tsx
        //const alert: AlertOptions = {
        //    message: "Alert from ButtonCtaExample " + event.currentTarget.innerText,
        //    severity: 'info',
        //    title: "Alert example",
        //    variant: 'standard'
        //}

        const toast: ToastOptions = {
            message: "Toast from ButtonCtaExample " + event.currentTarget.innerText,
            durationMs: 2000,
            severity: 'success',
            title: "Toast example",
            variant: 'filled'

        }

        //uso l'obseerver per notificare l'alert
        //AlertObserver.notify(alert);

        ToastObserver.notify(toast);

    }

    return <Button
        key={`aleet-summary-btn`}
        startIcon={icon ?? <QuestionAnswer />}
        onClick={handleClick}
    >
        {label}
    </Button>
}