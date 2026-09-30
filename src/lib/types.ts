export type DrinkSize = "can" | "bottle" | "twoLiter";
export type Objective = "track" | "reduce";
export interface DrinkEntry {
  id: string;
  at: number;
  size?: DrinkSize; // legacy records
  brand?: string;
  variant?: string;
  ml?: number;
  cost?: number;
}
export interface Settings {
  onboarded: boolean;
  onboardedAt: number;
  objective: Objective;
  weeklyGoalMl: number;
  confirmedWeeks: string[];
  achievedWeeks: string[];
  dailyGoal?: number; // legacy preferences
  sodaFreeGoal?: number;
  soundEnabled?: boolean;
  sugarPerCan?: number;
  pricePerCan?: number;
}
export type HistoryFilter = "today" | "week" | "all";
