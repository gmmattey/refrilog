import { entriesInWeek, sumMl, weekKey } from "./stats";
import type { AppData, WeekGoalSnapshot } from "./types";

export function goalForWeek(data: AppData, key: string): WeekGoalSnapshot | undefined { return data.weekGoals.find((item) => item.weekKey === key); }
export function canConfirmPreviousWeek(data: AppData, now = new Date()): boolean {
  const previous = new Date(now); previous.setDate(previous.getDate() - 7);
  return data.settings.onboardedAt < new Date(previous.getFullYear(), previous.getMonth(), previous.getDate() - previous.getDay() + 7).getTime();
}
export function confirmPreviousWeek(data: AppData, now = new Date()): AppData {
  const prior = new Date(now); prior.setDate(prior.getDate() - 7); const key = weekKey(prior);
  if (data.settings.confirmedWeeks.includes(key)) return data;
  const snapshot = goalForWeek(data, key);
  const achieved = snapshot?.objective === "reduce" && snapshot.goalMl !== undefined && sumMl(entriesInWeek(data.entries, prior)) <= snapshot.goalMl;
  return { ...data, settings: { ...data.settings, confirmedWeeks: [...data.settings.confirmedWeeks, key], achievedWeeks: achieved ? [...data.settings.achievedWeeks, key] : data.settings.achievedWeeks } };
}
