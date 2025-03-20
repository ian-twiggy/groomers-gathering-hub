
import React from "react";
import { Button } from "@/components/ui/button";

interface ClientPaginationProps {
  totalCount: number;
  filteredCount: number;
}

const ClientPagination: React.FC<ClientPaginationProps> = ({
  totalCount,
  filteredCount,
}) => {
  return (
    <div className="mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
      <div className="text-sm text-gray-500">
        Mostrando {filteredCount} de {totalCount} clientes
      </div>
      <div className="flex space-x-2">
        <Button variant="outline" size="sm" disabled>
          Anterior
        </Button>
        <Button variant="outline" size="sm">
          Próximo
        </Button>
      </div>
    </div>
  );
};

export default ClientPagination;
