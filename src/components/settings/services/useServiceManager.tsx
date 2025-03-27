
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Service } from "@/integrations/supabase/schema";
import { getServices, createService, updateService, deleteService } from "@/services/serviceService";
import { useToast } from "@/components/ui/use-toast";
import { ServiceFormValues } from "./ServiceForm";

const useServiceManager = () => {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const queryClient = useQueryClient();

  // Consulta para buscar a lista de serviços
  const { 
    data: services = [], 
    isLoading, 
    error, 
    refetch
  } = useQuery({
    queryKey: ['services'],
    queryFn: getServices,
  });

  // Mutação para criar um novo serviço
  const createMutation = useMutation({
    mutationFn: createService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast({
        title: "Serviço adicionado",
        description: "O novo serviço foi adicionado com sucesso."
      });
      setDialogOpen(false);
    },
    onError: (error: any) => {
      console.error("Error creating service:", error);
      toast({
        title: "Erro ao adicionar serviço",
        description: error.message || "Ocorreu um erro ao adicionar o serviço.",
        variant: "destructive"
      });
    }
  });

  // Mutação para atualizar um serviço existente
  const updateMutation = useMutation({
    mutationFn: (service: Service) => updateService(service.id, service),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast({
        title: "Serviço atualizado",
        description: "O serviço foi atualizado com sucesso."
      });
      setDialogOpen(false);
      setEditingService(null);
    },
    onError: (error: any) => {
      console.error("Error updating service:", error);
      toast({
        title: "Erro ao atualizar serviço",
        description: error.message || "Ocorreu um erro ao atualizar o serviço.",
        variant: "destructive"
      });
    }
  });

  // Mutação para deletar um serviço
  const deleteMutation = useMutation({
    mutationFn: deleteService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast({
        title: "Serviço removido",
        description: "O serviço foi removido com sucesso."
      });
    },
    onError: (error: any) => {
      console.error("Error deleting service:", error);
      toast({
        title: "Erro ao remover serviço",
        description: error.message || "Ocorreu um erro ao remover o serviço.",
        variant: "destructive"
      });
    }
  });

  const handleAddNewService = () => {
    setEditingService(null);
    setDialogOpen(true);
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setDialogOpen(true);
  };

  const handleDeleteService = (id: string) => {
    if (confirm("Tem certeza que deseja remover este serviço?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleSubmit = (data: ServiceFormValues) => {
    if (editingService) {
      // Atualizar serviço existente
      updateMutation.mutate({
        id: editingService.id,
        name: data.name,
        description: data.description || null,
        duration: data.duration,
        price: data.price,
        created_at: editingService.created_at,
        updated_at: new Date().toISOString()
      });
    } else {
      // Adicionar novo serviço
      createMutation.mutate({
        name: data.name,
        description: data.description || null,
        duration: data.duration,
        price: data.price
      });
    }
  };

  return {
    services,
    isLoading,
    error,
    refetch,
    dialogOpen,
    setDialogOpen,
    editingService,
    handleAddNewService,
    handleEditService,
    handleDeleteService,
    handleSubmit,
    isSubmitting: createMutation.isPending || updateMutation.isPending
  };
};

export default useServiceManager;
