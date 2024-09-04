export interface Participant {
  id: string;
  barcode: string;
  timestamp: string;
}

interface Staff {}

export interface Event {
  id: string;
  name: string;
  place: string;
  date: string;
  host: string;
  owner: string;
  staffs: Staff[];
  participants: Participant[];
}

export interface CreateEventRequest {
  name: string;
  place: string;
  date: string;
  host: string;
  owner: string;
}