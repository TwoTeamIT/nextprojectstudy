"use server";

import PageHeader from "@/components/PageHeader/PageHeader";
import { Locale } from "@/i18n-config";
import { getDictionary } from "@/lib/get-dictionary";

import GridList from "@/components/GridList/GridList";

import { getAllEvents } from "@/data/events/events";
import { Event } from "@/data/events/definitions";
import { Key } from "react";

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

//questo va definito qui (il costruttore automatico me li mette dopo i params della async funcion circuitPage)
type CalendarPageProps =
  {
    params: Promise<{ lang: Locale }>; //LANG è sempre di tipo locale
  };

export default async function CalendarPage
  ({
    params,
  }: CalendarPageProps) {
  const { lang } = await params;
  //..masterDict seleziona tutto il json  del dictionary
  const masterDict = await getDictionary(lang);

  //prendo solo lo std 8standard) ed il dictionary relativo alla Circuit
  const dict = { ...masterDict.Std, ...masterDict.CalendarPage };

  const events = await getAllEvents();


  return (
    <>
      <PageHeader title={dict.Title}

        addCta={{ label: dict.NewEvent, href: "/calendar/new" }}
      />
      <div className="flex flex-col mt-3 h-[86%]">
        <GridList
          elements={events.map((event) => (
            //la key è una reserved word, c'è sempre praticamente
            //
            <CalendarCard key={event.idE} event={event} dictionary={dict} />
          ))}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          getElementId={(element: any) =>
            element.props.event.idE
          } //id del circuito
        />
      </div>
    </>
  );
}

type CalendarCardProps = {
  key: Key | null | undefined;
  event: Event;
  dictionary: Record<string, string>;
};

function CalendarCard({ event, dictionary }: CalendarCardProps) {
  return <div
    key={event.idE}

    className="flex flex-col items-center justify-center">

    <Card sx={{ minWidth: 400 }}>
      <CardContent>
        <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
          Event
        </Typography>
        <Typography variant="h5" component="div">
          {event.grandPrixName}
        </Typography>
        <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>Active: {event.active === true ? "YES" : "NO"}</Typography>
        <Typography variant="body2">
          StartDate : {event.startDate.toString()}
          <br />
          EndDate : {event.endDate.toString()}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          href={`/calendar/${event.idE}`}
          variant="contained"
          color="info"
        >
          {dictionary.ViewDetails}

        </Button>
      </CardActions>
    </Card>
  </div>
    ;
}