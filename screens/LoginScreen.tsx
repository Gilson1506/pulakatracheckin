import React, { useState, useCallback, useEffect } from 'react';

interface LoginScreenProps {
  onLogin: (pin: string) => void;
  isLoading: boolean;
  error: string | null;
}

const KeypadButton: React.FC<{ value: string; onClick: (value: string) => void }> = ({ value, onClick }) => (
  <button
    onClick={() => onClick(value)}
    className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-100 rounded-full text-gray-800 text-2xl font-light flex items-center justify-center transition-colors hover:bg-gray-200"
  >
    {value}
  </button>
);

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, isLoading, error }) => {
  const [pin, setPin] = useState('');

  useEffect(() => {
    // Clear PIN on error
    if (error) {
      setPin('');
    }
  }, [error]);

  const handleKeyPress = useCallback((value: string) => {
    if (isLoading) return;
    setPin(prevPin => (prevPin.length < 6 ? prevPin + value : prevPin));
  }, [isLoading]);

  const handleBackspace = () => {
    if (isLoading) return;
    setPin(pin.slice(0, -1));
  };

  const handleSubmit = () => {
    if (pin.length === 6 && !isLoading) {
      onLogin(pin);
    }
  }

  return (
    <div className="flex flex-col flex-grow bg-white">
      <div className="flex-grow flex flex-col items-center justify-center pt-6 sm:pt-8">
        <img src="/logo-com-qr.png" alt="PULACATRACA" className="h-20 mb-4 object-contain" />
        <h2 className="text-gray-600 text-lg mt-3 mb-1">Operador de Entrada</h2>
        <p className="text-gray-400 text-xs mb-3">Digite o PIN de 6 dígitos</p>

        <div className={`w-48 h-10 bg-gray-100 rounded-lg flex items-center justify-center mb-1 transition-transform ${error ? 'animate-shake' : ''}`}>
          <p className="text-gray-700 text-3xl tracking-[0.5em] font-mono select-none" aria-label={`PIN: ${pin.length} digits entered`}>
            {pin.split('').map(() => '●').join('')}
          </p>
        </div>
        <div className="h-5 mb-1">
          {error && <p className="text-red-500 text-xs text-center">{error}</p>}
        </div>

        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {'123456789'.split('').map(val => <KeypadButton key={val} value={val} onClick={handleKeyPress} />)}
          <div />
          <KeypadButton value={'0'} onClick={handleKeyPress} />
          <button onClick={handleBackspace} className="w-14 h-14 sm:w-16 sm:h-16 text-gray-500 text-2xl flex items-center justify-center">
            ⌫
          </button>
        </div>
      </div>
      <div className="p-4 pt-2">
        <button
          onClick={handleSubmit}
          disabled={pin.length !== 6 || isLoading}
          className="w-full bg-[#D94682] text-white py-3 rounded-xl text-base font-bold shadow-lg transition-transform hover:scale-105 disabled:opacity-50 disabled:scale-100 flex items-center justify-center h-14"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
          ) : (
            'ENTRAR'
          )}
        </button>
        <p className="text-center text-gray-400 text-xs mt-3">Versão 1.0.0</p>
      </div>
      <style>{`
        @keyframes shake {
          10%, 90% { transform: translateX(-1px); }
          20%, 80% { transform: translateX(2px); }
          30%, 50%, 70% { transform: translateX(-4px); }
          40%, 60% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}</style>
    </div>
  );
};

export default LoginScreen;