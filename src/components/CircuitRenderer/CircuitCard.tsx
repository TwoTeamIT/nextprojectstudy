"use client";

import {
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Checkbox,
  Box,
  CardHeader,
  Stack,
} from "@mui/material";
import CircuitImage from "../styles/Icons/CircuitImage";
import { Circuit } from "@/data/circuits/definitions";
import { useRouter } from "next/navigation";
import CountrySelect from "../CountrySelect/CountrySelect";

interface CircuitCardProps {
  circuit: Circuit;
  activeLabel: string;
  editLabel: string;
  stateLabel: string;
}

export default function CircuitCard({
  circuit,
  activeLabel,
  editLabel,
  stateLabel,
}: CircuitCardProps) {
  const router = useRouter();

  return (
    <Card
      key={`circuit-${circuit.idC}`}
      elevation={3}
      className="py-2 px-3 w-full h-full"
    >
      <CardHeader title={circuit.name} className="border-b h-[100px]" />
      <CardContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingInline: 1,
          }}
        >
          <Stack direction={"row"} gap={2}>
            <CountrySelect
              label={stateLabel}
              value={circuit.state}
              onChange={() => { }}
              editable={false}
              hideName
            />
            <Typography variant="subtitle1">{circuit.place}</Typography>
          </Stack>
          <Typography variant="body1">
            {activeLabel}: <Checkbox checked={circuit.active} disableRipple />
          </Typography>
        </Box>

        {circuit.circuitImage && (
          <CircuitImage
            svgString={circuit.circuitImage}
            circuitName={circuit.name}
            className="w-full mx-auto my-4"
            size={150}
            squared
          />
        )}
      </CardContent>
      <CardActions className="border-t w-full justify-end">
        <Button
          variant="contained"
          onClick={() => router.push(`/circuits/${circuit.idC}`)}
        >
          {editLabel}
        </Button>
      </CardActions>
    </Card>
  );
}
