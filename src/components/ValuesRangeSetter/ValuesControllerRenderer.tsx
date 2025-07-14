"use client";

/*
import { Divider } from "@mui/material";
import ValueController from "./ValueController";
*/
import { Event } from "@/data/events/definitions";

type ValuesControllerRendererProps = {
  event: Event;
};

export default function ValuesControllerRenderer({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  event,
}: ValuesControllerRendererProps) {
  return (
    <div className="flex flex-col lg:flex-row h-full w-full justify-between lg:w-[400px] xl:w-full xl:max-w-[450px] overflow-hidden">
      {/*
      // TODO Fix
      <ValueController
        label={"Vip Pass"}
        value={event.usedVipPass}
        onChange={(newValue) => (event.usedVipPass = newValue)}
      />
      <Divider
        className="border-2 w-full lg:w-0 lg:h-[65%]"
        sx={{ marginBlock: "auto", marginInline: "auto" }}
      />
      <ValueController
        label={"Paddock Pass"}
        value={event.usedPaddockPass}
        onChange={(newValue) => (event.usedPaddockPass = newValue)}
      />
      <Divider
        className="border-2 w-full lg:w-0 lg:h-[65%]"
        sx={{ marginBlock: "auto", marginInline: "auto" }}
      />
      <ValueController
        label={"Grand Stand Pass"}
        value={event.usedGrandstandPass}
        onChange={(newValue) => (event.usedGrandstandPass = newValue)}
      />
      */}
    </div>
  );
}
