import React, { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format, parseISO, isWithinInterval, startOfMonth, endOfMonth, differenceInMonths, addMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useQuery } from "@tanstack/react-query";
import { getClients } from "@/services/clientService";
import { getAppointments } from "@/services/appointmentService";
import { DateRange } from "react-day-picker";

interface ClientGrowthProps {
  dateRange: DateRange;
  type?: "newClients" | "retention";
}

const ClientGrowth = ({ dateRange, type = "newClients" }: ClientGrowthProps) => {
  const { data: clients, isLoading: isLoadingClients } = useQuery({
    queryKey: ["clients"],
    queryFn: getClients,
  });

  const { data: appointments, isLoading: isLoadingAppointments } = useQuery({
    queryKey: ["appointments"],
    queryFn: getAppointments,
  });

  const chartData = useMemo(() => {
    if (!clients || !appointments || !dateRange.from || !dateRange.to) {
      return [];
    }

    if (type === "newClients") {
      // Criar meses para o período selecionado
      const months = [];
      const totalMonths = differenceInMonths(dateRange.to, dateRange.from) + 1;
      
      for (let i = 0; i < totalMonths; i++) {
        const month = addMonths(dateRange.from, i);
        months.push({
          start: startOfMonth(month),
          end: endOfMonth(month),
          label: format(month, "MMM/yyyy", { locale: ptBR }),
        });
      }

      // Contar novos clientes por mês
      return months.map(month => {
        const newClientsCount = clients.filter(client => {
          const createdAt = parseISO(client.created_at);
          return isWithinInterval(createdAt, {
            start: month.start,
            end: month.end,
          });
        }).length;

        return {
          month: month.label,
          value: newClientsCount,
        };
      });
    } else {
      // Análise de retenção - clientes que retornaram
      // Agrupar agendamentos por cliente e mês
      const clientVisits = new Map<string, Set<string>>();

      appointments.forEach(appointment => {
        const appointmentDate = parseISO(appointment.date);
        if (!isWithinInterval(appointmentDate, { start: dateRange.from!, end: dateRange.to! })) {
          return;
        }

        const monthKey = format(appointmentDate, "yyyy-MM");
        const clientId = appointment.client_id;
        
        if (!clientVisits.has(clientId)) {
          clientVisits.set(clientId, new Set());
        }
        
        clientVisits.get(clientId)?.add(monthKey);
      });

      // Contar clientes por número de meses visitados
      const retentionCount = [0, 0, 0, 0, 0, 0]; // 0, 1, 2, 3, 4, 5+ meses

      clientVisits.forEach((months) => {
        const visitsCount = months.size;
        if (visitsCount >= 5) {
          retentionCount[5]++;
        } else {
          retentionCount[visitsCount]++;
        }
      });

      return [
        { visits: "0", value: retentionCount[0], label: "Nenhuma visita" },
        { visits: "1", value: retentionCount[1], label: "1 mês" },
        { visits: "2", value: retentionCount[2], label: "2 meses" },
        { visits: "3", value: retentionCount[3], label: "3 meses" },
        { visits: "4", value: retentionCount[4], label: "4 meses" },
        { visits: "5+", value: retentionCount[5], label: "5+ meses" },
      ];
    }
  }, [clients, appointments, dateRange, type]);

  if (isLoadingClients || isLoadingAppointments) {
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
      {type === "newClients" ? (
        <LineChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip 
            formatter={(value) => [`${value}`, "Novos clientes"]}
            labelFormatter={(value) => `Mês: ${value}`}
          />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="#8b5cf6" 
            activeDot={{ r: 8 }} 
            name="Novos clientes"
          />
        </LineChart>
      ) : (
        <LineChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="visits" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip 
            formatter={(value) => [`${value}`, "Clientes"]}
            labelFormatter={(value, payload) => {
              const item = payload && payload[0] && payload[0].payload;
              return item ? item.label : value;
            }}
          />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="#ec4899" 
            activeDot={{ r: 8 }} 
            name="Clientes"
          />
        </LineChart>
      )}
    </ResponsiveContainer>
  );
};

export default ClientGrowth;
