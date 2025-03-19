
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, Scissors } from "lucide-react";
import { Appointment } from "@/integrations/supabase/schema";

interface AppointmentCardProps {
  appointment: {
    client: {
      name: string;
      imageUrl?: string;
    };
    service: string;
    time: string;
    date: string;
    status: "upcoming" | "completed" | "cancelled";
    duration: string;
  };
}

const AppointmentCard = ({ appointment }: AppointmentCardProps) => {
  const { client, service, time, date, status, duration } = appointment;
  
  const statusColorMap = {
    upcoming: "bg-blue-50 text-blue-700 border-blue-200",
    completed: "bg-green-50 text-green-700 border-green-200",
    cancelled: "bg-red-50 text-red-700 border-red-200",
  };
  
  const statusTextMap = {
    upcoming: "Agendado",
    completed: "Concluído",
    cancelled: "Cancelado",
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={client.imageUrl} alt={client.name} />
              <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-gray-900">{client.name}</h3>
              <p className="text-sm text-gray-500">{service}</p>
            </div>
          </div>
          <Badge className={`${statusColorMap[status]} border`}>
            {statusTextMap[status]}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1 text-gray-400" />
              <span>{date}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1 text-gray-400" />
              <span>{time}</span>
            </div>
          </div>
          <div className="flex items-center">
            <Scissors className="w-4 h-4 mr-1 text-gray-400" />
            <span className="text-gray-600">{duration}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentCard;
