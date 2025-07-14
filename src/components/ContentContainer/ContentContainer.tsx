import Sidebar from "@/components/Navigation/Sidebar";
import { Locale } from "@/i18n-config";
import { Box } from "@mui/material";

type ContentContainerProps = {
  children: React.ReactNode | JSX.Element;
  lang: Locale;
};

export default function ContentContainer({
  children,
  lang,
}: ContentContainerProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        width: "100vw",
        maxHeight: "calc(100vh - 64px)",
      }}
    >
      <Sidebar lang={lang} />
      <Box
        className="pb-5 ml-5"
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
          paddingRight: "1.25rem",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
