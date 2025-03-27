
import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

interface ErrorDisplayProps {
  error: Error;
  onRetry?: () => void;
}

const ErrorDisplay = ({ error, onRetry }: ErrorDisplayProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Serviços</CardTitle>
        <CardDescription>
          Erro ao carregar serviços. Por favor, tente novamente.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-red-500 p-3 bg-red-50 rounded-md border border-red-200">
            <p className="font-medium">Mensagem de erro:</p>
            <p>{error.message}</p>
          </div>
          
          {onRetry && (
            <Button 
              variant="outline" 
              onClick={onRetry}
              className="flex items-center gap-2"
            >
              <RefreshCcw size={16} />
              Tentar Novamente
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ErrorDisplay;
