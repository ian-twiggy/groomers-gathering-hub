
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Service } from "@/integrations/supabase/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

// Schema para validação de serviços
export const serviceSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
  duration: z.number().min(5, "Duração mínima de 5 minutos"),
  price: z.number().min(0, "Preço deve ser um valor positivo"),
});

export type ServiceFormValues = z.infer<typeof serviceSchema>;

interface ServiceFormProps {
  editingService: Service | null;
  onSubmit: (data: ServiceFormValues) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const ServiceForm = ({
  editingService,
  onSubmit,
  onCancel,
  isSubmitting
}: ServiceFormProps) => {
  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      id: editingService?.id || undefined,
      name: editingService?.name || "",
      description: editingService?.description || "",
      duration: editingService?.duration || 30,
      price: editingService ? Number(editingService.price) : 0,
    }
  });

  return (
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
            onClick={onCancel}
            className="mr-2"
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {editingService ? "Salvar Alterações" : "Adicionar Serviço"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default ServiceForm;
