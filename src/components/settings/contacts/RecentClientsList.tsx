
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Client } from "@/integrations/supabase/schema";
import { Phone, Loader2 } from "lucide-react";

interface RecentClientsListProps {
  clients?: Client[];
  isLoading: boolean;
}

const RecentClientsList: React.FC<RecentClientsListProps> = ({
  clients,
  isLoading
}) => {
  return (
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
              {clients?.slice(0, 5).map((client) => (
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
              {(!clients || clients.length === 0) && (
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
  );
};

export default RecentClientsList;
