
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ClientDetailHeaderProps {
  clientId: string;
  onDeleteClick: () => void;
}

const ClientDetailHeader = ({ clientId, onDeleteClick }: ClientDetailHeaderProps) => {
  const navigate = useNavigate();

  return (
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
          onClick={() => navigate(`/clients/${clientId}/edit`)}
        >
          <Edit className="mr-2 h-4 w-4" /> Editar
        </Button>
        <Button 
          variant="destructive" 
          onClick={onDeleteClick}
        >
          <Trash2 className="mr-2 h-4 w-4" /> Remover
        </Button>
      </div>
    </div>
  );
};

export default ClientDetailHeader;
