"use server";

import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import { Locale } from "@/i18n-config";
import { getAuditDetails } from "@/data/audits/audits";
import { redirect } from "next/navigation";

import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { CheckCircle, Error } from "@mui/icons-material";

interface AuditsDetailsPageProps {
  params: Promise<{ id: string; lang: Locale }>;
}

export default async function AuditsDetailsPage({
  params,
}: AuditsDetailsPageProps) {
  const { id, lang } = await params;

  const audit = await getAuditDetails(id);

  if (!audit) return redirect("/audits");

  const date = new Date(audit.timeStampUTC);
  const dateString = `${date.toLocaleDateString()} - ${date.toLocaleTimeString()}`;

  return (
    <>
      <Breadcrumbs lang={lang} baseLink="/audits" label={dateString} />
      <div className="h-4" />
      <Container maxWidth="lg" className="my-4">
        <Card
          key={`audit-card`}
          elevation={3}
          className="py-2 px-3 w-full h-full"
        >
          <CardHeader title={"Audit Details"} className="border-b" />
          <CardContent>
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
                spacing={5}
                rowGap={6}
                columns={12}
              >
                <Grid size={4} textAlign={"center"}>
                  <Typography fontSize={18}>TimeStamp: {dateString}</Typography>
                </Grid>
                <Grid size={4} textAlign={"center"}>
                  <Typography fontSize={18}>Action: {audit.action}</Typography>
                </Grid>
                <Grid
                  size={4}
                  display={"flex"}
                  flexDirection={"row"}
                  gap={1}
                  alignItems={"center"}
                  justifyContent={"center"}
                >
                  <Typography fontSize={18}>
                    Status: {audit.responseStatus}
                  </Typography>
                  {audit.responseStatus.toString().charAt(0) === "2" ? (
                    <CheckCircle color="success" />
                  ) : (
                    <Error color="error" />
                  )}
                </Grid>

                {/* Grid Line 2 */}
                <Grid size={8} textAlign={"center"}>
                  <Typography fontSize={18}>
                    Method: {audit.controller}
                  </Typography>
                </Grid>
                <Grid size={4} textAlign={"center"}>
                  <Typography fontSize={18}>
                    Request User: {audit.userIdentity}
                  </Typography>
                </Grid>

                {/* Grid Line 3 */}
                <Grid size={12} textAlign={"start"}>
                  <Typography fontSize={18}>Request Payload:</Typography>
                  <pre
                    style={{
                      overflow: "auto",
                      maxHeight: "30em",
                      margin: "0",
                      padding: "1em",
                      backgroundColor: "rgba(0, 0, 0, 0.05)",
                    }}
                  >
                    {audit.requestPayload &&
                      JSON.stringify(JSON.parse(audit.requestPayload), null, 2)}
                  </pre>
                </Grid>

                {/* Grid Line 4 */}
                <Grid size={12} textAlign={"start"}>
                  <Typography fontSize={18}>Response Payload:</Typography>
                  <pre
                    style={{
                      overflow: "auto",
                      maxHeight: "30em",
                      margin: "0",
                      padding: "1em",
                      backgroundColor: "rgba(0, 0, 0, 0.05)",
                    }}
                  >
                    {audit.responseResult &&
                      JSON.stringify(JSON.parse(audit.responseResult), null, 2)}
                  </pre>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}
