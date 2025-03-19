
import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RevenueChart from "@/components/reports/RevenueChart";
import ServicePopularity from "@/components/reports/ServicePopularity";
import ClientGrowth from "@/components/reports/ClientGrowth";
import MonthlyComparisonTable from "@/components/reports/MonthlyComparisonTable";
import DateRangePicker from "@/components/reports/DateRangePicker";

const Reports = () => {
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date()
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Relatórios</h2>
            <p className="text-muted-foreground">
              Analise o desempenho do seu negócio e tome decisões baseadas em dados.
            </p>
          </div>
          <DateRangePicker dateRange={dateRange} setDateRange={setDateRange} />
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="services">Serviços</TabsTrigger>
            <TabsTrigger value="clients">Clientes</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Receita Mensal</CardTitle>
                  <CardDescription>Receita gerada ao longo do período selecionado</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <RevenueChart dateRange={dateRange} />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Comparativo Mensal</CardTitle>
                  <CardDescription>Desempenho comparado ao mês anterior</CardDescription>
                </CardHeader>
                <CardContent>
                  <MonthlyComparisonTable dateRange={dateRange} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Serviços Mais Populares</CardTitle>
                  <CardDescription>Quais serviços são mais procurados</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ServicePopularity dateRange={dateRange} />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Receita por Serviço</CardTitle>
                  <CardDescription>Quanto cada serviço contribui para sua receita</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ServicePopularity dateRange={dateRange} type="revenue" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="clients" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Crescimento de Clientes</CardTitle>
                  <CardDescription>Novos clientes ao longo do tempo</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ClientGrowth dateRange={dateRange} />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Frequência de Retorno</CardTitle>
                  <CardDescription>Com que frequência seus clientes retornam</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ClientGrowth dateRange={dateRange} type="retention" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
