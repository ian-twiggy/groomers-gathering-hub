
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ServicesList from "./services/ServicesList";
import ServiceDialog from "./services/ServiceDialog";
import ErrorDisplay from "./services/ErrorDisplay";
import useServiceManager from "./services/useServiceManager";

const ServicesSettings = () => {
  const {
    services,
    isLoading,
    error,
    refetch,
    dialogOpen,
    setDialogOpen,
    editingService,
    handleAddNewService,
    handleEditService,
    handleDeleteService,
    handleSubmit,
    isSubmitting
  } = useServiceManager();

  if (error) {
    return <ErrorDisplay error={error as Error} onRetry={refetch} />;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle>Serviços</CardTitle>
          <CardDescription>
            Gerencie os serviços oferecidos pela sua barbearia.
          </CardDescription>
        </div>
        <Button onClick={handleAddNewService} className="flex items-center gap-2">
          <Plus size={16} />
          Novo Serviço
        </Button>
      </CardHeader>
      <CardContent>
        <ServicesList
          services={services}
          isLoading={isLoading}
          onEditService={handleEditService}
          onDeleteService={handleDeleteService}
        />
        
        <ServiceDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          editingService={editingService}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </CardContent>
    </Card>
  );
};

export default ServicesSettings;
