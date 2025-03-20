
import React, { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { getAppointments } from "@/services/appointmentService";
import { getClient } from "@/services/clientService";
import { Appointment } from "@/integrations/supabase/schema";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import NewAppointmentDialog from "./NewAppointmentDialog";
import CalendarSidebar from "./CalendarSidebar";
import DailySchedule from "./DailySchedule";
import DailyCalendarHeader from "./DailyCalendarHeader";
import DeleteAppointmentDialog from "./DeleteAppointmentDialog";

const timeSlots = [
  "09:00", "10:00", "11:00", "12:00", "13:00", 
  "14:00", "15:00", "16:00", "17:00",
];

// Format date as "YYYY-MM-DD" for matching with appointments
const formatDateForKey = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

const AppointmentCalendar = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [dayAppointments, setDayAppointments] = useState<Appointment[]>([]);
  const [clientsMap, setClientsMap] = useState<Record<string, {name: string, image?: string}>>({}); 
  const [loading, setLoading] = useState(true);
  const [showNewAppointment, setShowNewAppointment] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const isMobile = useIsMobile();
  const { toast } = useToast();

  useEffect(() => {
    fetchAppointments();
  }, []);
  
  useEffect(() => {
    if (appointments.length > 0) {
      const formattedDate = formatDateForKey(date);
      const filtered = appointments.filter(
        (appointment) => appointment.date === formattedDate
      );
      setDayAppointments(filtered);
      
      // Fetch client details for the filtered appointments
      fetchClientDetails(filtered);
    }
  }, [date, appointments]);
  
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await getAppointments();
      setAppointments(data);
      
      // Update day appointments based on current date
      const formattedDate = formatDateForKey(date);
      const filtered = data.filter(
        (appointment) => appointment.date === formattedDate
      );
      setDayAppointments(filtered);
      
      // Fetch client details for the filtered appointments
      fetchClientDetails(filtered);
    } catch (error: any) {
      console.error("Error fetching appointments:", error);
      toast({
        title: "Erro ao carregar agendamentos",
        description: error.message || "Ocorreu um erro ao carregar os agendamentos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const fetchClientDetails = async (appointments: Appointment[]) => {
    const clientIds = [...new Set(appointments.map(a => a.client_id).filter(Boolean))];
    
    const newClientsMap = { ...clientsMap };
    
    for (const clientId of clientIds) {
      if (clientId && !clientsMap[clientId]) {
        try {
          const client = await getClient(clientId);
          if (client) {
            newClientsMap[clientId] = {
              name: client.name,
              image: client.image_url || undefined,
            };
          }
        } catch (error) {
          console.error(`Error fetching client ${clientId}:`, error);
        }
      }
    }
    
    setClientsMap(newClientsMap);
  };
  
  const handleDeleteAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowDeleteDialog(true);
  };
  
  const confirmDeleteAppointment = async () => {
    if (!selectedAppointment) return;
    
    try {
      // Here we would call the delete API
      console.log("Deleting appointment:", selectedAppointment.id);
      
      // For now, just update the UI
      toast({
        title: "Agendamento cancelado",
        description: "O agendamento foi cancelado com sucesso.",
      });
      
      // Refresh appointments
      fetchAppointments();
    } catch (error: any) {
      console.error("Error deleting appointment:", error);
      toast({
        title: "Erro ao cancelar agendamento",
        description: error.message || "Ocorreu um erro ao cancelar o agendamento.",
        variant: "destructive",
      });
    } finally {
      setShowDeleteDialog(false);
      setSelectedAppointment(null);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className={`${isMobile ? 'order-1' : ''} col-span-1`}>
        <CalendarSidebar 
          date={date}
          setDate={setDate}
          appointments={appointments}
          onNewAppointment={() => setShowNewAppointment(true)}
        />
      </div>
      
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
          <DailyCalendarHeader 
            date={date}
            appointmentsCount={dayAppointments.length}
          />
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <DailySchedule 
            timeSlots={timeSlots}
            dayAppointments={dayAppointments}
            clientsMap={clientsMap}
            loading={loading}
            onNewAppointment={() => setShowNewAppointment(true)}
            onDeleteAppointment={handleDeleteAppointment}
          />
        </CardContent>
      </Card>
      
      <NewAppointmentDialog 
        open={showNewAppointment} 
        onOpenChange={setShowNewAppointment} 
        selectedDate={date}
        onSuccess={fetchAppointments}
      />
      
      <DeleteAppointmentDialog 
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={confirmDeleteAppointment}
        appointment={selectedAppointment}
      />
    </div>
  );
};

export default AppointmentCalendar;
