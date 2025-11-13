import React, { useEffect, useRef, useState } from 'react';
import type { Participant } from '../types';
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats, Html5QrcodeScanType } from 'html5-qrcode';
import { getLogoUrl } from '../lib/branding';

interface QRScannerProps {
  onScan: (decodedText: string) => void;
  onScanError: () => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScan, onScanError }) => {
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
          showTorchButtonIfSupported: true,
          showZoomSliderIfSupported: true,
          aspectRatio: 1.333,
          supportedScanTypes: [
            Html5QrcodeScanType.SCAN_TYPE_CAMERA,
          ],
          formatsToSupport: [
            Html5QrcodeSupportedFormats.QR_CODE,
          ],
        } as any;

        const scanner = new Html5QrcodeScanner(containerId, config, false);
        scannerRef.current = scanner;

        scanner.render(
          (decodedText) => {
            // Encaminhar QR dinâmico para a camada superior tratar (RPC/backend)
            onScan(decodedText);
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
        scannerRef.current?.clear?.();
      } catch {}
    };
  }, [onScan, onScanError]);

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