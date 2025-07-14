"use client";
import { useTheme } from "@mui/material";

type SvgImageViewerProps = {
  size?: number | undefined;
  className?: string | undefined;
  svgString: string;
  svgName: string;
  squared?: boolean;
};

export default function SvgImageViewer({
  size,
  className,
  svgString,
  svgName,
  squared = false,
}: SvgImageViewerProps) {
  const dimension = size ? size : hasWidthClass(className) ? undefined : 110;
  const color = useTheme().palette.primary.main;

  return (
    <div
      title={`${svgName}`}
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
