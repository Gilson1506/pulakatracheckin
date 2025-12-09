import React, { useState } from 'react';
import type { Event, Participant } from '../types';
import QRScanner from '../components/QRScanner';
import ManualSearch from '../components/ManualSearch';
import { QrCodeIcon, SearchIcon } from '../components/icons';
import { getLogoUrl } from '../lib/branding';

interface CheckInScreenProps {
  event: Event;
  onCheckIn: (participantId: number) => void;
  onNavigateToStats: () => void;
  onBack: () => void;
}

type ActiveTab = 'qr' | 'search';

const CheckInScreen: React.FC<CheckInScreenProps> = ({ event, onCheckIn, onNavigateToStats, onBack }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('qr');

  return (
    <div className="flex flex-col flex-grow bg-gray-100 h-screen overflow-hidden">
      <header className="bg-[#D94682] text-white p-4 flex justify-between items-center shadow-md z-10 flex-shrink-0">
        <button onClick={onBack} className="text-lg">← Voltar</button>
        <img src={getLogoUrl()} alt="Pulacatraca" className="h-6" />
        <button onClick={onNavigateToStats} className="text-lg">Stats</button>
      </header>
      
      <main key={activeTab} className="flex-grow flex flex-col animate-fade-in">
        {activeTab === 'qr' && <QRScanner participants={event.participants} onScanSuccess={onCheckIn} onScanError={() => onCheckIn(-1)} />}
        {activeTab === 'search' && <ManualSearch participants={event.participants} onCheckIn={onCheckIn} />}
      </main>

      <footer className="bg-white p-2 border-t-2 border-gray-200 shadow-inner flex-shrink-0">
        <div className="flex justify-around">
          <button
            onClick={() => setActiveTab('qr')}
            className={`flex-1 py-3 px-2 rounded-lg flex items-center justify-center space-x-2 text-lg font-semibold transition-colors ${
              activeTab === 'qr' ? 'bg-[#D94682] text-white shadow-md' : 'text-gray-600'
            }`}
          >
            <QrCodeIcon className="w-6 h-6" />
            <span>QR CODE</span>
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`flex-1 py-3 px-2 rounded-lg flex items-center justify-center space-x-2 text-lg font-semibold transition-colors ${
              activeTab === 'search' ? 'bg-[#D94682] text-white shadow-md' : 'text-gray-600'
            }`}
          >
            <SearchIcon className="w-6 h-6"/>
            <span>BUSCAR</span>
          </button>
        </div>
      </footer>
       <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default CheckInScreen;