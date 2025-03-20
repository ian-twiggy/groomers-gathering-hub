
import React from "react";
import { CalendarIcon } from "lucide-react";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface DailyCalendarHeaderProps {
  date: Date;
  appointmentsCount: number;
}

const DailyCalendarHeader = ({ date, appointmentsCount }: DailyCalendarHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
      <div>
        <CardTitle className="flex items-center">
          <CalendarIcon className="mr-2 h-5 w-5" />
          {date.toLocaleDateString("pt-BR", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </CardTitle>
        <CardDescription>
          {appointmentsCount} agendamentos para hoje
        </CardDescription>
      </div>
      <div className="flex space-x-2">
        <Button variant="outline" size="sm">
          Semana
        </Button>
        <Button variant="outline" size="sm" className="bg-gray-900 text-white">
          Dia
        </Button>
      </div>
    </div>
  );
};

export default DailyCalendarHeader;
