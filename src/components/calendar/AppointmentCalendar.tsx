
import React, { useState } from "react";
import { Calendar as CalendarIcon, Clock, MoreVertical } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";

const timeSlots = [
  "09:00", "10:00", "11:00", "12:00", "13:00", 
  "14:00", "15:00", "16:00", "17:00",
];

interface Appointment {
  id: string;
  clientName: string;
  clientImage?: string;
  service: string;
  time: string;
  duration: string;
}

// Mock data for appointments
const mockAppointments: Record<string, Appointment[]> = {
  "2023-09-20": [
    {
      id: "1",
      clientName: "Carlos Silva",
      service: "Corte de Cabelo",
      time: "10:00",
      duration: "30min",
    },
    {
      id: "2",
      clientName: "João Mendes",
      service: "Barba",
      time: "11:00",
      duration: "45min",
    },
    {
      id: "3",
      clientName: "Pedro Costa",
      clientImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
      service: "Corte e Barba",
      time: "14:00",
      duration: "1h",
    },
  ],
  "2023-09-21": [
    {
      id: "4",
      clientName: "André Santos",
      service: "Corte de Cabelo",
      time: "09:00",
      duration: "30min",
    },
    {
      id: "5",
      clientName: "Roberto Pereira",
      clientImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
      service: "Corte e Barba",
      time: "15:00",
      duration: "1h",
    },
  ],
};

// Format date as "YYYY-MM-DD" for matching with mockAppointments keys
const formatDateForKey = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

const AppointmentCalendar = () => {
  const [date, setDate] = useState<Date>(new Date());
  const formattedDate = formatDateForKey(date);
  const dayAppointments = mockAppointments[formattedDate] || [];
  const isMobile = useIsMobile();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className={`${isMobile ? 'order-1' : ''} col-span-1 h-min`}>
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
                { label: "Total de Agendamentos", value: "48" },
                { label: "Concluídos", value: "32" },
                { label: "Cancelados", value: "3" },
                { label: "Pendentes", value: "13" },
              ].map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span className="text-gray-600">{item.label}</span>
                  <span className="font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
          
          <Button className="w-full mt-6">Novo Agendamento</Button>
        </CardContent>
      </Card>
      
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <CardTitle className="flex items-center">
                <CalendarIcon className="mr-2 h-5 w-5" />
                {date.toLocaleDateString("pt-BR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </CardTitle>
              <CardDescription>
                {dayAppointments.length} agendamentos para hoje
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                Semana
              </Button>
              <Button variant="outline" size="sm" className="bg-gray-900 text-white">
                Dia
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <div className="grid grid-cols-1 gap-4">
            {timeSlots.map((time) => {
              const appointmentsAtTime = dayAppointments.filter(
                (appt) => appt.time === time
              );
              
              return (
                <div key={time} className="grid grid-cols-[70px_1fr] md:grid-cols-[80px_1fr] gap-2 md:gap-4">
                  <div className="flex items-center justify-end">
                    <span className="text-sm font-medium text-gray-600">
                      {time}
                    </span>
                  </div>
                  
                  <div className="flex-1 min-h-[64px] rounded-lg border border-dashed border-gray-200 bg-gray-50 p-1">
                    {appointmentsAtTime.length > 0 ? (
                      <div className="grid grid-cols-1 gap-2">
                        {appointmentsAtTime.map((appointment) => (
                          <div
                            key={appointment.id}
                            className="flex items-center justify-between p-2 md:p-3 bg-white rounded-md shadow-sm border border-gray-100"
                          >
                            <div className="flex items-center space-x-2 md:space-x-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={appointment.clientImage} alt={appointment.clientName} />
                                <AvatarFallback>{appointment.clientName.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-medium text-sm">
                                  {appointment.clientName}
                                </h4>
                                <div className="flex items-center space-x-1 md:space-x-2 text-xs text-gray-500">
                                  <span className="truncate max-w-[80px] md:max-w-full">{appointment.service}</span>
                                  <span>•</span>
                                  <div className="flex items-center whitespace-nowrap">
                                    <Clock className="mr-1 h-3 w-3" />
                                    {appointment.duration}
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center">
                              <Badge className="hidden sm:flex mr-2 bg-green-50 text-green-700 hover:bg-green-100 border border-green-200">
                                Confirmado
                              </Badge>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>Editar</DropdownMenuItem>
                                  <DropdownMenuItem>Remarcar</DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600">Cancelar</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-900">
                          + Agendar
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentCalendar;
