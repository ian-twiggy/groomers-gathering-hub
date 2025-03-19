
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import { Clock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const timeOptions = [
  "Fechado",
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
  "21:30",
  "22:00",
];

const DaySchedule = ({ day, control, index }: { day: string, control: any, index: number }) => {
  return (
    <div className="flex items-center justify-between py-4 border-b last:border-0">
      <div className="font-medium">{day}</div>
      <div className="flex items-center gap-4">
        <FormField
          control={control}
          name={`days.${index}.enabled`}
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2 space-y-0">
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="text-sm text-muted-foreground">
                {field.value ? "Aberto" : "Fechado"}
              </div>
            </FormItem>
          )}
        />
        
        <div className="flex items-center gap-2">
          <FormField
            control={control}
            name={`days.${index}.start`}
            render={({ field }) => (
              <FormItem className="w-24">
                <Select
                  disabled={!control._formValues.days[index].enabled}
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Início" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.slice(1).map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          
          <span className="text-muted-foreground">até</span>
          
          <FormField
            control={control}
            name={`days.${index}.end`}
            render={({ field }) => (
              <FormItem className="w-24">
                <Select
                  disabled={!control._formValues.days[index].enabled}
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Fim" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.slice(1).map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
};

const WorkingHoursSettings = () => {
  const { toast } = useToast();
  const form = useForm({
    defaultValues: {
      days: [
        { day: "Segunda", enabled: true, start: "09:00", end: "19:00" },
        { day: "Terça", enabled: true, start: "09:00", end: "19:00" },
        { day: "Quarta", enabled: true, start: "09:00", end: "19:00" },
        { day: "Quinta", enabled: true, start: "09:00", end: "19:00" },
        { day: "Sexta", enabled: true, start: "09:00", end: "20:00" },
        { day: "Sábado", enabled: true, start: "09:00", end: "18:00" },
        { day: "Domingo", enabled: false, start: "09:00", end: "18:00" },
      ]
    }
  });

  const onSubmit = (data: any) => {
    toast({
      title: "Horários atualizados",
      description: "Seus horários de funcionamento foram atualizados com sucesso."
    });
    console.log(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Horário de Funcionamento</CardTitle>
        <CardDescription>
          Configure os dias e horários em que sua barbearia estará aberta.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-4">
              {form.getValues().days.map((day, index) => (
                <DaySchedule 
                  key={day.day} 
                  day={day.day} 
                  control={form.control} 
                  index={index} 
                />
              ))}
            </div>
            
            <Button type="submit" className="mt-4 flex items-center gap-2">
              <Clock size={16} />
              Salvar Horários
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default WorkingHoursSettings;
