
import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ProactiveCard from "@/components/scheduling/ProactiveCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle, Clock, Settings } from "lucide-react";

const ProactiveScheduling = () => {
  const pendingSuggestions = [
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
    {
      client: {
        name: "André Santos",
        imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
        lastVisit: "10/09/2023",
        frequency: "Quinzenal",
      },
      suggestedDate: "24/09/2023",
      suggestedTime: "14:00",
      service: "Barba",
      reason: "O cliente está próximo da sua data habitual de agendamento. Este horário foi sugerido com base nas suas preferências anteriores.",
    },
  ];

  const clientSuggestions = [
    {
      name: "Carlos Silva",
      lastVisit: "15/09/2023",
      frequency: "3-4 semanas",
      dueDate: "08/10/2023",
      preferredService: "Corte de Cabelo",
      preferredDays: ["Segunda", "Quarta"],
      image: "",
    },
    {
      name: "Pedro Costa",
      lastVisit: "05/09/2023",
      frequency: "2 semanas",
      dueDate: "19/09/2023",
      preferredService: "Corte e Barba",
      preferredDays: ["Terça", "Quinta", "Sábado"],
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
    },
    {
      name: "João Mendes",
      lastVisit: "01/09/2023",
      frequency: "4 semanas",
      dueDate: "29/09/2023",
      preferredService: "Corte de Cabelo",
      preferredDays: ["Sexta", "Sábado"],
      image: "",
    },
    {
      name: "Gabriel Almeida",
      lastVisit: "25/08/2023",
      frequency: "3 semanas",
      dueDate: "15/09/2023",
      preferredService: "Barba",
      preferredDays: ["Segunda", "Quarta", "Sexta"],
      image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Sugestões Pendentes",
              value: "3",
              description: "Aguardando envio",
              icon: Clock,
              className: "bg-blue-50 text-blue-700",
            },
            {
              title: "Sugestões Enviadas",
              value: "12",
              description: "Nos últimos 30 dias",
              icon: AlertCircle,
              className: "bg-yellow-50 text-yellow-700",
            },
            {
              title: "Agendamentos Confirmados",
              value: "8",
              description: "67% de taxa de conversão",
              icon: CheckCircle,
              className: "bg-green-50 text-green-700",
            },
          ].map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-md ${stat.className}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
                    <div className="flex items-end space-x-1">
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-sm text-gray-500 pb-0.5">{stat.description}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Tabs defaultValue="pending">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="pending">Pendentes</TabsTrigger>
              <TabsTrigger value="suggested">Sugestões</TabsTrigger>
              <TabsTrigger value="settings">Configurações</TabsTrigger>
            </TabsList>
            <Button className="bg-gray-900 hover:bg-gray-800">
              Criar Sugestão Manual
            </Button>
          </div>
          
          <TabsContent value="pending">
            <div className="grid grid-cols-1 gap-6">
              {pendingSuggestions.map((suggestion, index) => (
                <ProactiveCard
                  key={index}
                  client={suggestion.client}
                  suggestedDate={suggestion.suggestedDate}
                  suggestedTime={suggestion.suggestedTime}
                  service={suggestion.service}
                  reason={suggestion.reason}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="suggested">
            <Card>
              <CardHeader>
                <CardTitle>Clientes para Agendar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Cliente
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Última Visita
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Frequência
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Data Prevista
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Serviço Preferido
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Dias Preferidos
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Ação
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {clientSuggestions.map((client, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={client.image} alt={client.name} />
                                  <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{client.name}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{client.lastVisit}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{client.frequency}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className={`text-sm ${
                                new Date(client.dueDate.split('/').reverse().join('-')) < new Date() 
                                  ? 'text-red-600 font-medium' 
                                  : 'text-gray-900'
                              }`}>
                                {client.dueDate}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{client.preferredService}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {client.preferredDays.join(', ')}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Button size="sm" className="bg-gray-900 hover:bg-gray-800">
                                Sugerir Horário
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="mr-2 h-5 w-5 text-gray-500" />
                  Configurações de Agendamento Proativo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Automatização</h3>
                    <div className="space-y-4">
                      {[
                        {
                          title: "Criar sugestões automaticamente",
                          description: "O sistema criará sugestões de agendamento com base no histórico dos clientes.",
                          enabled: true,
                        },
                        {
                          title: "Enviar lembretes automáticos",
                          description: "Enviar lembretes para clientes sobre agendamentos próximos.",
                          enabled: true,
                        },
                        {
                          title: "Notificações de cancelamento",
                          description: "Receber notificações quando clientes cancelarem agendamentos.",
                          enabled: false,
                        },
                      ].map((setting, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">{setting.title}</h4>
                            <p className="text-sm text-gray-500">{setting.description}</p>
                          </div>
                          <div className="relative inline-block w-12 h-6 rounded-full bg-gray-200">
                            <input
                              type="checkbox"
                              className="peer sr-only"
                              defaultChecked={setting.enabled}
                              id={`toggle-${index}`}
                            />
                            <label
                              htmlFor={`toggle-${index}`}
                              className="peer h-6 w-12 cursor-pointer rounded-full bg-gray-200 transition-colors duration-300 after:absolute after:top-0.5 after:left-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:duration-300 peer-checked:bg-gray-900 peer-checked:after:translate-x-6"
                            ></label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Critérios de Agendamento</h3>
                    <div className="space-y-4">
                      {[
                        {
                          title: "Antecedência mínima",
                          description: "Quantos dias antes da data prevista o sistema deve criar sugestões",
                          type: "select",
                          options: ["3 dias", "5 dias", "7 dias", "10 dias", "14 dias"],
                          value: "7 dias",
                        },
                        {
                          title: "Horários preferidos",
                          description: "Horários sugeridos com base nas preferências do cliente",
                          type: "checkbox",
                          options: ["Manhã", "Tarde", "Noite", "Fins de semana"],
                          values: ["Manhã", "Tarde"],
                        },
                      ].map((setting, index) => (
                        <div key={index} className="space-y-2">
                          <h4 className="font-medium text-gray-900">{setting.title}</h4>
                          <p className="text-sm text-gray-500">{setting.description}</p>
                          
                          {setting.type === "select" && (
                            <select className="w-full p-2 border border-gray-300 rounded-md">
                              {setting.options.map((option, optIndex) => (
                                <option key={optIndex} selected={option === setting.value}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          )}
                          
                          {setting.type === "checkbox" && (
                            <div className="grid grid-cols-2 gap-2">
                              {setting.options.map((option, optIndex) => (
                                <div key={optIndex} className="flex items-center">
                                  <input
                                    type="checkbox"
                                    id={`option-${index}-${optIndex}`}
                                    defaultChecked={setting.values?.includes(option)}
                                    className="mr-2 h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                                  />
                                  <label htmlFor={`option-${index}-${optIndex}`}>
                                    {option}
                                  </label>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <Button variant="outline">Cancelar</Button>
                    <Button className="bg-gray-900 hover:bg-gray-800">Salvar Configurações</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ProactiveScheduling;
