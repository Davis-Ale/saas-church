export type Lang = "pt" | "en";

export type TranslationKey =
  | "appName"
  | "dashboard"
  | "churches"
  | "members"
  | "cells"
  | "volunteers"
  | "finance"
  | "events"
  | "language"
  | "pt"
  | "en";

export const translations: Record<Lang, Record<TranslationKey, string>> = {
  pt: {
    appName: "Nome do Sistema",
    dashboard: "Dashboard",
    churches: "Igrejas",
    members: "Membros",
    cells: "Células",
    volunteers: "Voluntários",
    finance: "Financeiro",
    events: "Eventos",
    language: "Idioma",
    pt: "PT",
    en: "EN",
  },
  en: {
    appName: "System Name",
    dashboard: "Dashboard",
    churches: "Churches",
    members: "Members",
    cells: "Cells",
    volunteers: "Volunteers",
    finance: "Finance",
    events: "Events",
    language: "Language",
    pt: "PT",
    en: "EN",
  },
};
