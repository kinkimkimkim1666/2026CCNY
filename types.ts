export interface Winner {
  id: string;
  name: string;
  phone: string; // Stored as string to handle leading zeros or formatting
}

export interface DayData {
  dayId: number;
  label: string;
  dateStr?: string;
  winners: Winner[];
}

export type EventData = DayData[];