export function getLogoUrl(): string {
  const envUrl = (import.meta as any).env?.VITE_LOGO_URL as string | undefined;
  if (envUrl && envUrl.trim().length > 0) return envUrl;
  // Fallback para o logo local
  return '/logo-com-qr.png';
}
