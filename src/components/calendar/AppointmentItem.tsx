
import React from "react";
import { MoreVertical, Clock } from "lucide-react";
import { Appointment } from "@/integrations/supabase/schema";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AppointmentItemProps {
  appointment: Appointment;
  client: { name: string; image?: string } | null;
  onDelete: (appointment: Appointment) => void;
}

const AppointmentItem = ({ appointment, client, onDelete }: AppointmentItemProps) => {
  return (
    <div className="flex items-center justify-between p-2 md:p-3 bg-white rounded-md shadow-sm border border-gray-100">
      <div className="flex items-center space-x-2 md:space-x-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={client?.image} alt={client?.name || 'Cliente'} />
          <AvatarFallback>{client?.name ? client.name.charAt(0) : 'C'}</AvatarFallback>
        </Avatar>
        <div>
          <h4 className="font-medium text-sm">
            {client?.name || 'Cliente não encontrado'}
          </h4>
          <div className="flex items-center space-x-1 md:space-x-2 text-xs text-gray-500">
            <span className="truncate max-w-[80px] md:max-w-full">
              {appointment.service_id || 'Serviço não especificado'}
            </span>
            <span>•</span>
            <div className="flex items-center whitespace-nowrap">
              <Clock className="mr-1 h-3 w-3" />
              {appointment.duration} min
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center">
        <Badge className="hidden sm:flex mr-2 bg-green-50 text-green-700 hover:bg-green-100 border border-green-200">
          {appointment.status === 'completed' 
            ? 'Concluído' 
            : appointment.status === 'cancelled'
            ? 'Cancelado'
            : 'Confirmado'}
        </Badge>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Editar</DropdownMenuItem>
            <DropdownMenuItem>Remarcar</DropdownMenuItem>
            <DropdownMenuItem 
              className="text-red-600"
              onClick={() => onDelete(appointment)}
            >
              Cancelar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default AppointmentItem;
