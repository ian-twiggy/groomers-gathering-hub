
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getClients } from "@/services/clientService";
import { createAppointment } from "@/services/appointmentService";
import { Client } from "@/integrations/supabase/schema";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const availableTimeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", 
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", 
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00"
];

const availableServices = [
  { id: "1", name: "Corte de Cabelo", duration: 30 },
  { id: "2", name: "Barba", duration: 20 },
  { id: "3", name: "Corte e Barba", duration: 45 },
  { id: "4", name: "Platinado", duration: 90 },
  { id: "5", name: "Hidratação", duration: 60 },
];

const appointmentSchema = z.object({
  client_id: z.string({
    required_error: "Selecione um cliente",
  }),
  date: z.date({
    required_error: "Selecione uma data",
  }),
  time: z.string({
    required_error: "Selecione um horário",
  }),
  service_id: z.string({
    required_error: "Selecione um serviço",
  }),
  duration: z.number({
    required_error: "Duração é obrigatória",
  }),
  notes: z.string().optional(),
  status: z.string().default("upcoming"),
});

type AppointmentFormValues = z.infer<typeof appointmentSchema>;

interface NewAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate?: Date;
  selectedClient?: string;
  onSuccess?: () => void;
}

const NewAppointmentDialog = ({ 
  open, 
  onOpenChange, 
  selectedDate = new Date(),
  selectedClient,
  onSuccess 
}: NewAppointmentDialogProps) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      date: selectedDate,
      notes: "",
      status: "upcoming",
    },
  });
  
  // Update form when selectedDate changes
  useEffect(() => {
    form.setValue("date", selectedDate);
  }, [selectedDate, form]);
  
  // Update form when selectedClient changes
  useEffect(() => {
    if (selectedClient) {
      form.setValue("client_id", selectedClient);
    }
  }, [selectedClient, form]);
  
  // Update duration when service changes
  useEffect(() => {
    const serviceId = form.watch("service_id");
    if (serviceId) {
      const service = availableServices.find(s => s.id === serviceId);
      if (service) {
        form.setValue("duration", service.duration);
      }
    }
  }, [form.watch("service_id"), form]);
  
  useEffect(() => {
    const fetchClients = async () => {
      if (!open) return;
      
      try {
        setLoading(true);
        const data = await getClients();
        setClients(data.filter(client => client.status === 'active'));
      } catch (error: any) {
        console.error("Error fetching clients:", error.message);
        toast({
          title: "Erro ao carregar clientes",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchClients();
  }, [open, toast]);
  
  const onSubmit = async (data: AppointmentFormValues) => {
    try {
      await createAppointment({
        client_id: data.client_id,
        service_id: data.service_id,
        date: format(data.date, 'yyyy-MM-dd'),
        time: data.time,
        duration: data.duration,
        notes: data.notes || null,
        status: data.status,
      });
      
      toast({
        title: "Agendamento criado com sucesso",
        description: `O agendamento foi criado para ${format(data.date, 'dd/MM/yyyy')} às ${data.time}.`,
      });
      
      form.reset();
      onOpenChange(false);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Error creating appointment:", error);
      
      toast({
        title: "Erro ao criar agendamento",
        description: error.message || "Ocorreu um erro ao criar o agendamento.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Novo Agendamento</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="client_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cliente</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um cliente" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {loading ? (
                        <div className="flex justify-center p-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                        </div>
                      ) : (
                        clients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: ptBR })
                            ) : (
                              <span>Selecione uma data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Horário</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um horário" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableTimeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="service_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Serviço</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um serviço" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableServices.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.name} ({service.duration} min)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Adicione observações sobre o agendamento..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">Criar Agendamento</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewAppointmentDialog;
