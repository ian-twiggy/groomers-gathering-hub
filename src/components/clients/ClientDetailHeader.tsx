
import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Edit, Trash2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ClientDetailHeaderProps {
  clientId: string;
  onDeleteClick: () => void;
  onNewAppointmentClick: () => void;
}

const ClientDetailHeader = ({ 
  clientId, 
  onDeleteClick,
  onNewAppointmentClick
}: ClientDetailHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <Link to="/clients">
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Detalhes do Cliente</h1>
      </div>
      
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1"
          onClick={onNewAppointmentClick}
        >
          <Calendar className="h-4 w-4" />
          Novo Agendamento
        </Button>
        
        <Link to={`/clients/${clientId}/edit`}>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Edit className="h-4 w-4" />
            Editar
          </Button>
        </Link>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1 text-red-500" 
          onClick={onDeleteClick}
        >
          <Trash2 className="h-4 w-4" />
          Remover
        </Button>
      </div>
    </div>
  );
};

export default ClientDetailHeader;
