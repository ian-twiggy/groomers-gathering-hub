
import React, { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { SidebarTrigger, Sidebar, SidebarContent, SidebarHeader, SidebarFooter } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Calendar, Users, LayoutDashboard, BarChart, CalendarClock, Settings, LogOut, UserRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const location = useLocation();
  
  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Agendamentos", href: "/calendar", icon: Calendar },
    { name: "Clientes", href: "/clients", icon: Users },
    { name: "Agendamento Proativo", href: "/proactive-scheduling", icon: CalendarClock },
    { name: "Relatórios", href: "/reports", icon: BarChart },
    { name: "Configurações", href: "/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen flex w-full">
      <Sidebar>
        <SidebarHeader className="px-6 py-5 border-b border-gray-100">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
              BarberBook
            </span>
          </Link>
        </SidebarHeader>
        
        <SidebarContent className="px-3 py-4">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    isActive 
                      ? "bg-gray-900 text-white" 
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <item.icon className={`mr-3 h-5 w-5 ${isActive ? "text-white" : "text-gray-400"}`} />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </SidebarContent>
        
        <SidebarFooter className="p-3 border-t border-gray-100">
          <div className="flex items-center justify-between p-2">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80" alt="User" />
                <AvatarFallback>BB</AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <div className="font-medium text-gray-900">Raphael's Barber</div>
                <div className="text-gray-500">Admin</div>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700">
              <LogOut size={18} />
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>
      
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-100 py-4 px-6 md:px-8 flex items-center justify-between">
          <div className="flex items-center">
            <SidebarTrigger className="md:mr-6" />
            <h1 className="text-2xl font-semibold text-gray-900">
              {navigation.find(item => item.href === location.pathname)?.name || "Dashboard"}
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="gap-2">
              <UserRound size={16} />
              <span className="hidden md:inline">Perfil</span>
            </Button>
          </div>
        </header>
        
        <main className="flex-1 bg-gray-50 overflow-y-auto">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 md:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
