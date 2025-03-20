
import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell 
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar, Phone, Mail, MoreHorizontal } from "lucide-react";
import { Client } from "@/integrations/supabase/schema";

interface ClientTableProps {
  clients: Client[];
  loading: boolean;
  onCreateAppointment: (clientId: string) => void;
}

// Status styling maps
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

const formatDateString = (dateString: string | null) => {
  if (!dateString) return "Nunca";
  
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
};

const ClientTable: React.FC<ClientTableProps> = ({ 
  clients, 
  loading, 
  onCreateAppointment 
}) => {
  const navigate = useNavigate();
  
  const navigateToClientDetail = (id: string) => {
    navigate(`/clients/${id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (clients.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Nenhum cliente encontrado
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead className="hidden md:table-cell">Contato</TableHead>
              <TableHead className="hidden sm:table-cell">Última Visita</TableHead>
              <TableHead className="hidden lg:table-cell">Total Visitas</TableHead>
              <TableHead className="hidden lg:table-cell">Serviço Favorito</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => (
              <TableRow 
                key={client.id} 
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => navigateToClientDetail(client.id)}
              >
                <TableCell className="px-3 sm:px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={client.image_url || undefined} alt={client.name} />
                      <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{client.name}</div>
                      <div className="text-xs text-gray-500 md:hidden">{client.phone}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500 flex flex-col">
                    <div className="flex items-center">
                      <Mail className="h-3 w-3 mr-1" />
                      {client.email}
                    </div>
                    <div className="flex items-center mt-1">
                      <Phone className="h-3 w-3 mr-1" />
                      {client.phone || "—"}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{formatDateString(client.last_visit)}</div>
                </TableCell>
                <TableCell className="hidden lg:table-cell px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{client.total_visits}</div>
                </TableCell>
                <TableCell className="hidden lg:table-cell px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{client.favorite_service || "—"}</div>
                </TableCell>
                <TableCell className="px-3 sm:px-6 py-4 whitespace-nowrap">
                  <Badge className={`${statusColorMap[client.status as keyof typeof statusColorMap]} border`}>
                    {statusTextMap[client.status as keyof typeof statusTextMap]}
                  </Badge>
                </TableCell>
                <TableCell className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500" onClick={(e) => e.stopPropagation()}>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        onCreateAppointment(client.id);
                      }}
                    >
                      <Calendar className="h-4 w-4" />
                    </Button>
                    
                    <ClientActions 
                      client={client}
                      onViewDetails={() => navigateToClientDetail(client.id)}
                      onCreateAppointment={onCreateAppointment}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

// Client Actions component (dropdown menu)
interface ClientActionsProps {
  client: Client;
  onViewDetails: () => void;
  onCreateAppointment: (clientId: string) => void;
}

const ClientActions: React.FC<ClientActionsProps> = ({ 
  client, 
  onViewDetails, 
  onCreateAppointment 
}) => {
  const navigate = useNavigate();
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onViewDetails}>
          Ver Perfil
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate(`/clients/${client.id}/edit`)}>
          Editar
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onCreateAppointment(client.id)}>
          Agendar
        </DropdownMenuItem>
        {client.status === 'active' ? (
          <DropdownMenuItem className="text-red-600">
            Desativar
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem className="text-green-600">
            Ativar
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ClientTable;
