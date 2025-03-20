
import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ClientDetailComponent from "@/components/clients/ClientDetail";

const ClientDetailPage = () => {
  return (
    <DashboardLayout>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6">
        <ClientDetailComponent />
      </div>
    </DashboardLayout>
  );
};

export default ClientDetailPage;
