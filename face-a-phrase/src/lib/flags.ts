export const FLAGS = {
  USE_BROWSER_RENDERER: import.meta.env.VITE_USE_BROWSER_RENDERER !== 'false', // default true
  ENABLE_TTS_ELEVENLABS: import.meta.env.VITE_ENABLE_TTS_ELEVENLABS === 'true', // default false
  SHOW_EXPERIMENTAL_BROLL: import.meta.env.VITE_SHOW_EXPERIMENTAL_BROLL === 'true', // default false
  AUTH_ENABLED: import.meta.env.VITE_AUTH_ENABLED === 'true', // default false - optional authentication
  USE_AI_GENERATION: import.meta.env.VITE_USE_AI_GENERATION === 'true', // default false - use AI instead of Canvas slideshow
} as const;

export type FlagName = keyof typeof FLAGS;

// Helper to check flags with fallback
export function getFlag(flag: FlagName): boolean {
  return FLAGS[flag] ?? false;
}

// Log current flag state (useful for debugging)
export function logFlagState(): void {
  console.log('🚀 SeriesMe Feature Flags:', FLAGS);
}