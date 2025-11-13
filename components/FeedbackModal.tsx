import React from 'react';
import type { FeedbackModalData } from '../types';
import { CheckCircleIcon, WarningIcon, XCircleIcon } from './icons';

interface FeedbackModalProps {
  data: FeedbackModalData;
  onClose: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ data, onClose }) => {
  const renderContent = () => {
    switch (data.type) {
      case 'success':
        return (
          <div className="bg-green-100/80 rounded-2xl p-6 text-center shadow-2xl relative text-gray-800 w-full max-w-sm">
            <div className="absolute -top-8 sm:-top-10 left-1/2 -translate-x-1/2 bg-white w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center shadow-lg">
                <div className="bg-green-500 text-white w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center">
                    <CheckCircleIcon className="w-8 h-8 sm:w-10 sm:h-10" strokeWidth={1.5}/>
                </div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mt-10 sm:mt-12 text-green-700">CHECK-IN REALIZADO</h2>
            {data.participant && (
              <div className="mt-6 text-left bg-white/50 p-4 rounded-lg">
                <p className="font-bold text-lg">{data.participant.name}</p>
                <p>{data.participant.ticketType} - R$ {data.participant.price.toFixed(2).replace('.',',')}</p>
                <p>CPF: {data.participant.cpf}</p>
              </div>
            )}
            <div className="mt-4 bg-green-200 text-green-800 font-semibold py-2 px-4 rounded-lg">
              {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </div>
            <button onClick={onClose} className="mt-8 w-full bg-[#D94682] text-white py-3 rounded-lg text-lg font-bold">
              FECHAR
            </button>
          </div>
        );
      case 'warning':
        return (
          <div className="bg-yellow-100/80 rounded-2xl p-6 text-center shadow-2xl relative text-gray-800 w-full max-w-sm">
             <div className="absolute -top-8 sm:-top-10 left-1/2 -translate-x-1/2 bg-white w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center shadow-lg">
                <div className="bg-orange-400 text-white w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center">
                     <WarningIcon className="w-8 h-8 sm:w-10 sm:h-10" strokeWidth={1.5}/>
                </div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mt-10 sm:mt-12 text-orange-600">JÁ FEZ CHECK-IN</h2>
            {data.participant && (
              <div className="mt-6 text-left bg-white p-4 rounded-lg shadow-sm border border-orange-300">
                <p className="font-bold text-lg text-orange-700">{data.participant.name}</p>
                <p>{data.participant.ticketType} - R$ {data.participant.price.toFixed(2).replace('.',',')}</p>
              </div>
            )}
            {data.previousCheckIn && (
                 <div className="mt-4 text-left bg-white p-4 rounded-lg shadow-sm">
                    <p>Check-in anterior: {data.previousCheckIn.time}</p>
                    <p>Operador: {data.previousCheckIn.operator}</p>
                 </div>
            )}
            <button onClick={onClose} className="mt-8 w-full bg-[#D94682] text-white py-3 rounded-lg text-lg font-bold">
              FECHAR
            </button>
          </div>
        );
      case 'invalid':
        return (
          <div className="bg-red-100/80 rounded-2xl p-6 sm:p-8 text-center shadow-2xl relative text-gray-800 w-full max-w-sm">
             <div className="absolute -top-8 sm:-top-10 left-1/2 -translate-x-1/2 bg-white w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center shadow-lg">
                <div className="bg-red-500 text-white w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center">
                     <XCircleIcon className="w-8 h-8 sm:w-10 sm:h-10" strokeWidth={1.5}/>
                </div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mt-10 sm:mt-12 text-red-700">INGRESSO INVÁLIDO</h2>
            <p className="mt-4 text-red-600">QR Code não encontrado ou não pertence a este evento</p>
            <button onClick={onClose} className="mt-8 w-full bg-white text-gray-800 py-3 rounded-lg text-lg font-bold border-2 border-gray-400">
              TENTAR NOVAMENTE
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      {renderContent()}
    </div>
  );
};

export default FeedbackModal;
