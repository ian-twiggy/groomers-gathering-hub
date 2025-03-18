
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Clock, Scissors } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: {
    value: string;
    positive: boolean;
  };
}

const StatCard = ({ title, value, description, icon: Icon, trend }: StatCardProps) => {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-gray-400" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-gray-500">{description}</p>
        {trend && (
          <div className={`text-xs mt-1 ${trend.positive ? 'text-green-500' : 'text-red-500'}`}>
            {trend.positive ? '↑' : '↓'} {trend.value} desde o mês passado
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const Stats = () => {
  const stats = [
    {
      title: "Agendamentos Hoje",
      value: "12",
      description: "4 agendamentos restantes",
      icon: Calendar,
      trend: {
        value: "15%",
        positive: true,
      },
    },
    {
      title: "Clientes Ativos",
      value: "245",
      description: "8 novos esta semana",
      icon: Users,
      trend: {
        value: "5%",
        positive: true,
      },
    },
    {
      title: "Tempo Médio",
      value: "42min",
      description: "Por agendamento",
      icon: Clock,
    },
    {
      title: "Serviços",
      value: "8",
      description: "Diferentes oferecidos",
      icon: Scissors,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default Stats;
