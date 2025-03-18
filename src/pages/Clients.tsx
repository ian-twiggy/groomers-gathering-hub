
import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ClientList from "@/components/clients/ClientList";

const Clients = () => {
  return (
    <DashboardLayout>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6 space-y-6">
        <ClientList />
      </div>
    </DashboardLayout>
  );
};

export default Clients;
