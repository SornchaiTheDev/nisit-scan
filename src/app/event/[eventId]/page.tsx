import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";
import { AccessToken } from "~/types";
import EventClient from "./client";
import { serverApi } from "~/lib/serverAxios";
import SessionWrapper from "~/wrapper/SessionWrapper";

interface Props {
  params: {
    eventId: string;
  };
}

async function EventPage({ params }: Props) {
  const accessToken = cookies().get("accessToken");
  const redirectUrl = `/auth/sign-in?redirect_to=/event/${params.eventId}`;

  if (!accessToken) {
    return redirect(redirectUrl);
  }

  const { role, name } = jwtDecode<AccessToken>(accessToken.value);

  try {
    await (await serverApi()).get(`/events/${params.eventId}`);
  } catch (e) {
    return redirect(redirectUrl);
  }

  return (
    <SessionWrapper>
      <EventClient {...{ name, role }} id={params.eventId} />
    </SessionWrapper>
  );
}

export default EventPage;
