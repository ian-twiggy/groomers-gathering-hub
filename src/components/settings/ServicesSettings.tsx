
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Pencil, Trash2, Scissors, Clock, DollarSign } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Service } from "@/integrations/supabase/schema";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getServices, createService, updateService, deleteService } from "@/services/serviceService";
import { Textarea } from "@/components/ui/textarea";

// Schema para validação de serviços
const serviceSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
  duration: z.number().min(5, "Duração mínima de 5 minutos"),
  price: z.number().min(0, "Preço deve ser um valor positivo"),
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

const ServicesSettings = () => {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const queryClient = useQueryClient();

  // Formulário com validação
  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: "",
      description: "",
      duration: 30,
      price: 0,
    }
  });

  // Consulta para buscar a lista de serviços
  const { data: services = [], isLoading, error } = useQuery({
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
    },
    onError: (error: any) => {
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
      toast({
        title: "Erro ao remover serviço",
        description: error.message || "Ocorreu um erro ao remover o serviço.",
        variant: "destructive"
      });
    }
  });

  const handleAddNewService = () => {
    setEditingService(null);
    form.reset({
      name: "",
      description: "",
      duration: 30,
      price: 0
    });
    setDialogOpen(true);
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    form.reset({
      id: service.id,
      name: service.name,
      description: service.description || "",
      duration: service.duration,
      price: Number(service.price)
    });
    setDialogOpen(true);
  };

  const handleDeleteService = (id: string) => {
    if (confirm("Tem certeza que deseja remover este serviço?")) {
      deleteMutation.mutate(id);
    }
  };

  const onSubmit = (data: ServiceFormValues) => {
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

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Serviços</CardTitle>
          <CardDescription>
            Erro ao carregar serviços. Por favor, tente novamente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-red-500">
            {(error as Error).message}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle>Serviços</CardTitle>
          <CardDescription>
            Gerencie os serviços oferecidos pela sua barbearia.
          </CardDescription>
        </div>
        <Button onClick={handleAddNewService} className="flex items-center gap-2">
          <Plus size={16} />
          Novo Serviço
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-6">
            <div className="animate-pulse">Carregando serviços...</div>
          </div>
        ) : (
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
                        onClick={() => handleEditService(service)}
                      >
                        <Pencil size={16} />
                        <span className="sr-only">Editar</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteService(service.id)}
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
        )}
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
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
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Serviço</FormLabel>
                      <FormControl>
                        <Input placeholder="ex: Corte de Cabelo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição (opcional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Descreva os detalhes do serviço"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duração (minutos)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min={5} 
                            step={5} 
                            {...field}
                            onChange={e => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preço (R$)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min={0} 
                            step={0.5} 
                            {...field}
                            onChange={e => field.onChange(parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <DialogFooter>
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                    className="mr-2"
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                    {editingService ? "Salvar Alterações" : "Adicionar Serviço"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default ServicesSettings;
