
import { supabase } from "@/integrations/supabase/client";
import { Appointment } from "@/integrations/supabase/schema";

export async function getAppointments(): Promise<Appointment[]> {
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .order('date')
    .order('time');
    
  if (error) {
    throw error;
  }
  
  return data || [];
}

export async function getAppointmentsForDate(date: string): Promise<Appointment[]> {
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('date', date)
    .order('time');
    
  if (error) {
    throw error;
  }
  
  return data || [];
}

export async function getAppointment(id: string): Promise<Appointment | null> {
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('id', id)
    .maybeSingle();
    
  if (error) {
    throw error;
  }
  
  return data;
}

export async function createAppointment(appointment: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>): Promise<Appointment> {
  const { data, error } = await supabase
    .from('appointments')
    .insert([appointment])
    .select()
    .single();
    
  if (error) {
    throw error;
  }
  
  return data;
}

export async function updateAppointment(id: string, appointment: Partial<Omit<Appointment, 'id' | 'created_at' | 'updated_at'>>): Promise<Appointment> {
  const { data, error } = await supabase
    .from('appointments')
    .update(appointment)
    .eq('id', id)
    .select()
    .single();
    
  if (error) {
    throw error;
  }
  
  return data;
}

export async function deleteAppointment(id: string): Promise<void> {
  const { error } = await supabase
    .from('appointments')
    .delete()
    .eq('id', id);
    
  if (error) {
    throw error;
  }
}
