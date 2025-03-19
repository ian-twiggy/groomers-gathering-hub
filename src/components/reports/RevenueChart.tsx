import React, { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format, parseISO, isWithinInterval } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useQuery } from "@tanstack/react-query";
import { getAppointments } from "@/services/appointmentService";
import { getServices } from "@/services/serviceService";
import { Service } from "@/integrations/supabase/schema";
import { DateRange } from "react-day-picker";

interface RevenueChartProps {
  dateRange: DateRange;
}

const RevenueChart = ({ dateRange }: RevenueChartProps) => {
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
      const appointmentDate = parseISO(appointment.date);
      return isWithinInterval(appointmentDate, {
        start: dateRange.from!,
        end: dateRange.to!,
      });
    });

    // Agrupar receita por dia
    const revenueByDay = new Map<string, number>();
    
    filteredAppointments.forEach((appointment) => {
      const service = serviceMap.get(appointment.service_id || "");
      if (!service) return;
      
      const date = appointment.date;
      const revenue = service.price;
      
      const currentRevenue = revenueByDay.get(date) || 0;
      revenueByDay.set(date, currentRevenue + revenue);
    });

    // Converter para array para o gráfico
    const sortedDates = Array.from(revenueByDay.keys()).sort();
    return sortedDates.map((date) => ({
      date,
      revenue: revenueByDay.get(date) || 0,
      formattedDate: format(parseISO(date), "dd/MM", { locale: ptBR }),
    }));
  }, [appointments, services, dateRange]);

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
      <AreaChart
        data={chartData}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="formattedDate" 
          tick={{ fontSize: 12 }}
        />
        <YAxis 
          tickFormatter={(value) => `R$ ${value}`}
          tick={{ fontSize: 12 }}
        />
        <Tooltip 
          formatter={(value) => [`R$ ${value}`, "Receita"]}
          labelFormatter={(value) => `Data: ${value}`}
        />
        <Area 
          type="monotone" 
          dataKey="revenue" 
          stroke="#10b981" 
          fill="#10b98133" 
          name="Receita"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default RevenueChart;
