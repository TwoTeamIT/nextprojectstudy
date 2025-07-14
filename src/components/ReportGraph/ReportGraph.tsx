"use client";

import dynamic from "next/dynamic";
import { CircularProgress, useTheme } from "@mui/material";
import { useEffect, useState } from "react";

const ReportGraphRenderer = dynamic(() => import("./ReportGraphRenderer"), {
  ssr: false,
});

type ReportGraphProps = {
  title: string;
  total: number;
  used: number;
  available: number;
  totalLabel?: string | undefined;
  usedLabel?: string | undefined;
  availableLabel?: string | undefined;
};

export default function ReportGraph({
  title,
  total,
  used,
  available,
  totalLabel,
  usedLabel,
  availableLabel,
}: ReportGraphProps) {
  const { primary, success } = useTheme().palette;
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted)
    return <CircularProgress variant="indeterminate" size="120px" />;

  return (
    <ReportGraphRenderer
      title={title}
      total={total}
      used={used}
      available={available}
      totalLabel={totalLabel}
      usedLabel={usedLabel}
      availableLabel={availableLabel}
      primaryColor={primary.main}
      successColor={success.main}
    />
  );
}
