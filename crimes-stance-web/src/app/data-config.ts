export const DATA_CONFIG = {
  // URL base para os datasets hospedados no Cloudflare R2
  // Tenta buscar do .env (Vite), senão usa o fallback fixo
  BASE_DATA_URL: (import.meta as any).env?.VITE_BASE_DATA_URL || 'https://pub-a051ee79c31b4aceb32bd398630bc042.r2.dev'
};

console.log('[DATA_CONFIG] Base Data URL:', DATA_CONFIG.BASE_DATA_URL);
