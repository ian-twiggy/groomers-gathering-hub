
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Scissors, Clock, Calendar, ArrowRight, Badge, CheckCircle2, XCircle } from "lucide-react";

interface ProactiveCardProps {
  client: {
    name: string;
    imageUrl?: string;
    lastVisit: string;
    frequency: string;
  };
  suggestedDate: string;
  suggestedTime: string;
  service: string;
  reason: string;
}

const ProactiveCard = ({
  client,
  suggestedDate,
  suggestedTime,
  service,
  reason,
}: ProactiveCardProps) => {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-medium">Sugestão de Agendamento</CardTitle>
        <div className="px-2 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-700 border border-blue-200">
          Aguardando Aprovação
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center space-x-4 mb-4">
          <Avatar>
            <AvatarImage src={client.imageUrl} alt={client.name} />
            <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium text-gray-900">{client.name}</h3>
            <p className="text-sm text-gray-500">
              <span>Última visita: {client.lastVisit}</span>
              <span className="mx-2">•</span>
              <span>Frequência: {client.frequency}</span>
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div className="flex flex-col space-y-1">
            <div className="text-xs font-medium text-gray-500">Serviço</div>
            <div className="flex items-center text-sm">
              <Scissors className="mr-1.5 h-3.5 w-3.5 text-gray-400" />
              {service}
            </div>
          </div>
          <div className="flex flex-col space-y-1">
            <div className="text-xs font-medium text-gray-500">Data Sugerida</div>
            <div className="flex items-center text-sm">
              <Calendar className="mr-1.5 h-3.5 w-3.5 text-gray-400" />
              {suggestedDate}
            </div>
          </div>
          <div className="flex flex-col space-y-1">
            <div className="text-xs font-medium text-gray-500">Horário</div>
            <div className="flex items-center text-sm">
              <Clock className="mr-1.5 h-3.5 w-3.5 text-gray-400" />
              {suggestedTime}
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-3 rounded-md text-sm mb-4">
          <div className="font-medium text-gray-900 mb-1">Motivo da sugestão:</div>
          <div className="text-gray-600">{reason}</div>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:justify-between space-y-3 sm:space-y-0">
          <Button variant="outline" size="sm" className="sm:mr-2 border-gray-200">
            Sugerir outra data
          </Button>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="flex-1 sm:flex-none border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
              <XCircle className="mr-1.5 h-4 w-4" />
              Rejeitar
            </Button>
            <Button size="sm" className="flex-1 sm:flex-none bg-gray-900 hover:bg-gray-800">
              <CheckCircle2 className="mr-1.5 h-4 w-4" />
              Aprovar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProactiveCard;
