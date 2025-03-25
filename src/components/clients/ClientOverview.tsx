
import React from "react";
import { Client, Appointment } from "@/integrations/supabase/schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Plus } from "lucide-react";

interface ClientOverviewProps {
  client: Client;
  appointments: Appointment[];
  formatDate: (dateString: string | null) => string;
  onNewAppointmentClick: () => void;
}

const ClientOverview = ({ client, appointments, formatDate, onNewAppointmentClick }: ClientOverviewProps) => {
  // Ordena os agendamentos por data (do mais recente para o mais antigo)
  const sortedAppointments = [...appointments].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`).getTime();
    const dateB = new Date(`${b.date}T${b.time}`).getTime();
    return dateB - dateA;
  });
  
  // Pega o último agendamento
  const lastAppointment = sortedAppointments[0];
  
  // Pega o próximo agendamento (que ainda não aconteceu)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const upcomingAppointments = sortedAppointments.filter(appointment => {
    const appointmentDate = new Date(appointment.date);
    return appointmentDate >= today && appointment.status !== 'cancelled';
  });
  
  const nextAppointment = upcomingAppointments[0];
  
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Último Atendimento</CardTitle>
            <CardDescription>
              Detalhes do último atendimento deste cliente
            </CardDescription>
          </CardHeader>
          <CardContent>
            {lastAppointment ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>Data: {formatDate(lastAppointment.date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>Horário: {lastAppointment.time}</span>
                </div>
                <div>
                  <span className="font-semibold">Serviço:</span> {lastAppointment.service_id || 'N/A'}
                </div>
                {lastAppointment.notes && (
                  <div>
                    <span className="font-semibold">Observações:</span> {lastAppointment.notes}
                  </div>
                )}
              </div>
            ) : (
              <div className="py-4 text-center text-gray-500">
                Nenhum atendimento registrado
                <div className="mt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-1"
                    onClick={onNewAppointmentClick}
                  >
                    <Plus className="h-4 w-4" />
                    Agendar Atendimento
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Próximo Agendamento</CardTitle>
            <CardDescription>
              Detalhes do próximo agendamento deste cliente
            </CardDescription>
          </CardHeader>
          <CardContent>
            {nextAppointment ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>Data: {formatDate(nextAppointment.date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>Horário: {nextAppointment.time}</span>
                </div>
                <div>
                  <span className="font-semibold">Serviço:</span> {nextAppointment.service_id || 'N/A'}
                </div>
                {nextAppointment.notes && (
                  <div>
                    <span className="font-semibold">Observações:</span> {nextAppointment.notes}
                  </div>
                )}
              </div>
            ) : (
              <div className="py-4 text-center text-gray-500">
                Nenhum agendamento futuro
                <div className="mt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-1"
                    onClick={onNewAppointmentClick}
                  >
                    <Plus className="h-4 w-4" />
                    Agendar Atendimento
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Informações Adicionais</CardTitle>
          <CardDescription>
            Outras informações relevantes sobre este cliente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold mb-2">Serviço Favorito</h3>
              <p>{client.favorite_service || 'Não definido'}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-2">Total de Visitas</h3>
              <p>{client.total_visits || 0}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default ClientOverview;
