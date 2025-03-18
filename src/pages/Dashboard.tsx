import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Stats from "@/components/dashboard/Stats";
import AppointmentCard from "@/components/dashboard/AppointmentCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, CalendarClock, ArrowRight, TrendingUp, UserPlus } from "lucide-react";

const Dashboard = () => {
  const upcomingAppointments = [
    {
      client: {
        name: "Carlos Silva",
        imageUrl: "",
      },
      service: "Corte de Cabelo",
      time: "10:30",
      date: "Hoje",
      status: "upcoming" as const,
    },
    {
      client: {
        name: "André Santos",
        imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
      },
      service: "Barba",
      time: "11:45",
      date: "Hoje",
      status: "upcoming" as const,
    },
    {
      client: {
        name: "Pedro Costa",
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
      },
      service: "Corte e Barba",
      time: "14:15",
      date: "Hoje",
      status: "upcoming" as const,
    },
    {
      client: {
        name: "João Mendes",
        imageUrl: "",
      },
      service: "Corte de Cabelo",
      time: "10:00",
      date: "Amanhã",
      status: "upcoming" as const,
    },
  ];

  const proactiveSuggestions = [
    {
      client: {
        name: "Roberto Pereira",
        imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
        lastVisit: "20/08/2023",
        frequency: "Mensal",
      },
      suggestedDate: "25/09/2023",
      suggestedTime: "15:30",
      service: "Corte e Barba",
      reason: "O cliente costuma agendar no final do mês. Baseado no histórico, este horário seria ideal.",
    },
    {
      client: {
        name: "Miguel Oliveira",
        imageUrl: "",
        lastVisit: "Novo cliente",
        frequency: "Primeira visita",
      },
      suggestedDate: "22/09/2023",
      suggestedTime: "11:00",
      service: "Corte de Cabelo",
      reason: "Cliente novo que preencheu o formulário de interesse no site. Horário sugerido com base na disponibilidade.",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Stats />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle>Próximos Agendamentos</CardTitle>
                <Button variant="outline" size="sm" className="gap-1">
                  Ver Todos <ArrowRight className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {upcomingAppointments.map((appointment, index) => (
                    <AppointmentCard
                      key={index}
                      client={appointment.client}
                      service={appointment.service}
                      time={appointment.time}
                      date={appointment.date}
                      status={appointment.status}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium flex items-center">
                    <TrendingUp className="mr-2 h-4 w-4 text-gray-500" />
                    Tendências
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { label: "Serviço mais popular", value: "Corte e Barba" },
                      { label: "Dia mais movimentado", value: "Sexta-feira" },
                      { label: "Horário mais ocupado", value: "15:00 - 17:00" },
                      { label: "Clientes recorrentes", value: "78%" },
                    ].map((stat, index) => (
                      <div key={index}>
                        <div className="text-xs font-medium text-gray-500">
                          {stat.label}
                        </div>
                        <div className="text-sm font-medium mt-0.5">
                          {stat.value}
                        </div>
                      </div>
                    ))}
                    <Button variant="link" className="p-0 h-auto text-gray-900">
                      Ver relatório completo
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium flex items-center">
                    <UserPlus className="mr-2 h-4 w-4 text-gray-500" />
                    Novos Clientes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: "Miguel Oliveira", date: "Hoje", imageUrl: "" },
                      { name: "Gabriel Almeida", date: "Ontem", imageUrl: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80" },
                      { name: "Lucas Ferreira", date: "20/09/2023", imageUrl: "" },
                    ].map((client, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={client.imageUrl} alt={client.name} />
                          <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm font-medium">{client.name}</div>
                          <div className="text-xs text-gray-500">Registrado: {client.date}</div>
                        </div>
                      </div>
                    ))}
                    <Button variant="link" className="p-0 h-auto text-gray-900">
                      Ver todos os clientes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="flex items-center">
                  <CalendarClock className="mr-2 h-5 w-5 text-gray-500" />
                  Agendamento Proativo
                </CardTitle>
                <Button variant="outline" size="sm" className="gap-1">
                  Ver Todos <ArrowRight className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {proactiveSuggestions.map((suggestion, index) => (
                    <Card key={index} className="overflow-hidden border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={suggestion.client.imageUrl} alt={suggestion.client.name} />
                            <AvatarFallback>{suggestion.client.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium text-sm">
                              {suggestion.client.name}
                            </h4>
                            <p className="text-xs text-gray-500">
                              {suggestion.service}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm mb-3">
                          <div className="flex items-center">
                            <Calendar className="w-3.5 h-3.5 mr-1 text-gray-400" />
                            <span>{suggestion.suggestedDate}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-3.5 h-3.5 mr-1 text-gray-400" />
                            <span>{suggestion.suggestedTime}</span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between space-x-2">
                          <Button variant="outline" size="sm" className="w-full text-xs border-gray-200">
                            Editar
                          </Button>
                          <Button size="sm" className="w-full text-xs bg-gray-900 hover:bg-gray-800">
                            Enviar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Dicas Rápidas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    "Configure lembretes automáticos para reduzir no-shows.",
                    "Personalize mensagens para diferentes tipos de clientes.",
                    "Analise os horários de pico para otimizar sua agenda.",
                  ].map((tip, index) => (
                    <div key={index} className="flex space-x-3">
                      <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-medium text-gray-700">{index + 1}</span>
                      </div>
                      <p className="text-sm text-gray-600">{tip}</p>
                    </div>
                  ))}
                  <Button variant="link" className="p-0 h-auto text-gray-900">
                    Ver todas as dicas
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
