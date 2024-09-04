import { api } from "~/lib/axios";
import EventClient from "./client";
import { notFound } from "next/navigation";
import { Event } from "~/types";

async function EventPage({
  params: { eventId },
}: {
  params: { eventId: string };
}) {
  let event: Event;

  try {
    const res = await api.get(`/events/${eventId}`);
    event = res.data;
  } catch (err) {
    notFound();
  }

  return <EventClient id={eventId} />;
}

export default EventPage;
