import React, { useState } from 'react';
import type { Event } from '../types';
import { CalendarIcon, ChevronRightIcon } from '../components/icons';
import { getLogoUrl } from '../lib/branding';

interface EventSelectionScreenProps {
  events: Event[];
  user: { name: string };
  onSelectEvent: (eventId: number) => void;
  onLogout: () => void;
}

const EventSelectionScreen: React.FC<EventSelectionScreenProps> = ({ events, user, onSelectEvent, onLogout }) => {
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  const handleImageError = (eventId: number) => {
    setImageErrors(prev => new Set(prev).add(eventId));
  };

  return (
    <div className="flex flex-col flex-grow bg-gray-50">
      <header className="bg-[#D94682] text-white p-5 rounded-b-3xl shadow-lg">
        <div className="flex justify-between items-center">
          <button onClick={onLogout} className="text-lg">Sair</button>
          <img src={getLogoUrl()} alt="Pulacatraca" className="h-8" />
          <span className="text-lg font-semibold">Olá, {user.name}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold mt-4">Selecione o Evento</h1>
      </header>
      <main className="flex-grow p-4 space-y-4 overflow-y-auto">
        {events.map((event, index) => (
          <div
            key={event.id}
            onClick={() => onSelectEvent(event.id)}
            className={`w-full p-4 rounded-xl shadow-md cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] ${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {event.image && !imageErrors.has(event.id) ? (
                  <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 shadow-md bg-gray-200">
                    <img 
                      src={event.image} 
                      alt={event.name}
                      className="w-full h-full object-cover"
                      onError={() => handleImageError(event.id)}
                    />
                  </div>
                ) : (
                  <div className="bg-gray-200 p-3 rounded-lg flex-shrink-0 w-20 h-20 flex items-center justify-center">
                    <CalendarIcon className="text-gray-600 w-8 h-8" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold text-gray-800 truncate">{event.name}</h2>
                  <p className="text-gray-500 text-sm">{event.date} - {event.time}</p>
                  <p className="text-gray-600 font-medium text-sm truncate">{event.location}</p>
                </div>
              </div>
              <ChevronRightIcon className="text-gray-400 w-7 h-7 flex-shrink-0 ml-2" />
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};

export default EventSelectionScreen;
