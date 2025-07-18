"use client";
import { useTheme } from "@mui/material";

type CircuitImageProps = {
  size?: number | undefined;
  className?: string | undefined;
  svgString: string;
  circuitName: string;
  squared?: boolean;
};

export default function CircuitImage({
  size,
  className,
  svgString,
  circuitName,
  squared = false,
}: CircuitImageProps) {
  const dimension = size ? size : hasWidthClass(className) ? undefined : 110;
  const color = useTheme().palette.primary.main;

  return (
    <div
      title={`${circuitName} Circuit`}
      className={className}
      dangerouslySetInnerHTML={{ __html: svgString }}
      style={{
        fill: color,
        width: dimension,
        height: squared ? dimension : "fit-content",
        alignContent: squared ? "center" : undefined,
      }}
    />
  );
}

const hasWidthClass = (className: string | undefined): boolean => {
  const widthRegex = /(\bw-\S+|\bmin-w-\S+|\bmax-w-\S+)/;
  return className ? widthRegex.test(className) : false;
};
