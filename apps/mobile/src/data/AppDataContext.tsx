import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";
import { emptyData } from "../domain/backup";
import { confirmPreviousWeek } from "../domain/medals";
import { weekKey } from "../domain/stats";
import type { AppData, DrinkEntry, Objective, Settings } from "../domain/types";
import * as repository from "./repository";

type Store = { data: AppData; ready: boolean; error?: string; add: (entry: Omit<DrinkEntry, "id">) => Promise<void>; update: (entry: DrinkEntry) => Promise<void>; remove: (id: string) => Promise<void>; settings: (patch: Partial<Settings>) => Promise<void>; completeOnboarding: (objective: Objective, weeklyGoalMl: number) => Promise<void>; confirmWeek: () => Promise<void>; replace: (data: AppData) => Promise<void>; clear: () => Promise<void>; };
const Context = createContext<Store | undefined>(undefined);
export function AppDataProvider({ children }: PropsWithChildren) {
  const [data, setData] = useState<AppData>(emptyData()); const [ready, setReady] = useState(false); const [error, setError] = useState<string>();
  useEffect(() => { repository.loadData().then(setData).catch(() => setError("Não foi possível abrir seus dados locais. Nada foi apagado.")).finally(() => setReady(true)); }, []);
  const store = useMemo<Store>(() => ({
    data, ready, error,
    add: async (input) => { const entry = { ...input, id: `entry-${Date.now()}-${Math.random().toString(36).slice(2, 10)}` }; await repository.saveEntry(entry); setData((old) => ({ ...old, entries: [entry, ...old.entries] })); },
    update: async (entry) => { await repository.updateEntry(entry); setData((old) => ({ ...old, entries: old.entries.map((item) => item.id === entry.id ? entry : item) })); },
    remove: async (id) => { await repository.removeEntry(id); setData((old) => ({ ...old, entries: old.entries.filter((item) => item.id !== id) })); },
    settings: async (patch) => { const next = { ...data.settings, ...patch }; let goals = data.weekGoals; if (patch.objective || patch.weeklyGoalMl) { const current = weekKey(); goals = [...goals.filter((goal) => goal.weekKey !== current), { weekKey: current, objective: next.objective, goalMl: next.objective === "reduce" ? next.weeklyGoalMl : undefined }]; await repository.saveWeekGoals(goals); } await repository.saveSettings(next); setData((old) => ({ ...old, settings: next, weekGoals: goals })); },
    completeOnboarding: async (objective, weeklyGoalMl) => { const settings = { ...data.settings, onboarded: true, onboardedAt: Date.now(), objective, weeklyGoalMl }; const goals = [{ weekKey: weekKey(), objective, goalMl: objective === "reduce" ? weeklyGoalMl : undefined }]; await repository.saveSettings(settings); await repository.saveWeekGoals(goals); setData((old) => ({ ...old, settings, weekGoals: goals })); },
    confirmWeek: async () => { const next = confirmPreviousWeek(data); await repository.saveSettings(next.settings); setData(next); },
    replace: async (next) => { await repository.replaceAll(next); setData(next); },
    clear: async () => { const next = emptyData(); next.settings = { ...next.settings, onboarded: true, onboardedAt: Date.now(), objective: data.settings.objective }; await repository.replaceAll(next); setData(next); },
  }), [data, ready, error]);
  return <Context.Provider value={store}>{children}</Context.Provider>;
}
export const useAppData = (): Store => { const value = useContext(Context); if (!value) throw new Error("AppDataProvider ausente"); return value; };
