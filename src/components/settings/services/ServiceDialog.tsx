
import React from "react";
import { Service } from "@/integrations/supabase/schema";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ServiceForm, { ServiceFormValues } from "./ServiceForm";

interface ServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingService: Service | null;
  onSubmit: (data: ServiceFormValues) => void;
  isSubmitting: boolean;
}

const ServiceDialog = ({ 
  open, 
  onOpenChange, 
  editingService, 
  onSubmit, 
  isSubmitting 
}: ServiceDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingService ? "Editar Serviço" : "Adicionar Novo Serviço"}
          </DialogTitle>
          <DialogDescription>
            {editingService 
              ? "Faça as alterações necessárias no serviço selecionado." 
              : "Preencha as informações para adicionar um novo serviço."}
          </DialogDescription>
        </DialogHeader>
        
        <ServiceForm 
          editingService={editingService}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ServiceDialog;
