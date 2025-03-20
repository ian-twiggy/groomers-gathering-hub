
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Client } from "@/integrations/supabase/schema";
import { getClients, createClient } from "@/services/clientService";
import ContactImport from "./contacts/ContactImport";
import ContactsList from "./contacts/ContactsList";
import RecentClientsList from "./contacts/RecentClientsList";

const WhatsAppContacts = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [uploadedContacts, setUploadedContacts] = useState<any[]>([]);
  const [isImporting, setIsImporting] = useState(false);

  // Query to fetch existing clients
  const { data: existingClients, isLoading } = useQuery({
    queryKey: ["clients"],
    queryFn: getClients
  });

  // Mutation to create a new client
  const createClientMutation = useMutation({
    mutationFn: (clientData: Omit<Client, 'id' | 'created_at' | 'updated_at'>) => 
      createClient(clientData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast({
        title: "Cliente adicionado",
        description: "O cliente foi adicionado com sucesso."
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o cliente: " + error.message,
        variant: "destructive"
      });
    }
  });

  const handleContactsUploaded = (contacts: any[]) => {
    setUploadedContacts(contacts);
  };

  const importContact = (contact: any) => {
    createClientMutation.mutate({
      name: contact.name,
      email: `${contact.name.replace(/\s/g, "").toLowerCase()}@placeholder.com`, // Placeholder email
      phone: contact.phone,
      image_url: null,
      last_visit: null,
      total_visits: 0,
      favorite_service: null,
      status: "new"
    });
  };

  const importAllContacts = () => {
    setIsImporting(true);
    // In a real implementation, you would batch these operations or use a transaction
    const promises = uploadedContacts.map(contact => 
      createClientMutation.mutate({
        name: contact.name,
        email: `${contact.name.replace(/\s/g, "").toLowerCase()}@placeholder.com`, // Placeholder email
        phone: contact.phone,
        image_url: null,
        last_visit: null,
        total_visits: 0,
        favorite_service: null,
        status: "new"
      })
    );
    
    Promise.all(promises)
      .then(() => {
        toast({
          title: "Importação concluída",
          description: `${uploadedContacts.length} contatos foram importados com sucesso.`
        });
        setUploadedContacts([]);
      })
      .catch(error => {
        toast({
          title: "Erro",
          description: "Não foi possível importar todos os contatos: " + error.message,
          variant: "destructive"
        });
      })
      .finally(() => {
        setIsImporting(false);
      });
  };

  const removeContact = (index: number) => {
    setUploadedContacts(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contatos do WhatsApp</CardTitle>
        <CardDescription>
          Importe seus contatos do WhatsApp para migrar seus clientes para a plataforma.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col space-y-4">
          <ContactImport 
            onImportContacts={handleContactsUploaded}
            isImporting={isImporting}
          />
          
          {uploadedContacts.length > 0 && (
            <ContactsList 
              contacts={uploadedContacts}
              onImportContact={importContact}
              onImportAll={importAllContacts}
              onRemoveContact={removeContact}
              isImporting={isImporting}
            />
          )}
        </div>
        
        <RecentClientsList 
          clients={existingClients}
          isLoading={isLoading}
        />
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <p className="text-sm text-muted-foreground">
          Para importar contatos do WhatsApp, exporte seus contatos do aplicativo e importe o arquivo aqui.
        </p>
        <p className="text-sm text-muted-foreground">
          Dica: Você pode adicionar detalhes adicionais aos clientes depois de importá-los.
        </p>
      </CardFooter>
    </Card>
  );
};

export default WhatsAppContacts;
