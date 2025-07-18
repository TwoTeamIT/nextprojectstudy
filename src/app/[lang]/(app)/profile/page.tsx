"use server";

import { notFound } from "next/navigation";
import { Locale } from "@/i18n-config";
import { getDictionary } from "@/lib/get-dictionary";
import PageHeader from "@/components/PageHeader/PageHeader";
import { getMyDetails } from "@/data/auth/auth";
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import { stringAvatar } from "@/lib/avatarFormatter";
import { Password } from "@mui/icons-material";

interface ProfilePageProps {
  params: Promise<{ lang: Locale }>;
}

export default async function ProfilePage({ }: ProfilePageProps) {


  const masterDict = await getDictionary("it");
  const dict = { ...masterDict.Std, ...masterDict.ProfilePage };
  const loggedUser = await getMyDetails();

  if (!loggedUser) return notFound();

  return (
    <>
      <PageHeader key="profile-page" title={dict.Title} />
      <Container maxWidth="sm" className="my-4">
        <Card
          key={`profile-card`}
          elevation={3}
          className="py-2 px-3 w-full h-full"
        >
          <CardHeader title={"Account"} className="border-b border-t" />
          <CardContent>
            <Stack direction={"column"} alignItems={"center"} gap={3}>
              <Stack
                direction={"row"}
                alignItems={"center"}
                gap={3}
                width={"80%"}
                justifyContent={"space-around"}
              >
                <Avatar
                  style={{ width: 80, height: 80, fontSize: 40 }}
                  {...stringAvatar(
                    `${loggedUser.firstName} ${loggedUser.lastName}`
                  )}
                />
                <Stack direction={"column"} alignItems={"end"} gap={1}>
                  <Typography variant="h6">{loggedUser.firstName}</Typography>
                  <Typography variant="h6">{loggedUser.lastName}</Typography>
                </Stack>
              </Stack>

              <Typography variant="subtitle1">{loggedUser.email}</Typography>
            </Stack>
          </CardContent>
          <CardActions className="border-t w-full justify-end">
            <Button
              variant="text"
              startIcon={<Password />}
              href="/profile/reset-password"
            >
              Reset Password
            </Button>
          </CardActions>
        </Card>
      </Container>
    </>
  );
}
