
import React from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const ClientDetailError = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-96">
      <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
      <h2 className="text-2xl font-bold mb-2">Cliente não encontrado</h2>
      <p className="text-gray-500 mb-4">O cliente que você está procurando não existe ou foi removido.</p>
      <Button onClick={() => navigate("/clients")}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para lista de clientes
      </Button>
    </div>
  );
};

export default ClientDetailError;
