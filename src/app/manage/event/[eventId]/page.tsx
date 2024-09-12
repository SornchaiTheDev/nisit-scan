import EventClient from "./client";
import { notFound } from "next/navigation";
import { Event } from "~/types";
import { serverApi } from "~/lib/serverAxios";

async function EventPage({
  params: { eventId },
}: {
  params: { eventId: string };
}) {
  let event: Event;

  try {
    const res = await (await serverApi()).get(`/events/${eventId}`);
    event = res.data;
  } catch (err) {
    notFound();
  }

  return <EventClient id={eventId} />;
}

export default EventPage;
