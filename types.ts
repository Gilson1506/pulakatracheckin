
export interface Participant {
  id: number;
  name: string;
  cpf: string;
  email: string;
  ticketType: string;
  price: number;
  checkedIn: boolean;
  checkInTime?: string;
  checkedInBy?: string;
  qrCode?: string;
}

export interface Event {
  id: number;
  name: string;
  date: string;
  time: string;
  location: string;
  participants: Participant[];
  uuid?: string;
  image?: string;
}

export type Screen = 'login' | 'eventSelection' | 'checkIn' | 'statistics';

export interface FeedbackModalData {
  type: 'success' | 'warning' | 'invalid';
  participant?: Participant;
  previousCheckIn?: { time: string; operator: string };
}
