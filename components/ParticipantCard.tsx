import React from 'react';
import type { Participant } from '../types';
import { UserIcon } from './icons';

interface ParticipantCardProps {
  participant: Participant;
  onCheckIn: (participantId: number) => void;
}

const ParticipantCard: React.FC<ParticipantCardProps> = ({ participant, onCheckIn }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex items-start space-x-4">
      <div className="flex-shrink-0 bg-gray-200 rounded-full p-2 mt-1">
        <UserIcon className="w-6 h-6 text-gray-600" />
      </div>
      <div className="flex-grow">
        <div className="flex flex-col sm:flex-row justify-between sm:items-start">
          <h3 className="text-lg font-bold text-gray-800 mr-2">{participant.name}</h3>
          <span className={`text-sm text-left sm:text-right font-semibold whitespace-nowrap ${participant.checkedIn ? 'text-green-600' : 'text-gray-700'}`}>
            {participant.ticketType} - R$ {participant.price.toFixed(2).replace('.', ',')}
          </span>
        </div>
        <p className="text-gray-500 text-sm">{participant.cpf}</p>
        <p className="text-gray-500 text-sm">{participant.email}</p>
        
        <div className="mt-2 text-right">
          {participant.checkedIn ? (
            <p className="text-green-600 font-bold">Já realizou check-in</p>
          ) : (
            <button
              onClick={() => onCheckIn(participant.id)}
              className="px-6 py-1 bg-white text-[#D94682] border-2 border-[#D94682] rounded-md font-semibold hover:bg-[#D94682] hover:text-white transition-colors"
            >
              Check in
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParticipantCard;
