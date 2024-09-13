import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";
import { AccessToken } from "~/types";
import EventClient from "./client";

interface Props {
  params: {
    eventId: string;
  };
}
function EventPage({ params }: Props) {
  const accessToken = cookies().get("accessToken");
  const redirectUrl = `/auth/sign-in?redirect_to=/event/${params.eventId}`;

  if (!accessToken) {
    return redirect(redirectUrl);
  }

  const { role, name } = jwtDecode<AccessToken>(accessToken.value);
  if (role !== "staff") {
    return redirect(redirectUrl);
  }
  return <EventClient {...{ name, role }} id={params.eventId} />;
}

export default EventPage;
