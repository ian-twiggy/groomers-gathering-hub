
import React from "react";
import { Service } from "@/integrations/supabase/schema";
import { Button } from "@/components/ui/button";
import { Scissors, Clock, DollarSign, Pencil, Trash2 } from "lucide-react";

interface ServicesListProps {
  services: Service[];
  isLoading: boolean;
  onEditService: (service: Service) => void;
  onDeleteService: (id: string) => void;
}

const ServicesList = ({ 
  services, 
  isLoading,
  onEditService, 
  onDeleteService 
}: ServicesListProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center p-6">
        <div className="animate-pulse">Carregando serviços...</div>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <div className="grid grid-cols-12 gap-4 p-4 font-medium border-b bg-muted/50">
        <div className="col-span-5">Nome do Serviço</div>
        <div className="col-span-2">Duração</div>
        <div className="col-span-3">Preço</div>
        <div className="col-span-2 text-right">Ações</div>
      </div>
      <div className="divide-y">
        {services.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            Nenhum serviço cadastrado. Clique em "Novo Serviço" para adicionar.
          </div>
        ) : (
          services.map((service) => (
            <div key={service.id} className="grid grid-cols-12 gap-4 p-4 items-center">
              <div className="col-span-5 font-medium flex items-center gap-2">
                <Scissors size={16} className="text-muted-foreground" />
                {service.name}
              </div>
              <div className="col-span-2 flex items-center gap-1">
                <Clock size={14} className="text-muted-foreground" />
                {service.duration} min
              </div>
              <div className="col-span-3 flex items-center gap-1">
                <DollarSign size={14} className="text-muted-foreground" />
                R$ {Number(service.price).toFixed(2)}
              </div>
              <div className="col-span-2 flex justify-end space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onEditService(service)}
                >
                  <Pencil size={16} />
                  <span className="sr-only">Editar</span>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onDeleteService(service.id)}
                >
                  <Trash2 size={16} />
                  <span className="sr-only">Remover</span>
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ServicesList;
