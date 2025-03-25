
import * as z from "zod";
import { useQuery } from "@tanstack/react-query";
import { getServices } from "@/services/serviceService";

export const availableTimeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", 
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", 
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00"
];

// Este hook retorna os serviços do banco de dados
export const useAvailableServices = () => {
  const { data: services = [] } = useQuery({
    queryKey: ['services'],
    queryFn: getServices,
  });

  return services.map(service => ({
    id: service.id,
    name: service.name,
    duration: service.duration
  }));
};

// Mantemos os serviços estáticos para fallback caso a consulta falhe
export const availableServices = [
  { id: "1", name: "Corte de Cabelo", duration: 30 },
  { id: "2", name: "Barba", duration: 20 },
  { id: "3", name: "Corte e Barba", duration: 45 },
  { id: "4", name: "Platinado", duration: 90 },
  { id: "5", name: "Hidratação", duration: 60 },
];

export const appointmentSchema = z.object({
  client_id: z.string({
    required_error: "Selecione um cliente",
  }),
  date: z.date({
    required_error: "Selecione uma data",
  }),
  time: z.string({
    required_error: "Selecione um horário",
  }),
  service_id: z.string({
    required_error: "Selecione um serviço",
  }),
  duration: z.number({
    required_error: "Duração é obrigatória",
  }),
  notes: z.string().optional(),
  status: z.string().default("upcoming"),
});

export type AppointmentFormValues = z.infer<typeof appointmentSchema>;
