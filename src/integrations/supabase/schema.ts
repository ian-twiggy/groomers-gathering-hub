
export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  image_url: string | null;
  last_visit: string | null;
  total_visits: number;
  favorite_service: string | null;
  status: 'active' | 'inactive' | 'new';
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  name: string;
  description: string | null;
  duration: number;
  price: number;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  client_id: string;
  service_id: string | null;
  date: string;
  time: string;
  duration: number;
  status: 'upcoming' | 'completed' | 'cancelled';
  notes: string | null;
  created_at: string;
  updated_at: string;
}
