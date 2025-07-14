import NotFoundCallbackBtn from "@/components/NotFoundInfoText/NotFoundCallbackBtn";
import { NotFoundInfoText } from "@/components/NotFoundInfoText/NotFoundInfoText";
import Logo from "@/components/styles/Icons/Logo";
import SocialIcon from "@/components/styles/Icons/SocialIcon";

import { Box, Container, Grid, Typography } from "@mui/material";

export default function NotFound() {
  return (
    <Container maxWidth="xl">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          alignContent: "stretch",
          height: "calc(100vh - 2.5rem)",
          marginTop: "1.25rem",
          gap: 10,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "60%",
            paddingTop: 6,
            paddingBottom: 6,
          }}
        >
          <Logo size={90} className="mx-4" />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Grid
            container
            width={"100%"}
            spacing={{ xs: 3, md: 5 }}
            rowGap={6}
            columns={{ sm: 1, md: 2, lg: 3 }}
          >
            <NotFoundInfoText lang="en" />
            <NotFoundInfoText lang="it" />
            <NotFoundInfoText lang="fr" />
            <NotFoundInfoText lang="es" />
            <NotFoundInfoText lang="de" />
            <NotFoundInfoText lang="jp" />
          </Grid>
          <NotFoundCallbackBtn lang={"en"} />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2.5,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 0.4,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <SocialIcon social="facebook" />
              <SocialIcon social="twitter" />
              <SocialIcon social="instagram" />
              <SocialIcon social="youtube" />
              <SocialIcon social="linkedin" />
              <SocialIcon social="tiktok" />
            </Box>
          </Box>
          <Typography variant="body2" className="mb-2">
            Copyright © 2025 TwoTeam S.r.l.
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}
