import React, { useEffect, useRef, useState } from 'react';
import type { Participant } from '../types';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';

interface QRScannerProps {
  onScan: (decodedText: string) => void;
  onScanError: () => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScan, onScanError }) => {
  const [status, setStatus] = useState<'idle' | 'scanning' | 'error' | 'unsupported'>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const html5qrcodeRef = useRef<Html5Qrcode | null>(null);
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

        const html5qrcode = new Html5Qrcode(containerId, /* verbose= */ false);
        html5qrcodeRef.current = html5qrcode;

        // Tentar escolher explicitamente a câmera traseira
        let startArg: any = { facingMode: { ideal: 'environment' } };
        try {
          const cameras = await Html5Qrcode.getCameras();
          if (cameras && cameras.length > 0) {
            const rear = cameras.find(c => /back|rear|environment/i.test(c.label || '')) || cameras[0];
            if (rear?.id) startArg = rear.id;
          }
        } catch {}

        // Calcular tamanho do box quadrado (maior) dinamicamente
        const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
        const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
        let qrBoxSize = Math.min(Math.floor(vw * 0.85), Math.floor(vh * 0.55));
        qrBoxSize = Math.max(260, Math.min(qrBoxSize, 520));

        await html5qrcode.start(
          startArg,
          {
            fps: 10,
            qrbox: qrBoxSize, // quadrado e grande
            aspectRatio: undefined as any,
          },
          (decodedText) => {
            onScan(decodedText);
          },
          () => {
            // ignore frame errors
          }
        );
      } catch (e: any) {
        if (cancelled) return;
        setStatus('error');
        setErrorMsg(e?.message || 'Falha ao iniciar câmera.');
      }
    }

    // Consultar permissão e acionar prompt de forma amigável
    const requestCamera = async () => {
      try {
        const perm = (navigator as any).permissions?.query ? await (navigator as any).permissions.query({ name: 'camera' as any }) : null;
        if (perm && perm.state === 'denied') {
          setStatus('error');
          setErrorMsg('Permissão de câmera negada nas configurações do navegador. Habilite a câmera para continuar.');
          return;
        }
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } } });
        stream.getTracks().forEach(t => t.stop());
        if (!cancelled) startScanner();
      } catch (err) {
        if (cancelled) return;
        setStatus('error');
        setErrorMsg('Permissão de câmera negada.');
      }
    };

    requestCamera();

    return () => {
      cancelled = true;
      try {
        if (html5qrcodeRef.current) {
          const inst = html5qrcodeRef.current;
          html5qrcodeRef.current = null;
          inst.stop().catch(() => {}).finally(() => inst.clear());
        }
      } catch {}
    };
  }, [onScan, onScanError]);

  return (
    <div className="flex flex-col items-center justify-center bg-gray-900 text-white h-full w-full">
      <div className="w-full h-full p-3 flex flex-col items-center justify-center">
        <div id={containerId} className="rounded-xl overflow-hidden bg-black w-full h-full max-w-[900px]" />
        <div className="mt-3 text-center text-sm opacity-80 min-h-[20px]">
          {status === 'scanning' && 'Aponte para o QR code'}
          {status === 'unsupported' && (errorMsg || 'Câmera não suportada neste dispositivo.')}
          {status === 'error' && (errorMsg || 'Erro ao acessar a câmera.')}
        </div>
      </div>
    </div>
  );
};

export default QRScanner;