"use client";
import { useFormStatus } from "react-dom";
import { Button } from "@mui/material";

export default function FormButton({
  label,
  submittingLabel,
  fullWidth = false,
}: {
  label: string;
  submittingLabel: string;
  fullWidth?: boolean;
}) {
  const { pending } = useFormStatus();

  return (
    <Button
      aria-disabled={pending}
      type="submit"
      color="primary"
      variant="contained"
      fullWidth={fullWidth}
      sx={{ maxWidth: "40%" }}
    >
      {pending ? submittingLabel : label}
    </Button>
  );
}
