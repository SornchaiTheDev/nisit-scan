import { api } from "~/lib/axios";

export const setStaffsFn = async (eventId: string, emails: string[]) => {
  const { data } = await api.post(`/events/${eventId}/staff/set`, {
    emails,
  });
  return data;
};
