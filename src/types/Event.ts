export interface Event {
  id: string;
  name: string;
  place: string;
  date: string;
  host: string;
  owner: string;
}

export interface CreateEventRequest {
  name: string;
  place: string;
  date: string;
  host: string;
  owner: string;
}
