import React, { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { parseISO, isWithinInterval } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { getAppointments } from "@/services/appointmentService";
import { getServices } from "@/services/serviceService";
import { Service } from "@/integrations/supabase/schema";
import { DateRange } from "react-day-picker";

interface ServicePopularityProps {
  dateRange: DateRange;
  type?: "count" | "revenue";
}

const COLORS = ["#10b981", "#0ea5e9", "#8b5cf6", "#f59e0b", "#ef4444", "#ec4899", "#6366f1", "#84cc16"];

const ServicePopularity = ({ dateRange, type = "count" }: ServicePopularityProps) => {
  const { data: appointments, isLoading: isLoadingAppointments } = useQuery({
    queryKey: ["appointments"],
    queryFn: getAppointments,
  });

  const { data: services, isLoading: isLoadingServices } = useQuery({
    queryKey: ["services"],
    queryFn: getServices,
  });

  const chartData = useMemo(() => {
    if (!appointments || !services || !dateRange.from || !dateRange.to) {
      return [];
    }

    // Criar um mapa de serviços para consulta rápida
    const serviceMap = new Map<string, Service>();
    services.forEach((service) => {
      serviceMap.set(service.id, service);
    });

    // Filtrar agendamentos dentro do período
    const filteredAppointments = appointments.filter((appointment) => {
      if (!appointment.service_id) return false;
      const appointmentDate = parseISO(appointment.date);
      return isWithinInterval(appointmentDate, {
        start: dateRange.from!,
        end: dateRange.to!,
      });
    });

    // Agrupar por serviço
    const serviceStats = new Map<string, { count: number; revenue: number; name: string }>();
    
    filteredAppointments.forEach((appointment) => {
      if (!appointment.service_id) return;
      
      const service = serviceMap.get(appointment.service_id);
      if (!service) return;
      
      const serviceId = service.id;
      const currentStats = serviceStats.get(serviceId) || { count: 0, revenue: 0, name: service.name };
      
      serviceStats.set(serviceId, {
        count: currentStats.count + 1,
        revenue: currentStats.revenue + service.price,
        name: service.name,
      });
    });

    // Converter para array para o gráfico
    return Array.from(serviceStats.entries())
      .map(([id, stats]) => ({
        id,
        name: stats.name,
        value: type === "revenue" ? stats.revenue : stats.count,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8); // Limitar aos 8 principais serviços
  }, [appointments, services, dateRange, type]);

  if (isLoadingAppointments || isLoadingServices) {
    return <div className="flex items-center justify-center h-full">Carregando...</div>;
  }

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Nenhum dado disponível para o período selecionado
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => [
            type === "revenue" ? `R$ ${value}` : value,
            type === "revenue" ? "Receita" : "Quantidade"
          ]}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default ServicePopularity;
