
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getClient, updateClient, deleteClient } from "@/services/clientService";
import { getAppointments } from "@/services/appointmentService";
import { Client } from "@/integrations/supabase/schema";
import { Appointment } from "@/integrations/supabase/schema";
import { useToast } from "@/hooks/use-toast";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import {
  ArrowLeft,
  Calendar,
  Mail,
  Phone,
  Edit,
  Trash2,
  AlertCircle,
} from "lucide-react";
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

const ClientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [client, setClient] = useState<Client | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        if (!id) return;
        
        const clientData = await getClient(id);
        setClient(clientData);
        
        // Get client appointments
        const appointmentsData = await getAppointments();
        const clientAppointments = appointmentsData.filter(
          (appointment) => appointment.client_id === id
        );
        setAppointments(clientAppointments);
      } catch (error: any) {
        console.error("Error fetching client data:", error);
        toast({
          title: "Erro ao carregar dados",
          description: error.message || "Ocorreu um erro ao carregar os dados do cliente.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id, toast]);
  
  const handleStatusChange = async (newStatus: 'active' | 'inactive' | 'new') => {
    if (!client || !id) return;
    
    try {
      await updateClient(id, { status: newStatus });
      
      setClient({ ...client, status: newStatus });
      
      toast({
        title: "Status atualizado",
        description: `O status do cliente foi atualizado para ${newStatus === 'active' ? 'Ativo' : newStatus === 'inactive' ? 'Inativo' : 'Novo'}.`,
      });
    } catch (error: any) {
      console.error("Error updating client status:", error);
      toast({
        title: "Erro ao atualizar status",
        description: error.message || "Ocorreu um erro ao atualizar o status do cliente.",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteClient = async () => {
    if (!id) return;
    
    try {
      await deleteClient(id);
      
      toast({
        title: "Cliente removido",
        description: "O cliente foi removido com sucesso.",
      });
      
      navigate("/clients");
    } catch (error: any) {
      console.error("Error deleting client:", error);
      toast({
        title: "Erro ao remover cliente",
        description: error.message || "Ocorreu um erro ao remover o cliente.",
        variant: "destructive",
      });
    }
  };
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };
  
  // Status badge color mapping
  const statusColorMap = {
    active: "bg-green-50 text-green-700 border-green-200",
    inactive: "bg-gray-50 text-gray-700 border-gray-200",
    new: "bg-blue-50 text-blue-700 border-blue-200",
  };
  
  const statusTextMap = {
    active: "Ativo",
    inactive: "Inativo",
    new: "Novo",
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  
  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Cliente não encontrado</h2>
        <p className="text-gray-500 mb-4">O cliente que você está procurando não existe ou foi removido.</p>
        <Button onClick={() => navigate("/clients")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para lista de clientes
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button 
          variant="outline" 
          onClick={() => navigate("/clients")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={() => navigate(`/clients/${id}/edit`)}
          >
            <Edit className="mr-2 h-4 w-4" /> Editar
          </Button>
          <Button 
            variant="destructive" 
            onClick={() => setConfirmDelete(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" /> Remover
          </Button>
        </div>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={client.image_url || undefined} alt={client.name} />
                <AvatarFallback className="text-2xl">{client.name.charAt(0)}</AvatarFallback>
              </Avatar>
              
              <div>
                <h2 className="text-2xl font-bold">{client.name}</h2>
                <div className="flex flex-col mt-1 space-y-1">
                  <div className="flex items-center text-gray-500">
                    <Mail className="h-4 w-4 mr-2" /> {client.email}
                  </div>
                  {client.phone && (
                    <div className="flex items-center text-gray-500">
                      <Phone className="h-4 w-4 mr-2" /> {client.phone}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-start md:items-end space-y-2">
              <Badge className={`${statusColorMap[client.status as keyof typeof statusColorMap]} border`}>
                {statusTextMap[client.status as keyof typeof statusTextMap]}
              </Badge>
              
              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleStatusChange('active')}
                  disabled={client.status === 'active'}
                >
                  Ativar
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleStatusChange('inactive')}
                  disabled={client.status === 'inactive'}
                >
                  Desativar
                </Button>
              </div>
              
              <Button className="flex items-center mt-2">
                <Calendar className="mr-2 h-4 w-4" /> Novo Agendamento
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="appointments">Histórico de Agendamentos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
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
              {appointments.filter(a => a.status === 'upcoming' && new Date(a.date) >= new Date()).length > 0 ? (
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
                    {appointments
                      .filter(a => a.status === 'upcoming' && new Date(a.date) >= new Date())
                      .map((appointment) => (
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
        </TabsContent>
        
        <TabsContent value="appointments">
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
        </TabsContent>
      </Tabs>
      
      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover cliente</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover este cliente? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteClient} className="bg-red-600 hover:bg-red-700">
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ClientDetail;
