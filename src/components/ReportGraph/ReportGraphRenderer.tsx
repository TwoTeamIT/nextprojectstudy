"use client";

import { Card, CardContent, Typography } from "@mui/material";
import { PieChart } from "@mui/x-charts-pro";
import { useDrawingArea } from "@mui/x-charts/hooks";
import { StyledText } from "./StyledText";

type ReportGraphRendererProps = {
  title: string;
  total: number;
  used: number;
  available: number;
  totalLabel?: string | undefined;
  usedLabel?: string | undefined;
  availableLabel?: string | undefined;
  primaryColor: string | undefined;
  successColor: string | undefined;
};

function PieCenterLabel({ children }: { children: React.ReactNode }) {
  const { width, height, left, top } = useDrawingArea();
  return (
    <StyledText x={left + 45 + width / 2} y={top + 15 + height / 2}>
      {children}
    </StyledText>
  );
}

export default function ReportGraphRenderer({
  title,
  total,
  used,
  available,
  totalLabel,
  usedLabel,
  availableLabel,
  primaryColor,
  successColor,
}: ReportGraphRendererProps) {
  return (
    <Card
      variant="elevation"
      className="m-2"
      sx={{
        flexGrow: 1,
        scrollSnapAlign: "center",
        minWidth: 310,
        maxWidth: 400,
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          width: "100%",
        }}
      >
        <Typography variant="h6">{title}</Typography>
        <PieChart
          sx={{ alignSelf: "center" }}
          series={[
            {
              data: [
                {
                  value: used,
                  color: primaryColor,
                  label: `${usedLabel ?? "Used"} (${used})`,
                },
                {
                  value: available,
                  label: `${availableLabel ?? "Available"} (${available})`,
                },
              ],
              innerRadius: 50,
              outerRadius: 90,
              paddingAngle: 5,
              cornerRadius: 5,
              startAngle: -90,
              endAngle: 90,
              cx: 145,
              cy: 140,
            },
            {
              data: [
                {
                  value: total,
                  color: successColor,
                  label: `${totalLabel ?? "Total"} (${total})`,
                },
              ],
              innerRadius: 105,
              outerRadius: 130,
              paddingAngle: 2.5,
              cornerRadius: 5,
              startAngle: -90,
              endAngle: 90,
              cx: 145,
              cy: 140,
            },
          ]}
          width={300}
          height={230}
          {...{
            slotProps: {
              legend: {
                direction: "row",
                position: { horizontal: "middle", vertical: "bottom" },
                labelStyle: { fontSize: 14 },
              },
            },
          }}
        >
          <PieCenterLabel>
            {used}/{total}
          </PieCenterLabel>
        </PieChart>
      </CardContent>
    </Card>
  );
}
