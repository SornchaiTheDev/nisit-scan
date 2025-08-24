export interface Participant {
  id: string;
  barcode: string;
  timestamp: string;
  student_code: string;
  full_name: string;
  gmail: string;
  major: string;
}

interface Staff {
  id: string;
  email: string;
}

export interface Event {
  id: string;
  name: string;
  place: string;
  date: string;
  host: string;
  owner: string;
  staffs: Staff[];
  participants_count: Participant[];
}

export interface EventRequest {
  name: string;
  place: string;
  date: string;
  host: string;
}
