import { Box, Grid, Typography } from "@mui/material";

type NotFoundInfoTextProps = {
  lang: string;
};

type AvailableLanguages = "en" | "it" | "fr" | "es" | "de" | "jp";

const NotFoundInfoMessages: {
  lang: AvailableLanguages;
  title: string;
  message: string;
}[] = [
  {
    lang: "en",
    title: "Page not found",
    message: "We can't find the page you're looking for.",
  },
  {
    lang: "it",
    title: "Pagina non trovata",
    message: "Non riusciamo a trovare la pagina che stai cercando.",
  },
  {
    lang: "fr",
    title: "Page non trouvée",
    message: "Nous ne pouvons pas trouver la page que vous recherchez.",
  },
  {
    lang: "es",
    title: "Página no encontrada",
    message: "No podemos encontrar la página que estás buscando.",
  },
  {
    lang: "de",
    title: "Seite nicht gefunden",
    message: "Wir können die Seite, die Sie suchen, nicht finden.",
  },
  {
    lang: "jp",
    title: "ページが見つかりません",
    message: "お探しのページが見つかりません。",
  },
];

export function NotFoundInfoText({ lang }: NotFoundInfoTextProps) {
  return (
    <Grid key={lang} size={1}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          rowGap: 1,
        }}
      >
        <Typography fontSize={"2rem"} fontWeight={700}>
          {NotFoundInfoMessages.find((nfm) => nfm.lang === lang)?.title}
        </Typography>
        <Typography
          fontSize={"1.1rem"}
          fontFamily={"var(--font-regular)"}
          textAlign={"center"}
        >
          {NotFoundInfoMessages.find((nfm) => nfm.lang === lang)?.message}
        </Typography>
      </Box>
    </Grid>
  );
}
