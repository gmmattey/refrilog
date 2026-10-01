export type Objective = "track" | "reduce";

export interface DrinkEntry {
  id: string;
  at: number;
  brand: string;
  variant?: string;
  ml: number;
  /** Valor atribuído à quantidade registrada, não necessariamente à embalagem. */
  cost?: number;
}

export interface WeekGoalSnapshot {
  weekKey: string;
  objective: Objective;
  goalMl?: number;
}

export interface Settings {
  onboarded: boolean;
  onboardedAt: number;
  objective: Objective;
  weeklyGoalMl: number;
  confirmedWeeks: string[];
  achievedWeeks: string[];
}

export interface AppData { entries: DrinkEntry[]; settings: Settings; weekGoals: WeekGoalSnapshot[]; }
export interface BackupFile { format: "refrilog-backup"; version: 1; exportedAt: number; data: AppData; }

export const DEFAULT_SETTINGS: Settings = {
  onboarded: false, onboardedAt: 0, objective: "track", weeklyGoalMl: 2450,
  confirmedWeeks: [], achievedWeeks: [],
};
