
import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";

interface ErrorDisplayProps {
  error: Error;
}

const ErrorDisplay = ({ error }: ErrorDisplayProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Serviços</CardTitle>
        <CardDescription>
          Erro ao carregar serviços. Por favor, tente novamente.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-red-500">
          {error.message}
        </div>
      </CardContent>
    </Card>
  );
};

export default ErrorDisplay;
