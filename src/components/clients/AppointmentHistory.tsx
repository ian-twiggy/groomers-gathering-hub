
import React from "react";
import { Appointment } from "@/integrations/supabase/schema";
import { 
  Card, 
  CardHeader, 
  CardContent, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Plus, Eye } from "lucide-react";
import { Link } from "react-router-dom";

interface AppointmentHistoryProps {
  appointments: Appointment[];
  formatDate: (dateString: string | null) => string;
  onNewAppointmentClick: () => void;
}

const AppointmentHistory = ({ appointments, formatDate, onNewAppointmentClick }: AppointmentHistoryProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Histórico de Agendamentos</CardTitle>
          <CardDescription>
            Todos os agendamentos deste cliente
          </CardDescription>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1"
          onClick={onNewAppointmentClick}
        >
          <Calendar className="h-4 w-4" />
          Novo Agendamento
        </Button>
      </CardHeader>
      <CardContent>
        {appointments.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Hora</TableHead>
                <TableHead>Serviço</TableHead>
                <TableHead>Duração</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>{formatDate(appointment.date)}</TableCell>
                  <TableCell>{appointment.time}</TableCell>
                  <TableCell>{appointment.service_id || 'N/A'}</TableCell>
                  <TableCell>{appointment.duration} min</TableCell>
                  <TableCell>
                    <Badge 
                      className={
                        appointment.status === 'completed' 
                          ? "bg-green-50 text-green-700 border-green-200 border"
                          : appointment.status === 'cancelled'
                          ? "bg-red-50 text-red-700 border-red-200 border"
                          : "bg-blue-50 text-blue-700 border-blue-200 border"
                      }
                    >
                      {appointment.status === 'completed' 
                        ? 'Concluído' 
                        : appointment.status === 'cancelled'
                        ? 'Cancelado'
                        : 'Agendado'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Link to={`/calendar?appointment=${appointment.id}`}>
                      <Button size="sm" variant="outline" className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        Ver
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p className="mb-4">Nenhum agendamento encontrado para este cliente</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1 mx-auto"
              onClick={onNewAppointmentClick}
            >
              <Plus className="h-4 w-4" />
              Agendar Atendimento
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AppointmentHistory;
