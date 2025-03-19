import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAppointments } from "@/services/appointmentService";
import { getServices } from "@/services/serviceService";
import { getClients } from "@/services/clientService";
import { parseISO, isWithinInterval, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { DateRange } from "react-day-picker";

interface MonthlyComparisonTableProps {
  dateRange: DateRange;
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

  if (isLoadingAppointments || isLoadingServices || isLoadingClients) {
    return <div className="flex items-center justify-center h-full">Carregando...</div>;
  }

  if (!dateRange.from || !dateRange.to) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Selecione um período para ver a comparação
      </div>
    );
  }

  // Calcular estatísticas para o mês atual
  const currentMonthStart = startOfMonth(dateRange.from);
  const currentMonthEnd = endOfMonth(dateRange.to);

  // Calcular estatísticas para o mês anterior
  const previousMonthStart = startOfMonth(subMonths(currentMonthStart, 1));
  const previousMonthEnd = endOfMonth(subMonths(currentMonthEnd, 1));

  // Filtrar agendamentos do mês atual
  const currentMonthAppointments = appointments?.filter(appointment => {
    const appointmentDate = parseISO(appointment.date);
    return isWithinInterval(appointmentDate, {
      start: currentMonthStart,
      end: currentMonthEnd
    });
  }) || [];

  // Filtrar agendamentos do mês anterior
  const previousMonthAppointments = appointments?.filter(appointment => {
    const appointmentDate = parseISO(appointment.date);
    return isWithinInterval(appointmentDate, {
      start: previousMonthStart,
      end: previousMonthEnd
    });
  }) || [];

  // Calcular receita
  const calculateRevenue = (filteredAppointments: any[]) => {
    return filteredAppointments.reduce((total, appointment) => {
      const service = services?.find(s => s.id === appointment.service_id);
      return total + (service?.price || 0);
    }, 0);
  };

  const currentRevenue = calculateRevenue(currentMonthAppointments);
  const previousRevenue = calculateRevenue(previousMonthAppointments);
  const revenueChange = previousRevenue ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 : 100;

  // Número de agendamentos
  const currentAppointmentsCount = currentMonthAppointments.length;
  const previousAppointmentsCount = previousMonthAppointments.length;
  const appointmentsChange = previousAppointmentsCount 
    ? ((currentAppointmentsCount - previousAppointmentsCount) / previousAppointmentsCount) * 100 
    : 100;

  // Novos clientes
  const currentNewClients = clients?.filter(client => {
    const creationDate = parseISO(client.created_at);
    return isWithinInterval(creationDate, {
      start: currentMonthStart,
      end: currentMonthEnd
    });
  }).length || 0;

  const previousNewClients = clients?.filter(client => {
    const creationDate = parseISO(client.created_at);
    return isWithinInterval(creationDate, {
      start: previousMonthStart,
      end: previousMonthEnd
    });
  }).length || 0;

  const newClientsChange = previousNewClients 
    ? ((currentNewClients - previousNewClients) / previousNewClients) * 100 
    : 100;

  // Calcular valor médio por agendamento
  const currentAvgTicket = currentAppointmentsCount ? currentRevenue / currentAppointmentsCount : 0;
  const previousAvgTicket = previousAppointmentsCount ? previousRevenue / previousAppointmentsCount : 0;
  const avgTicketChange = previousAvgTicket ? ((currentAvgTicket - previousAvgTicket) / previousAvgTicket) * 100 : 0;

  // Formatação de mudança para exibição
  const formatChange = (change: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(1)}%`;
  };

  // Classe de cor para mudança
  const getChangeColorClass = (change: number) => {
    return change >= 0 ? 'text-green-500' : 'text-red-500';
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2">Métrica</th>
            <th className="text-right py-2">Atual</th>
            <th className="text-right py-2">Anterior</th>
            <th className="text-right py-2">Mudança</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b">
            <td className="py-3">Receita</td>
            <td className="text-right">R$ {currentRevenue.toFixed(2)}</td>
            <td className="text-right">R$ {previousRevenue.toFixed(2)}</td>
            <td className={`text-right ${getChangeColorClass(revenueChange)}`}>
              {formatChange(revenueChange)}
            </td>
          </tr>
          <tr className="border-b">
            <td className="py-3">Agendamentos</td>
            <td className="text-right">{currentAppointmentsCount}</td>
            <td className="text-right">{previousAppointmentsCount}</td>
            <td className={`text-right ${getChangeColorClass(appointmentsChange)}`}>
              {formatChange(appointmentsChange)}
            </td>
          </tr>
          <tr className="border-b">
            <td className="py-3">Ticket Médio</td>
            <td className="text-right">R$ {currentAvgTicket.toFixed(2)}</td>
            <td className="text-right">R$ {previousAvgTicket.toFixed(2)}</td>
            <td className={`text-right ${getChangeColorClass(avgTicketChange)}`}>
              {formatChange(avgTicketChange)}
            </td>
          </tr>
          <tr>
            <td className="py-3">Novos Clientes</td>
            <td className="text-right">{currentNewClients}</td>
            <td className="text-right">{previousNewClients}</td>
            <td className={`text-right ${getChangeColorClass(newClientsChange)}`}>
              {formatChange(newClientsChange)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default MonthlyComparisonTable;
