import React, { useState, useCallback, useEffect } from 'react';
import type { Screen, Event, Participant, FeedbackModalData } from './types';
import LoginScreen from './screens/LoginScreen';
import EventSelectionScreen from './screens/EventSelectionScreen';
import CheckInScreen from './screens/CheckInScreen';
import StatisticsScreen from './screens/StatisticsScreen';
import FeedbackModal from './components/FeedbackModal';
import { authenticateOperator } from './lib/operator';
import { supabase } from './lib/supabase';

const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>('login');
  const [user, setUser] = useState<{ name: string; id: string; organizer_id: string } | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [feedbackModal, setFeedbackModal] = useState<FeedbackModalData | null>(null);
  
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);


  // Função auxiliar para converter UUID em número único
  const uuidToNumber = (uuid: string): number => {
    let hash = 0;
    for (let i = 0; i < uuid.length; i++) {
      const char = uuid.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  };

  const fetchEvents = useCallback(async (operatorId: string) => {
    setIsLoadingEvents(true);
    try {
      // Usar a função RPC que retorna todos os dados de uma vez
      const { data, error } = await supabase.rpc('get_operator_events_with_details', {
        p_operator_id: operatorId
      });

      if (error) throw error;

      if (!data || !data.success || !data.events) {
        setEvents([]);
        setIsLoadingEvents(false);
        return;
      }

      // Converter os dados da RPC para o formato esperado pelo app
      const eventsWithParticipants: Event[] = (data.events || []).map((event: any) => {
        // Mostrar apenas usuários (ticket_users) vinculados a este evento
        const participants: Participant[] = (event.tickets || []).reduce((acc: Participant[], ticket: any) => {
          const tu = ticket.ticket_user;
          // Apenas incluir se houver um usuário associado com ID
          if (tu && tu.id) {
            acc.push({
              id: uuidToNumber(ticket.id),
              name: tu.name || ticket.participant_name || 'Não informado',
              email: tu.email || ticket.participant_email || '',
              cpf: tu.document || ticket.participant_document || '',
              ticketType: ticket.ticket_type || 'Geral',
              price: ticket.price || 0,
              checkedIn: ticket.checked_in || false,
              checkInTime: ticket.checkin_info?.checkin_date
                ? new Date(ticket.checkin_info.checkin_date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
                : undefined,
              checkedInBy: ticket.checkin_info?.operator_name || undefined,
              qrCode: ticket.qr_code
            });
          }
          return acc;
        }, []);

        return {
          id: uuidToNumber(event.id),
          uuid: event.id, // UUID real do evento
          name: event.title,
          date: new Date(event.start_date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
          time: new Date(event.start_date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          location: event.location_name || event.location || '',
          image: event.image || undefined,
          participants
        };
      });

      setEvents(eventsWithParticipants);
    } catch (error: any) {
      console.error('Erro ao buscar eventos:', error);
      setEvents([]);
    } finally {
      setIsLoadingEvents(false);
    }
  }, []);

  const handleLogin = useCallback(async (pin: string) => {
    setIsLoginLoading(true);
    setLoginError(null);
    try {
      const resp = await authenticateOperator(pin);
      if (!resp.success || !resp.operator) {
        setLoginError(resp.message || 'Falha na autenticação');
        setIsLoginLoading(false);
        return;
      }
      const operatorData = {
        name: resp.operator.name || 'Operador',
        id: resp.operator.id,
        organizer_id: resp.operator.organizer_id
      };
      setUser(operatorData);
      
      // Buscar eventos reais do banco de dados usando a função RPC
      await fetchEvents(resp.operator.id);
      
      setScreen('eventSelection');
    } catch (e: any) {
      setLoginError(e?.message || 'Erro ao autenticar');
      setIsLoginLoading(false);
    } finally {
      setIsLoginLoading(false);
    }
  }, [fetchEvents]);

  const handleLogout = useCallback(() => {
    setUser(null);
    setSelectedEvent(null);
    setLoginError(null);
    setIsLoginLoading(false);
    setScreen('login');
  }, []);

  const handleSelectEvent = useCallback((eventId: number) => {
    const event = events.find(e => e.id === eventId);
    if (event) {
      setSelectedEvent(event);
      setScreen('checkIn');
    }
  }, [events]);
  
  const handleCheckIn = useCallback(async (participantId: number) => {
    if (!selectedEvent || !user) return;

    const participant = selectedEvent.participants.find(p => p.id === participantId);
    if (!participant) {
      setFeedbackModal({ type: 'invalid' });
      return;
    }

    if (!selectedEvent.uuid) {
      console.error('Evento sem UUID para check-in');
      setFeedbackModal({ type: 'invalid' });
      return;
    }

    try {
      const { data, error } = await supabase.rpc('perform_operator_checkin', {
        p_operator_id: user.id,
        p_event_id: selectedEvent.uuid,
        p_qr_code: participant.qrCode || null,
        p_ticket_id: null
      });

      if (error) throw error;

      if (!data || !data.success) {
        if (data?.already_checked_in) {
          setFeedbackModal({
            type: 'warning',
            participant,
            previousCheckIn: {
              time: data?.checkin?.created_at ? new Date(data.checkin.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : 'N/A',
              operator: user.name
            }
          });
          return;
        }
        setFeedbackModal({ type: 'invalid' });
        return;
      }

      // Atualizar estado local
      const updatedParticipants = selectedEvent.participants.map(p => {
        if (p.id === participantId) {
          return {
            ...p,
            name: data.participant?.name || p.name,
            email: data.participant?.email || p.email,
            cpf: data.participant?.document || p.cpf,
            checkedIn: true,
            checkInTime: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            checkedInBy: user?.name || 'Operador'
          };
        }
        return p;
      });
      const updatedEvent = { ...selectedEvent, participants: updatedParticipants };
      setSelectedEvent(updatedEvent);
      setEvents(prev => prev.map(e => (e.id === selectedEvent.id ? updatedEvent : e)));

      setFeedbackModal({ type: 'success', participant: updatedParticipants.find(p => p.id === participantId) });
    } catch (error: any) {
      console.error('Erro ao realizar check-in (RPC):', error);
      setFeedbackModal({ type: 'invalid' });
      console.error('Erro ao realizar check-in:', error);
        setFeedbackModal({ type: 'invalid' });
    }
  }, [selectedEvent, user]);

  const closeFeedbackModal = () => setFeedbackModal(null);

  const renderScreen = () => {
    switch (screen) {
      case 'login':
        return <LoginScreen onLogin={handleLogin} isLoading={isLoginLoading} error={loginError} />;
      case 'eventSelection':
        return user && (
          isLoadingEvents ? (
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D94682] mx-auto mb-4"></div>
                <p className="text-gray-600">Carregando eventos...</p>
              </div>
            </div>
          ) : (
            <EventSelectionScreen events={events} user={user} onSelectEvent={handleSelectEvent} onLogout={handleLogout} />
          )
        );
      case 'checkIn':
        return selectedEvent && <CheckInScreen event={selectedEvent} onCheckIn={handleCheckIn} onNavigateToStats={() => setScreen('statistics')} onBack={() => setScreen('eventSelection')} />;
      case 'statistics':
        return selectedEvent && user && <StatisticsScreen event={selectedEvent} operatorName={user.name} onBack={() => setScreen('checkIn')} />;
      default:
        return <LoginScreen onLogin={handleLogin} isLoading={isLoginLoading} error={loginError} />;
    }
  };

  return (
    <div className="font-sans bg-gray-200">
      <div className="w-full mx-auto min-h-screen bg-white shadow-lg flex flex-col">
          {renderScreen()}
      </div>
      {feedbackModal && <FeedbackModal data={feedbackModal} onClose={closeFeedbackModal} />}
    </div>
  );
};

export default App;