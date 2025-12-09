import React, { useEffect, useRef, useState } from 'react';
import type { Participant } from '../types';
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { getLogoUrl } from '../lib/branding';

interface QRScannerProps {
  participants: Participant[];
  onScanSuccess: (participantId: number) => void;
  onScanError: () => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ participants, onScanSuccess, onScanError }) => {
  const [status, setStatus] = useState<'idle' | 'scanning' | 'error' | 'unsupported'>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const containerId = 'qr-reader-container';

  useEffect(() => {
    let cancelled = false;

    async function startScanner() {
      try {
        // Feature detection
        const mediaDevices = navigator.mediaDevices as any;
        if (!mediaDevices || !mediaDevices.getUserMedia) {
          setStatus('unsupported');
          setErrorMsg('Este dispositivo/navegador não suporta câmera.');
          return;
        }

        setStatus('scanning');

        const config = {
          fps: 10,
          qrbox: { width: 240, height: 240 },
          rememberLastUsedCamera: true,
          supportedScanTypes: [
            // Live camera scanning
          ],
          formatsToSupport: [
            Html5QrcodeSupportedFormats.QR_CODE,
          ],
        } as any;

        const scanner = new Html5QrcodeScanner(containerId, config, false);
        scannerRef.current = scanner;

        scanner.render(
          (decodedText) => {
            // Tentar mapear o texto do QR para um participante
            // Convenções aceitas: texto igual ao qrCode salvo, ou número/id
            const direct = participants.find(p => p.qrCode && (p.qrCode === decodedText));
            if (direct) {
              onScanSuccess(direct.id);
              return;
            }

            const asNumber = Number(decodedText);
            if (!Number.isNaN(asNumber)) {
              const byId = participants.find(p => p.id === asNumber);
              if (byId) {
                onScanSuccess(byId.id);
                return;
              }
            }

            // Não encontrou participante local — sinalizar para tratar via backend
            onScanError();
          },
          (err) => {
            // Erros intermitentes de detecção — manter log leve
            // console.debug('Scanner error tick', err);
          }
        );
      } catch (e: any) {
        if (cancelled) return;
        setStatus('error');
        setErrorMsg(e?.message || 'Falha ao iniciar câmera.');
      }
    }

    // Solicitar permissão explicitamente dispara o prompt do navegador
    navigator.mediaDevices?.getUserMedia?.({ video: { facingMode: 'environment' } })
      .then((stream) => {
        // Parar tracks imediatamente; html5-qrcode gerencia as próprias
        stream.getTracks().forEach(t => t.stop());
        if (!cancelled) startScanner();
      })
      .catch((err) => {
        if (cancelled) return;
        setStatus('error');
        setErrorMsg('Permissão de câmera negada.');
      });

    return () => {
      cancelled = true;
      try {
        scannerRef.current?.clear?.();
      } catch { }
    };
  }, [participants, onScanError, onScanSuccess]);

  return (
    <div className="flex-grow flex flex-col items-center justify-center bg-gray-900 text-white">
      <header className="w-full flex items-center justify-center py-3">
        <img src={getLogoUrl()} alt="logo" className="h-8" />
      </header>
      <div className="w-full max-w-sm p-4">
        <div id={containerId} className="rounded-md overflow-hidden bg-black" />
        <div className="mt-3 text-center text-sm opacity-80 min-h-[24px]">
          {status === 'scanning' && 'Aponte para o QR code'}
          {status === 'unsupported' && (errorMsg || 'Câmera não suportada neste dispositivo.')}
          {status === 'error' && (errorMsg || 'Erro ao acessar a câmera.')}
        </div>
      </div>

    </div>
  );
};

export default QRScanner;