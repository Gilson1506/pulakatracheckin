import { supabase } from './supabase';

export type OperatorAuthResponse = {
  success: boolean;
  message?: string;
  operator?: {
    id: string;
    name: string;
    organizer_id: string;
    event_id?: string | null;
  };
  events?: any[];
};

export async function authenticateOperator(accessCode: string): Promise<OperatorAuthResponse> {
  const { data, error } = await supabase.rpc('authenticate_operator', {
    p_access_code: accessCode,
  });
  if (error) {
    return { success: false, message: error.message };
  }
  
  if (!data || !data.success) {
    return { success: false, message: data?.message || 'Resposta inválida' };
  }

  // A função RPC agora retorna organizer_id e event_id diretamente
  return {
    success: true,
    message: data.message,
    operator: {
      id: data.operator.id,
      name: data.operator.name,
      organizer_id: data.operator.organizer_id,
      event_id: data.operator.event_id
    },
    events: data.events || []
  };
}
