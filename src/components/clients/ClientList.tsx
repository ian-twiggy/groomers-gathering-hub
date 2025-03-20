
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getClients } from "@/services/clientService";
import { Client } from "@/integrations/supabase/schema";
import { useToast } from "@/hooks/use-toast";
import NewClientForm from "./NewClientForm";
import ClientSearch from "./ClientSearch";
import ClientTable from "./ClientTable";
import ClientPagination from "./ClientPagination";

const ClientList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewClientForm, setShowNewClientForm] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchClients();
  }, []);
  
  const fetchClients = async () => {
    try {
      setLoading(true);
      const data = await getClients();
      setClients(data);
    } catch (error: any) {
      console.error("Error fetching clients:", error.message);
      toast({
        title: "Erro ao carregar clientes",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Filter clients based on search query
  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (client.phone && client.phone.includes(searchQuery))
  );
  
  const handleCreateAppointment = (clientId: string) => {
    // Navigate to appointment creation page with client pre-selected
    navigate(`/calendar/new?client=${clientId}`);
  };

  return (
    <Card>
      <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
        <CardTitle>Clientes</CardTitle>
        <ClientSearch 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onNewClient={() => setShowNewClientForm(true)}
        />
      </CardHeader>
      <CardContent className="px-2 sm:px-4 md:px-6">
        <ClientTable 
          clients={filteredClients}
          loading={loading}
          onCreateAppointment={handleCreateAppointment}
        />
        
        <ClientPagination 
          totalCount={clients.length}
          filteredCount={filteredClients.length}
        />
      </CardContent>
      
      <NewClientForm 
        open={showNewClientForm} 
        onOpenChange={setShowNewClientForm} 
        onSuccess={fetchClients}
      />
    </Card>
  );
};

export default ClientList;
