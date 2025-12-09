
import React, { useState, useMemo } from 'react';
import type { Participant } from '../types';
import ParticipantCard from './ParticipantCard';
import { SearchIcon } from './icons';

interface ManualSearchProps {
  participants: Participant[];
  onCheckIn: (participantId: number) => void;
}

const ManualSearch: React.FC<ManualSearchProps> = ({ participants, onCheckIn }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredParticipants = useMemo(() => {
    if (!searchTerm) {
      return participants;
    }
    const lowercasedTerm = searchTerm.toLowerCase();
    return participants.filter(
      p =>
        p.name.toLowerCase().includes(lowercasedTerm) ||
        p.cpf.includes(lowercasedTerm) ||
        p.email.toLowerCase().includes(lowercasedTerm)
    );
  }, [participants, searchTerm]);

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="p-4 bg-white border-b sticky top-0 z-10">
        <div className="relative">
          <input
            type="text"
            placeholder="Nome, CPF, Email"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D94682] focus:border-transparent outline-none transition-shadow"
          />
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
      </div>
      <div className="flex-grow overflow-y-auto p-4 space-y-3">
        {filteredParticipants.length > 0 ? (
          filteredParticipants.map(participant => (
            <ParticipantCard key={participant.id} participant={participant} onCheckIn={onCheckIn} />
          ))
        ) : (
          <p className="text-center text-gray-500 mt-8">Nenhum participante encontrado.</p>
        )}
      </div>
    </div>
  );
};

export default ManualSearch;
