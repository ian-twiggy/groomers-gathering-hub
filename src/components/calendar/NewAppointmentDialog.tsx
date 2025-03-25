
import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { getClients } from "@/services/clientService";
import { createAppointment } from "@/services/appointmentService";
import { Client } from "@/integrations/supabase/schema";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import AppointmentFormFields from "./AppointmentFormFields";
import { appointmentSchema, AppointmentFormValues } from "./AppointmentFormData";

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
        
        <FormProvider {...form}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <AppointmentFormFields
                clients={clients}
                loading={loading}
                disableClientField={!!selectedClient}
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
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default NewAppointmentDialog;
