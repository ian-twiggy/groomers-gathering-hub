
import React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Appointment } from "@/integrations/supabase/schema";

interface CalendarSidebarProps {
  date: Date;
  setDate: (date: Date) => void;
  appointments: Appointment[];
  onNewAppointment: () => void;
}

const CalendarSidebar = ({
  date,
  setDate,
  appointments,
  onNewAppointment,
}: CalendarSidebarProps) => {
  return (
    <Card className="col-span-1 h-min">
      <CardHeader>
        <CardTitle>Calendário</CardTitle>
        <CardDescription>
          Selecione uma data para ver os agendamentos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={date}
          onSelect={(newDate) => newDate && setDate(newDate)}
          className="rounded-md border p-3 mx-auto"
        />
        
        <div className="mt-6">
          <h3 className="font-medium text-gray-900 mb-3">Resumo do Mês</h3>
          <div className="space-y-2">
            {[
              { label: "Total de Agendamentos", value: appointments.length.toString() },
              { label: "Concluídos", value: appointments.filter(a => a.status === 'completed').length.toString() },
              { label: "Cancelados", value: appointments.filter(a => a.status === 'cancelled').length.toString() },
              { label: "Pendentes", value: appointments.filter(a => a.status === 'upcoming').length.toString() },
            ].map((item, index) => (
              <div key={index} className="flex justify-between">
                <span className="text-gray-600">{item.label}</span>
                <span className="font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
        
        <Button 
          className="w-full mt-6"
          onClick={onNewAppointment}
        >
          Novo Agendamento
        </Button>
      </CardContent>
    </Card>
  );
};

export default CalendarSidebar;
