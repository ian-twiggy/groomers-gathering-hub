
import React from "react";
import { Client } from "@/integrations/supabase/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Calendar } from "lucide-react";

interface ClientInfoCardProps {
  client: Client;
  onStatusChange: (status: 'active' | 'inactive' | 'new') => Promise<void>;
}

const ClientInfoCard = ({ client, onStatusChange }: ClientInfoCardProps) => {
  // Status badge color mapping
  const statusColorMap = {
    active: "bg-green-50 text-green-700 border-green-200",
    inactive: "bg-gray-50 text-gray-700 border-gray-200",
    new: "bg-blue-50 text-blue-700 border-blue-200",
  };
  
  const statusTextMap = {
    active: "Ativo",
    inactive: "Inativo",
    new: "Novo",
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={client.image_url || undefined} alt={client.name} />
              <AvatarFallback className="text-2xl">{client.name.charAt(0)}</AvatarFallback>
            </Avatar>
            
            <div>
              <h2 className="text-2xl font-bold">{client.name}</h2>
              <div className="flex flex-col mt-1 space-y-1">
                <div className="flex items-center text-gray-500">
                  <Mail className="h-4 w-4 mr-2" /> {client.email}
                </div>
                {client.phone && (
                  <div className="flex items-center text-gray-500">
                    <Phone className="h-4 w-4 mr-2" /> {client.phone}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-start md:items-end space-y-2">
            <Badge className={`${statusColorMap[client.status as keyof typeof statusColorMap]} border`}>
              {statusTextMap[client.status as keyof typeof statusTextMap]}
            </Badge>
            
            <div className="flex space-x-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onStatusChange('active')}
                disabled={client.status === 'active'}
              >
                Ativar
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onStatusChange('inactive')}
                disabled={client.status === 'inactive'}
              >
                Desativar
              </Button>
            </div>
            
            <Button className="flex items-center mt-2">
              <Calendar className="mr-2 h-4 w-4" /> Novo Agendamento
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientInfoCard;
