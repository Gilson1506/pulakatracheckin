import React, { useMemo, useState } from 'react';
import type { Event } from '../types';
import { UserIcon } from '../components/icons';

interface StatisticsScreenProps {
  event: Event;
  operatorName?: string;
  onBack: () => void;
}

const StatisticsScreen: React.FC<StatisticsScreenProps> = ({ event, operatorName, onBack }) => {
  // Use a state to trigger re-calculation on refresh
  const [refreshKey, setRefreshKey] = useState(0);

  const stats = useMemo(() => {
    const total = event.participants.length;
    const checkedIn = event.participants.filter(p => p.checkedIn).length;
    const pending = total - checkedIn;
    const myCheckIns = operatorName 
      ? event.participants.filter(p => p.checkedInBy === operatorName).length
      : 0;
    const lastCheckIns = [...event.participants]
      .filter(p => p.checkedIn && p.checkInTime)
      .sort((a, b) => b.checkInTime!.localeCompare(a.checkInTime!))
      .slice(0, 5);

    return { total, checkedIn, pending, myCheckIns, lastCheckIns };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event.participants, refreshKey]);

  return (
    <div className="flex flex-col flex-grow bg-gray-50">
      <header className="bg-white text-gray-800 p-4 flex items-center shadow-md sticky top-0 z-20">
        <button onClick={onBack} className="text-lg text-[#D94682] w-24 text-left">← Voltar</button>
        <h1 className="text-xl font-bold text-center flex-grow">Estatísticas</h1>
        <div className="w-24"></div>
      </header>

      <main className="flex-grow p-4 space-y-4 overflow-y-auto">
        <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-600 mb-2">{event.name}</h2>
            <div className="text-center">
                <p className="text-gray-500">Check-ins Hoje</p>
                <p className="text-5xl sm:text-6xl font-bold text-[#D94682]">{stats.checkedIn}</p>
            </div>
            <div className="flex justify-between mt-4 text-center">
                <div>
                    <p className="text-gray-500">Total</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-800">{stats.total}</p>
                </div>
                <div>
                    <p className="text-gray-500">Pendente</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-800">{stats.pending}</p>
                </div>
            </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow text-center">
             <p className="text-gray-500">Meus Check-ins</p>
             <p className="text-4xl sm:text-5xl font-bold text-gray-800">{stats.myCheckIns}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Últimos Check-ins</h3>
            <ul className="space-y-3">
                {stats.lastCheckIns.map(p => (
                    <li key={p.id} className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                            <div className="bg-gray-200 rounded-full p-2">
                                <UserIcon className="w-5 h-5 text-gray-500"/>
                            </div>
                            <span className="text-gray-800">{p.name}</span>
                        </div>
                        <span className="text-gray-500 font-medium">{p.checkInTime}</span>
                    </li>
                ))}
            </ul>
        </div>
        
        <div className="pt-2 pb-4">
          <button 
              onClick={() => setRefreshKey(k => k + 1)}
              className="w-full bg-[#D94682] text-white py-4 rounded-xl text-lg font-bold shadow-lg transition-transform hover:scale-105 active:scale-100"
          >
              ATUALIZAR
          </button>
        </div>
      </main>
    </div>
  );
};

export default StatisticsScreen;