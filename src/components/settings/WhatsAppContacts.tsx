
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { Upload, Trash2, UserPlus, Phone, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Client } from "@/integrations/supabase/schema";
import { getClients, createClient } from "@/services/clientService";

const WhatsAppContacts = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [uploadedContacts, setUploadedContacts] = useState<any[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // This is a placeholder for parsing WhatsApp contact exports
    // In a real implementation, you would parse the actual WhatsApp export format
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        // Simulating contacts from a CSV or JSON file
        // In a real implementation, this would parse the actual file format
        const mockContacts = [
          { name: "João Silva", phone: "+5511987654321" },
          { name: "Maria Oliveira", phone: "+5511976543210" },
          { name: "Pedro Santos", phone: "+5511965432109" },
          { name: "Ana Souza", phone: "+5511954321098" },
          { name: "Carlos Pereira", phone: "+5511943210987" }
        ];
        setUploadedContacts(mockContacts);
        toast({
          title: "Contatos carregados",
          description: `${mockContacts.length} contatos encontrados no arquivo.`
        });
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível ler o arquivo de contatos.",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
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

  const filteredContacts = uploadedContacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    contact.phone.includes(searchQuery)
  );

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
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <Button variant="outline" className="flex items-center gap-2" asChild>
              <label>
                <Upload size={16} />
                <span>Importar Contatos</span>
                <Input 
                  type="file" 
                  accept=".csv,.json,.txt" 
                  className="sr-only" 
                  onChange={handleFileUpload}
                />
              </label>
            </Button>
            {uploadedContacts.length > 0 && (
              <Button 
                onClick={importAllContacts} 
                className="flex items-center gap-2"
                disabled={isImporting}
              >
                {isImporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus size={16} />}
                <span>Importar Todos ({uploadedContacts.length})</span>
              </Button>
            )}
          </div>
          
          {uploadedContacts.length > 0 && (
            <div className="space-y-4">
              <Input
                placeholder="Pesquisar contatos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-md"
              />
              
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Telefone</TableHead>
                      <TableHead className="w-[100px]">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredContacts.map((contact, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{contact.name}</TableCell>
                        <TableCell>{contact.phone}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => importContact(contact)}
                            >
                              <UserPlus className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => {
                                setUploadedContacts(prev => prev.filter((_, i) => i !== index));
                                toast({
                                  title: "Contato removido",
                                  description: "O contato foi removido da lista."
                                });
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-4">Clientes Recentes</h3>
          {isLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {existingClients?.slice(0, 5).map((client) => (
                    <TableRow key={client.id}>
                      <TableCell className="font-medium">{client.name}</TableCell>
                      <TableCell>{client.email}</TableCell>
                      <TableCell>
                        {client.phone ? (
                          <div className="flex items-center gap-1">
                            <Phone className="h-4 w-4" />
                            {client.phone}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Não cadastrado</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className={`px-2 py-1 rounded-full text-xs inline-block
                          ${client.status === 'active' ? 'bg-green-100 text-green-800' : 
                            client.status === 'new' ? 'bg-blue-100 text-blue-800' : 
                            'bg-gray-100 text-gray-800'}`}>
                          {client.status === 'active' ? 'Ativo' : 
                           client.status === 'new' ? 'Novo' : 
                           client.status === 'inactive' ? 'Inativo' : client.status}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {(!existingClients || existingClients.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                        Nenhum cliente cadastrado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
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
