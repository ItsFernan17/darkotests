export const backendHost =
  typeof window !== 'undefined'
    ? `${window.location.protocol}//${window.location.hostname}`
    : 'https://darkotest-escobo.bot.gt';

export const iaApiHost =
  typeof window !== 'undefined'
    ? `${window.location.origin}/ia`
    : 'https://darkotest-escobo.bot.gt/ia';