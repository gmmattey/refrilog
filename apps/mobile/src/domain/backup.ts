import { DEFAULT_SETTINGS, type AppData, type BackupFile, type DrinkEntry, type Settings, type WeekGoalSnapshot } from "./types";

const validObjective = (value: unknown): value is Settings["objective"] => value === "track" || value === "reduce";
const validEntry = (value: unknown): value is DrinkEntry => {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return typeof item.id === "string" && typeof item.at === "number" && typeof item.brand === "string" && typeof item.ml === "number" && item.ml > 0 && Number.isFinite(item.ml) &&
    (item.variant === undefined || typeof item.variant === "string") && (item.cost === undefined || (typeof item.cost === "number" && item.cost >= 0 && Number.isFinite(item.cost)));
};
const validSettings = (value: unknown): value is Settings => {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return typeof item.onboarded === "boolean" && typeof item.onboardedAt === "number" && validObjective(item.objective) && typeof item.weeklyGoalMl === "number" && item.weeklyGoalMl >= 100 &&
    Array.isArray(item.confirmedWeeks) && item.confirmedWeeks.every((x) => typeof x === "string") && Array.isArray(item.achievedWeeks) && item.achievedWeeks.every((x) => typeof x === "string");
};
const validWeekGoal = (value: unknown): value is WeekGoalSnapshot => {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return typeof item.weekKey === "string" && validObjective(item.objective) && (item.goalMl === undefined || (typeof item.goalMl === "number" && item.goalMl >= 100));
};
export function createBackup(data: AppData): BackupFile { return { format: "refrilog-backup", version: 1, exportedAt: Date.now(), data }; }
export function parseBackup(raw: string): BackupFile {
  let parsed: unknown; try { parsed = JSON.parse(raw); } catch { throw new Error("O arquivo não é um JSON válido."); }
  if (!parsed || typeof parsed !== "object") throw new Error("O arquivo de backup não tem o formato esperado.");
  const backup = parsed as Partial<BackupFile>;
  if (backup.format !== "refrilog-backup" || backup.version !== 1 || !backup.data || typeof backup.exportedAt !== "number") throw new Error("Este não é um backup compatível do RefriLog.");
  const data = backup.data as Partial<AppData>;
  if (!Array.isArray(data.entries) || !data.entries.every(validEntry) || !validSettings(data.settings) || !Array.isArray(data.weekGoals) || !data.weekGoals.every(validWeekGoal)) throw new Error("O backup tem dados inválidos e não foi importado.");
  return backup as BackupFile;
}
export const emptyData = (): AppData => ({ entries: [], settings: { ...DEFAULT_SETTINGS }, weekGoals: [] });
