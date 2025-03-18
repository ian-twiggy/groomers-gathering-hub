
import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import AppointmentCalendar from "@/components/calendar/AppointmentCalendar";

const Calendar = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <AppointmentCalendar />
      </div>
    </DashboardLayout>
  );
};

export default Calendar;
