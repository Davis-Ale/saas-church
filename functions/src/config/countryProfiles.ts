// functions/src/config/countryProfiles.ts

export const countryProfiles = {
  BR: {
    currency: "BRL",
    locale: "pt-BR",
    timezone: "America/Sao_Paulo",
  },
  CA: {
    currency: "CAD",
    locale: "en-CA",
    timezone: "America/Toronto",
  },
  US: {
    currency: "USD",
    locale: "en-US",
    timezone: "America/New_York",
  },
  PT: {
    currency: "EUR",
    locale: "pt-PT",
    timezone: "Europe/Lisbon",
  },
} as const;

export type SupportedCountry = keyof typeof countryProfiles;
export function isSupportedCountry(
  value: string
): value is SupportedCountry {
  return value in countryProfiles;
}
