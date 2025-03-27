
import { supabase } from "@/integrations/supabase/client";
import { Service } from "@/integrations/supabase/schema";

export async function getServices(): Promise<Service[]> {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('name');
    
  if (error) {
    console.error("Error fetching services:", error);
    throw new Error(`Erro ao buscar serviços: ${error.message}`);
  }
  
  return data || [];
}

export async function getService(id: string): Promise<Service | null> {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('id', id)
    .maybeSingle();
    
  if (error) {
    console.error("Error fetching service:", error);
    throw new Error(`Erro ao buscar serviço: ${error.message}`);
  }
  
  return data;
}

export async function createService(service: Omit<Service, 'id' | 'created_at' | 'updated_at'>): Promise<Service> {
  const now = new Date().toISOString();
  const serviceWithTimestamps = {
    ...service,
    created_at: now,
    updated_at: now
  };

  const { data, error } = await supabase
    .from('services')
    .insert([serviceWithTimestamps])
    .select()
    .single();
    
  if (error) {
    console.error("Error creating service:", error);
    throw new Error(`Erro ao criar serviço: ${error.message}`);
  }
  
  if (!data) {
    throw new Error("Nenhum dado retornado após criar o serviço");
  }
  
  return data;
}

export async function updateService(id: string, service: Partial<Omit<Service, 'id' | 'created_at'>>): Promise<Service> {
  const serviceWithTimestamp = {
    ...service,
    updated_at: new Date().toISOString()
  };
  
  const { data, error } = await supabase
    .from('services')
    .update(serviceWithTimestamp)
    .eq('id', id)
    .select()
    .single();
    
  if (error) {
    console.error("Error updating service:", error);
    throw new Error(`Erro ao atualizar serviço: ${error.message}`);
  }
  
  if (!data) {
    throw new Error("Nenhum dado retornado após atualizar o serviço");
  }
  
  return data;
}

export async function deleteService(id: string): Promise<void> {
  const { error } = await supabase
    .from('services')
    .delete()
    .eq('id', id);
    
  if (error) {
    console.error("Error deleting service:", error);
    throw new Error(`Erro ao remover serviço: ${error.message}`);
  }
}
