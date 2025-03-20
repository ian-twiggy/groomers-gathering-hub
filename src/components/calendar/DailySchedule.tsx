
import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Appointment } from "@/integrations/supabase/schema";
import AppointmentItem from "./AppointmentItem";

interface DailyScheduleProps {
  timeSlots: string[];
  dayAppointments: Appointment[];
  clientsMap: Record<string, {name: string, image?: string}>;
  loading: boolean;
  onNewAppointment: () => void;
  onDeleteAppointment: (appointment: Appointment) => void;
}

const DailySchedule = ({
  timeSlots,
  dayAppointments,
  clientsMap,
  loading,
  onNewAppointment,
  onDeleteAppointment
}: DailyScheduleProps) => {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {timeSlots.map((time) => {
        const appointmentsAtTime = dayAppointments.filter(
          (appt) => appt.time.substring(0, 5) === time
        );
        
        return (
          <div key={time} className="grid grid-cols-[70px_1fr] md:grid-cols-[80px_1fr] gap-2 md:gap-4">
            <div className="flex items-center justify-end">
              <span className="text-sm font-medium text-gray-600">
                {time}
              </span>
            </div>
            
            <div className="flex-1 min-h-[64px] rounded-lg border border-dashed border-gray-200 bg-gray-50 p-1">
              {appointmentsAtTime.length > 0 ? (
                <div className="grid grid-cols-1 gap-2">
                  {appointmentsAtTime.map((appointment) => {
                    const client = appointment.client_id ? clientsMap[appointment.client_id] : null;
                    return (
                      <AppointmentItem 
                        key={appointment.id}
                        appointment={appointment}
                        client={client}
                        onDelete={onDeleteAppointment}
                      />
                    );
                  })}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-gray-500 hover:text-gray-900"
                    onClick={onNewAppointment}
                  >
                    <Plus className="mr-2 h-3 w-3" /> Agendar
                  </Button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DailySchedule;
