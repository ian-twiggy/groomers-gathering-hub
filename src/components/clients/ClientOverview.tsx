
import React from "react";
import { Client } from "@/integrations/supabase/schema";
import { Appointment } from "@/integrations/supabase/schema";
import { 
  Card, 
  CardHeader, 
  CardContent, 
  CardTitle, 
  CardDescription,
  CardFooter
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
import { Calendar } from "lucide-react";

interface ClientOverviewProps {
  client: Client;
  appointments: Appointment[];
  formatDate: (dateString: string | null) => string;
}

const ClientOverview = ({ client, appointments, formatDate }: ClientOverviewProps) => {
  const upcomingAppointments = appointments.filter(a => 
    a.status === 'upcoming' && new Date(a.date) >= new Date()
  );

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Informações do Cliente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Data de Cadastro</h3>
              <p className="mt-1">{formatDate(client.created_at)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Última Visita</h3>
              <p className="mt-1">{formatDate(client.last_visit)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Total de Visitas</h3>
              <p className="mt-1">{client.total_visits || 0}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Serviço Favorito</h3>
              <p className="mt-1">{client.favorite_service || "Nenhum"}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Próximos Agendamentos</CardTitle>
          <CardDescription>
            Agendamentos futuros para este cliente
          </CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingAppointments.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Hora</TableHead>
                  <TableHead>Serviço</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {upcomingAppointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>{formatDate(appointment.date)}</TableCell>
                    <TableCell>{appointment.time}</TableCell>
                    <TableCell>{appointment.service_id || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge className="bg-green-50 text-green-700 border-green-200 border">
                        Agendado
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
              Nenhum agendamento futuro para este cliente
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            <Calendar className="mr-2 h-4 w-4" /> Agendar Novo Horário
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default ClientOverview;
