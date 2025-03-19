
import React, { useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { parseISO, isWithinInterval, subMonths, startOfMonth, endOfMonth, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useQuery } from "@tanstack/react-query";
import { getAppointments } from "@/services/appointmentService";
import { getServices } from "@/services/serviceService";
import { getClients } from "@/services/clientService";
import { ArrowUpIcon, ArrowDownIcon, Minus } from "lucide-react";
import { Service } from "@/integrations/supabase/schema";

interface MonthlyComparisonTableProps {
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
}

interface MetricData {
  currentPeriod: number;
  previousPeriod: number;
  change: number;
  changePercent: number;
}

const MonthlyComparisonTable = ({ dateRange }: MonthlyComparisonTableProps) => {
  const { data: appointments, isLoading: isLoadingAppointments } = useQuery({
    queryKey: ["appointments"],
    queryFn: getAppointments,
  });

  const { data: services, isLoading: isLoadingServices } = useQuery({
    queryKey: ["services"],
    queryFn: getServices,
  });

  const { data: clients, isLoading: isLoadingClients } = useQuery({
    queryKey: ["clients"],
    queryFn: getClients,
  });

  const comparisonData = useMemo(() => {
    if (!appointments || !services || !clients || !dateRange.from || !dateRange.to) {
      return {
        revenue: { currentPeriod: 0, previousPeriod: 0, change: 0, changePercent: 0 },
        appointments: { currentPeriod: 0, previousPeriod: 0, change: 0, changePercent: 0 },
        newClients: { currentPeriod: 0, previousPeriod: 0, change: 0, changePercent: 0 },
        avgTicket: { currentPeriod: 0, previousPeriod: 0, change: 0, changePercent: 0 },
      };
    }

    const serviceMap = new Map<string, Service>();
    services.forEach((service) => {
      serviceMap.set(service.id, service);
    });

    // Período atual
    const currentStart = dateRange.from;
    const currentEnd = dateRange.to;

    // Período anterior (mesmo período do mês anterior)
    const previousStart = subMonths(currentStart, 1);
    const previousEnd = subMonths(currentEnd, 1);

    // Filtrar agendamentos do período atual
    const currentAppointments = appointments.filter((appointment) => {
      const appointmentDate = parseISO(appointment.date);
      return isWithinInterval(appointmentDate, {
        start: currentStart,
        end: currentEnd,
      });
    });

    // Filtrar agendamentos do período anterior
    const previousAppointments = appointments.filter((appointment) => {
      const appointmentDate = parseISO(appointment.date);
      return isWithinInterval(appointmentDate, {
        start: previousStart,
        end: previousEnd,
      });
    });

    // Novos clientes do período atual
    const currentNewClients = clients.filter((client) => {
      const createdAt = parseISO(client.created_at);
      return isWithinInterval(createdAt, {
        start: currentStart,
        end: currentEnd,
      });
    });

    // Novos clientes do período anterior
    const previousNewClients = clients.filter((client) => {
      const createdAt = parseISO(client.created_at);
      return isWithinInterval(createdAt, {
        start: previousStart,
        end: previousEnd,
      });
    });

    // Calcular receita atual
    let currentRevenue = 0;
    currentAppointments.forEach((appointment) => {
      const service = serviceMap.get(appointment.service_id || "");
      if (service) {
        currentRevenue += service.price;
      }
    });

    // Calcular receita anterior
    let previousRevenue = 0;
    previousAppointments.forEach((appointment) => {
      const service = serviceMap.get(appointment.service_id || "");
      if (service) {
        previousRevenue += service.price;
      }
    });

    // Ticket médio atual
    const currentAvgTicket = currentAppointments.length > 0 
      ? currentRevenue / currentAppointments.length 
      : 0;

    // Ticket médio anterior
    const previousAvgTicket = previousAppointments.length > 0 
      ? previousRevenue / previousAppointments.length 
      : 0;

    // Calcular mudanças
    const calculateChange = (current: number, previous: number): { change: number, changePercent: number } => {
      const change = current - previous;
      const changePercent = previous !== 0 ? (change / previous) * 100 : 0;
      return { change, changePercent };
    };

    const revenueChange = calculateChange(currentRevenue, previousRevenue);
    const appointmentsChange = calculateChange(currentAppointments.length, previousAppointments.length);
    const newClientsChange = calculateChange(currentNewClients.length, previousNewClients.length);
    const avgTicketChange = calculateChange(currentAvgTicket, previousAvgTicket);

    return {
      revenue: { 
        currentPeriod: currentRevenue, 
        previousPeriod: previousRevenue, 
        ...revenueChange 
      },
      appointments: { 
        currentPeriod: currentAppointments.length, 
        previousPeriod: previousAppointments.length, 
        ...appointmentsChange 
      },
      newClients: { 
        currentPeriod: currentNewClients.length, 
        previousPeriod: previousNewClients.length, 
        ...newClientsChange 
      },
      avgTicket: { 
        currentPeriod: currentAvgTicket, 
        previousPeriod: previousAvgTicket, 
        ...avgTicketChange 
      },
    };
  }, [appointments, services, clients, dateRange]);

  if (isLoadingAppointments || isLoadingServices || isLoadingClients) {
    return <div className="flex items-center justify-center h-full">Carregando...</div>;
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const renderChangeIndicator = (data: MetricData) => {
    if (Math.abs(data.changePercent) < 0.1) {
      return <Minus className="h-4 w-4 text-gray-500" />;
    }
    
    return data.changePercent > 0 ? (
      <ArrowUpIcon className="h-4 w-4 text-green-500" />
    ) : (
      <ArrowDownIcon className="h-4 w-4 text-red-500" />
    );
  };

  const currentPeriodLabel = dateRange.from && dateRange.to 
    ? `${format(dateRange.from, "dd/MM", { locale: ptBR })} - ${format(dateRange.to, "dd/MM", { locale: ptBR })}`
    : "Período atual";

  const previousPeriodStart = dateRange.from ? subMonths(dateRange.from, 1) : undefined;
  const previousPeriodEnd = dateRange.to ? subMonths(dateRange.to, 1) : undefined;
  
  const previousPeriodLabel = previousPeriodStart && previousPeriodEnd
    ? `${format(previousPeriodStart, "dd/MM", { locale: ptBR })} - ${format(previousPeriodEnd, "dd/MM", { locale: ptBR })}`
    : "Período anterior";

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Métrica</TableHead>
          <TableHead>{currentPeriodLabel}</TableHead>
          <TableHead>{previousPeriodLabel}</TableHead>
          <TableHead>Variação</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">Receita</TableCell>
          <TableCell>{formatCurrency(comparisonData.revenue.currentPeriod)}</TableCell>
          <TableCell>{formatCurrency(comparisonData.revenue.previousPeriod)}</TableCell>
          <TableCell className="flex items-center gap-1">
            {renderChangeIndicator(comparisonData.revenue)}
            {formatPercent(comparisonData.revenue.changePercent)}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Agendamentos</TableCell>
          <TableCell>{comparisonData.appointments.currentPeriod}</TableCell>
          <TableCell>{comparisonData.appointments.previousPeriod}</TableCell>
          <TableCell className="flex items-center gap-1">
            {renderChangeIndicator(comparisonData.appointments)}
            {formatPercent(comparisonData.appointments.changePercent)}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Novos Clientes</TableCell>
          <TableCell>{comparisonData.newClients.currentPeriod}</TableCell>
          <TableCell>{comparisonData.newClients.previousPeriod}</TableCell>
          <TableCell className="flex items-center gap-1">
            {renderChangeIndicator(comparisonData.newClients)}
            {formatPercent(comparisonData.newClients.changePercent)}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Ticket Médio</TableCell>
          <TableCell>{formatCurrency(comparisonData.avgTicket.currentPeriod)}</TableCell>
          <TableCell>{formatCurrency(comparisonData.avgTicket.previousPeriod)}</TableCell>
          <TableCell className="flex items-center gap-1">
            {renderChangeIndicator(comparisonData.avgTicket)}
            {formatPercent(comparisonData.avgTicket.changePercent)}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default MonthlyComparisonTable;
