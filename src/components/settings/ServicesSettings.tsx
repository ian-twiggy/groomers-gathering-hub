
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Pencil, Trash2, Scissors, Clock, DollarSign } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";

interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
}

const ServicesSettings = () => {
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([
    { id: "1", name: "Corte de Cabelo", duration: 30, price: 40 },
    { id: "2", name: "Barba", duration: 20, price: 30 },
    { id: "3", name: "Corte + Barba", duration: 45, price: 65 },
    { id: "4", name: "Fade", duration: 40, price: 50 },
    { id: "5", name: "Relaxamento", duration: 60, price: 80 }
  ]);
  
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const form = useForm<Service>({
    defaultValues: {
      id: "",
      name: "",
      duration: 30,
      price: 0
    }
  });
  
  const handleEditService = (service: Service) => {
    setEditingService(service);
    form.reset(service);
    setDialogOpen(true);
  };

  const handleAddNewService = () => {
    setEditingService(null);
    form.reset({
      id: Math.random().toString(36).substr(2, 9),
      name: "",
      duration: 30,
      price: 0
    });
    setDialogOpen(true);
  };

  const handleDeleteService = (id: string) => {
    setServices(services.filter(service => service.id !== id));
    toast({
      title: "Serviço removido",
      description: "O serviço foi removido com sucesso."
    });
  };

  const onSubmit = (data: Service) => {
    if (editingService) {
      // Update existing service
      setServices(services.map(service => 
        service.id === data.id ? data : service
      ));
      toast({
        title: "Serviço atualizado",
        description: "O serviço foi atualizado com sucesso."
      });
    } else {
      // Add new service
      setServices([...services, data]);
      toast({
        title: "Serviço adicionado",
        description: "O novo serviço foi adicionado com sucesso."
      });
    }
    setDialogOpen(false);
  };

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
        <div className="rounded-md border">
          <div className="grid grid-cols-12 gap-4 p-4 font-medium border-b bg-muted/50">
            <div className="col-span-5">Nome do Serviço</div>
            <div className="col-span-2">Duração</div>
            <div className="col-span-3">Preço</div>
            <div className="col-span-2 text-right">Ações</div>
          </div>
          <div className="divide-y">
            {services.map((service) => (
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
                  R$ {service.price.toFixed(2)}
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
            ))}
          </div>
        </div>
        
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
                      </FormItem>
                    )}
                  />
                </div>
                
                <DialogFooter>
                  <Button type="submit">
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
