
import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileSettings from "@/components/settings/ProfileSettings";
import WorkingHoursSettings from "@/components/settings/WorkingHoursSettings";
import ServicesSettings from "@/components/settings/ServicesSettings";
import NotificationsSettings from "@/components/settings/NotificationsSettings";
import WhatsAppContacts from "@/components/settings/WhatsAppContacts";
import BarbersManagement from "@/components/settings/BarbersManagement";

const Settings = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Configurações</h1>
          <p className="text-muted-foreground">
            Gerencie suas configurações e preferências da barbearia.
          </p>
        </div>
        
        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList className="flex flex-wrap">
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="working-hours">Horário de Funcionamento</TabsTrigger>
            <TabsTrigger value="services">Serviços</TabsTrigger>
            <TabsTrigger value="notifications">Notificações</TabsTrigger>
            <TabsTrigger value="whatsapp-contacts">Contatos WhatsApp</TabsTrigger>
            <TabsTrigger value="barbers">Barbeiros</TabsTrigger>
          </TabsList>
          <TabsContent value="profile" className="space-y-4">
            <ProfileSettings />
          </TabsContent>
          <TabsContent value="working-hours" className="space-y-4">
            <WorkingHoursSettings />
          </TabsContent>
          <TabsContent value="services" className="space-y-4">
            <ServicesSettings />
          </TabsContent>
          <TabsContent value="notifications" className="space-y-4">
            <NotificationsSettings />
          </TabsContent>
          <TabsContent value="whatsapp-contacts" className="space-y-4">
            <WhatsAppContacts />
          </TabsContent>
          <TabsContent value="barbers" className="space-y-4">
            <BarbersManagement />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
