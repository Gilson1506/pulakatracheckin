import React from 'react';
import type { Participant } from '../types';
import { UserIcon, TicketIcon } from './icons';

interface ParticipantCardProps {
  participant: Participant;
  onCheckIn: (participantId: number) => void;
}

const ParticipantCard: React.FC<ParticipantCardProps> = ({ participant, onCheckIn }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex items-start space-x-4 transition-transform hover:scale-[1.02]">
      <div className="flex-shrink-0 bg-gray-200 rounded-full p-2 mt-1">
        <UserIcon className="w-6 h-6 text-gray-600" />
      </div>
      <div className="flex-grow">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-bold text-gray-800 mr-2">{participant.name}</h3>
          <span
            className={`px-2 py-1 text-xs font-bold text-white rounded-full ${
              participant.checkedIn ? 'bg-green-500' : 'bg-pink-500'
            }`}
          >
            {participant.ticketType}
          </span>
        </div>
        
        <p className="text-gray-500 text-sm">{participant.cpf || 'CPF não informado'}</p>
        <p className="text-gray-500 text-sm">{participant.email || 'Email não informado'}</p>
        
        <div className="mt-3 flex justify-between items-center">
          <div className="flex items-center text-gray-600">
            <TicketIcon className="w-4 h-4 mr-2" />
            <span className="font-semibold">R$ {participant.price.toFixed(2).replace('.', ',')}</span>
          </div>
          
          <div>
            {participant.checkedIn ? (
               <div className="text-right">
                <p className="font-bold text-green-600">Check-in realizado</p>
                {participant.checkInTime && (
                   <p className="text-sm text-gray-500">
                    às {participant.checkInTime}
                    {participant.checkedInBy && ` por ${participant.checkedInBy}`}
                  </p>
                )}
              </div>
            ) : (
              <button
                onClick={() => onCheckIn(participant.id)}
                className="px-6 py-1 bg-white text-[#D94682] border-2 border-[#D94682] rounded-md font-semibold hover:bg-[#D94682] hover:text-white transition-colors"
              >
                Check-in
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticipantCard;
