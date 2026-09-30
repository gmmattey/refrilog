import type { Settings } from "./types";
export const APP_NAME = "RefriLog";
export const APP_TAGLINE = "Seu refri, do seu jeito.";
export const APP_VERSION = "2.0.0";
export const BRANDS = ["Coca-Cola", "Pepsi", "Guaraná Antarctica", "Fanta", "Sprite", "Sukita", "Outra marca"];
export const PORTIONS = [
  { ml: 200, label: "Copo · 200 ml" },
  { ml: 350, label: "Lata · 350 ml" },
  { ml: 600, label: "Garrafa · 600 ml" },
  { ml: 1000, label: "1 litro" },
  { ml: 2000, label: "2 litros" },
];
export const DEFAULT_SETTINGS: Settings = { onboarded: false, onboardedAt: 0, objective: "track", weeklyGoalMl: 2450, confirmedWeeks: [], achievedWeeks: [] };
