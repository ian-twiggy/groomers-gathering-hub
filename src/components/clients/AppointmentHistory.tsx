
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

interface AppointmentHistoryProps {
  appointments: Appointment[];
  formatDate: (dateString: string | null) => string;
}

const AppointmentHistory = ({ appointments, formatDate }: AppointmentHistoryProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Agendamentos</CardTitle>
        <CardDescription>
          Todos os agendamentos deste cliente
        </CardDescription>
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
                    <Button size="sm" variant="outline">Ver</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Nenhum agendamento encontrado para este cliente
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AppointmentHistory;
