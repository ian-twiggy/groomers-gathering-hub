
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getClient, updateClient, deleteClient } from "@/services/clientService";
import { getAppointments } from "@/services/appointmentService";
import { Client } from "@/integrations/supabase/schema";
import { Appointment } from "@/integrations/supabase/schema";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogContent, AlertDialogAction, AlertDialogCancel, 
         AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, 
         AlertDialogTitle } from "@/components/ui/alert-dialog";

// Import our new components
import ClientDetailHeader from "./ClientDetailHeader";
import ClientInfoCard from "./ClientInfoCard";
import ClientOverview from "./ClientOverview";
import AppointmentHistory from "./AppointmentHistory";
import ClientDetailError from "./ClientDetailError";

const ClientDetail = () => {
  const { id } = useParams<{ id: string }>();
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
      
      // Navigation will be handled by ClientDetailHeader
      window.location.href = "/clients";
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
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  
  if (!client) {
    return <ClientDetailError />;
  }

  return (
    <div className="space-y-6">
      <ClientDetailHeader 
        clientId={id || ''} 
        onDeleteClick={() => setConfirmDelete(true)} 
      />
      
      <ClientInfoCard 
        client={client} 
        onStatusChange={handleStatusChange} 
      />
      
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="appointments">Histórico de Agendamentos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <ClientOverview 
            client={client} 
            appointments={appointments} 
            formatDate={formatDate} 
          />
        </TabsContent>
        
        <TabsContent value="appointments">
          <AppointmentHistory 
            appointments={appointments} 
            formatDate={formatDate} 
          />
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
