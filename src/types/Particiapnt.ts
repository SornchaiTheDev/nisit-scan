import { ScanEventPayload } from "./ScanEventPayload";

export type AddParticipantPayload = ScanEventPayload & { student_code: string };
