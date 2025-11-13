export function getLogoUrl(): string {
  const envUrl = (import.meta as any).env?.VITE_LOGO_URL as string | undefined;
  if (envUrl && envUrl.trim().length > 0) return envUrl;
  // Fallback genérico
  return 'https://dummyimage.com/120x40/ffffff/000000.png&text=Pulacatraca';
}
