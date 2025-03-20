
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";

interface ClientSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onNewClient: () => void;
}

const ClientSearch: React.FC<ClientSearchProps> = ({
  searchQuery,
  onSearchChange,
  onNewClient,
}) => {
  return (
    <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 w-full md:w-auto">
      <div className="relative flex-1 sm:flex-none">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Buscar clientes..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <Button 
        className="bg-gray-900 hover:bg-gray-800"
        onClick={onNewClient}
      >
        <Plus className="mr-2 h-4 w-4" /> Novo Cliente
      </Button>
    </div>
  );
};

export default ClientSearch;
