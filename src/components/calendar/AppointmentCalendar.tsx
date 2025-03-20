
import React, { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Clock, MoreVertical, Plus } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { getAppointments } from "@/services/appointmentService";
import { getClient } from "@/services/clientService";
import { Appointment } from "@/integrations/supabase/schema";
import { useToast } from "@/hooks/use-toast";
import NewAppointmentDialog from "./NewAppointmentDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
      <Card className={`${isMobile ? 'order-1' : ''} col-span-1 h-min`}>
        <CardHeader>
          <CardTitle>Calendário</CardTitle>
          <CardDescription>
            Selecione uma data para ver os agendamentos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => newDate && setDate(newDate)}
            className="rounded-md border p-3 mx-auto"
          />
          
          <div className="mt-6">
            <h3 className="font-medium text-gray-900 mb-3">Resumo do Mês</h3>
            <div className="space-y-2">
              {[
                { label: "Total de Agendamentos", value: appointments.length.toString() },
                { label: "Concluídos", value: appointments.filter(a => a.status === 'completed').length.toString() },
                { label: "Cancelados", value: appointments.filter(a => a.status === 'cancelled').length.toString() },
                { label: "Pendentes", value: appointments.filter(a => a.status === 'upcoming').length.toString() },
              ].map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span className="text-gray-600">{item.label}</span>
                  <span className="font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
          
          <Button 
            className="w-full mt-6"
            onClick={() => setShowNewAppointment(true)}
          >
            Novo Agendamento
          </Button>
        </CardContent>
      </Card>
      
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <CardTitle className="flex items-center">
                <CalendarIcon className="mr-2 h-5 w-5" />
                {date.toLocaleDateString("pt-BR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </CardTitle>
              <CardDescription>
                {dayAppointments.length} agendamentos para hoje
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                Semana
              </Button>
              <Button variant="outline" size="sm" className="bg-gray-900 text-white">
                Dia
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {timeSlots.map((time) => {
                const appointmentsAtTime = dayAppointments.filter(
                  (appt) => appt.time.substring(0, 5) === time
                );
                
                return (
                  <div key={time} className="grid grid-cols-[70px_1fr] md:grid-cols-[80px_1fr] gap-2 md:gap-4">
                    <div className="flex items-center justify-end">
                      <span className="text-sm font-medium text-gray-600">
                        {time}
                      </span>
                    </div>
                    
                    <div className="flex-1 min-h-[64px] rounded-lg border border-dashed border-gray-200 bg-gray-50 p-1">
                      {appointmentsAtTime.length > 0 ? (
                        <div className="grid grid-cols-1 gap-2">
                          {appointmentsAtTime.map((appointment) => {
                            const client = appointment.client_id ? clientsMap[appointment.client_id] : null;
                            return (
                              <div
                                key={appointment.id}
                                className="flex items-center justify-between p-2 md:p-3 bg-white rounded-md shadow-sm border border-gray-100"
                              >
                                <div className="flex items-center space-x-2 md:space-x-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src={client?.image} alt={client?.name || 'Cliente'} />
                                    <AvatarFallback>{client?.name ? client.name.charAt(0) : 'C'}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <h4 className="font-medium text-sm">
                                      {client?.name || 'Cliente não encontrado'}
                                    </h4>
                                    <div className="flex items-center space-x-1 md:space-x-2 text-xs text-gray-500">
                                      <span className="truncate max-w-[80px] md:max-w-full">
                                        {appointment.service_id || 'Serviço não especificado'}
                                      </span>
                                      <span>•</span>
                                      <div className="flex items-center whitespace-nowrap">
                                        <Clock className="mr-1 h-3 w-3" />
                                        {appointment.duration} min
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex items-center">
                                  <Badge className="hidden sm:flex mr-2 bg-green-50 text-green-700 hover:bg-green-100 border border-green-200">
                                    {appointment.status === 'completed' 
                                      ? 'Concluído' 
                                      : appointment.status === 'cancelled'
                                      ? 'Cancelado'
                                      : 'Confirmado'}
                                  </Badge>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <MoreVertical className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem>Editar</DropdownMenuItem>
                                      <DropdownMenuItem>Remarcar</DropdownMenuItem>
                                      <DropdownMenuItem 
                                        className="text-red-600"
                                        onClick={() => handleDeleteAppointment(appointment)}
                                      >
                                        Cancelar
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-gray-500 hover:text-gray-900"
                            onClick={() => setShowNewAppointment(true)}
                          >
                            <Plus className="mr-2 h-3 w-3" /> Agendar
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
      
      <NewAppointmentDialog 
        open={showNewAppointment} 
        onOpenChange={setShowNewAppointment} 
        selectedDate={date}
        onSuccess={fetchAppointments}
      />
      
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancelar agendamento</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja cancelar este agendamento? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Não, manter agendamento</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteAppointment} className="bg-red-600 hover:bg-red-700">
              Sim, cancelar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AppointmentCalendar;
