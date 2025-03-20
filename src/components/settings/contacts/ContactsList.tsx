
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, UserPlus, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Client } from "@/integrations/supabase/schema";

interface ContactsListProps {
  contacts: any[];
  onImportContact: (contact: any) => void;
  onImportAll: () => void;
  onRemoveContact: (index: number) => void;
  isImporting: boolean;
}

const ContactsList: React.FC<ContactsListProps> = ({
  contacts,
  onImportContact,
  onImportAll,
  onRemoveContact,
  isImporting
}) => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");

  // Filter contacts based on search
  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    contact.phone.includes(searchQuery)
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input
          placeholder="Pesquisar contatos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
        {contacts.length > 0 && (
          <Button 
            onClick={onImportAll} 
            className="flex items-center gap-2"
            disabled={isImporting}
          >
            {isImporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus size={16} />}
            <span>Importar Todos ({contacts.length})</span>
          </Button>
        )}
      </div>
      
      {filteredContacts.length > 0 ? (
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
                        onClick={() => onImportContact(contact)}
                      >
                        <UserPlus className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => {
                          onRemoveContact(index);
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
      ) : contacts.length > 0 ? (
        <p className="text-center py-4 text-muted-foreground">
          Nenhum contato encontrado com o termo "{searchQuery}".
        </p>
      ) : null}
    </div>
  );
};

export default ContactsList;
