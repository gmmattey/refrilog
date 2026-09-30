import { useEffect, useState } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { DEFAULT_SETTINGS } from "./constants";
import type { DrinkEntry, Objective, Settings } from "./types";
interface RefriState {
  entries: DrinkEntry[];
  settings: Settings;
  addEntry: (entry: Pick<DrinkEntry, "brand" | "variant" | "ml" | "cost">) => void;
  updateEntry: (id: string, patch: Partial<DrinkEntry>) => void;
  deleteEntry: (id: string) => void;
  setSettings: (patch: Partial<Settings>) => void;
  completeOnboarding: (objective: Objective, weeklyGoalMl: number) => void;
  resetData: () => void;
}
const memoryStorage: Storage = { getItem: () => null, setItem: () => undefined, removeItem: () => undefined, clear: () => undefined, key: () => null, length: 0 };
export const useRefriStore = create<RefriState>()(
  persist(
    (set, get) => ({
      entries: [], settings: DEFAULT_SETTINGS,
      addEntry: (entry) => set({ entries: [{ id: crypto.randomUUID(), at: Date.now(), ...entry }, ...get().entries] }),
      updateEntry: (id, patch) => set({ entries: get().entries.map((entry) => entry.id === id ? { ...entry, ...patch, size: undefined } : entry) }),
      deleteEntry: (id) => set({ entries: get().entries.filter((entry) => entry.id !== id) }),
      setSettings: (patch) => set({ settings: { ...get().settings, ...patch } }),
      completeOnboarding: (objective, weeklyGoalMl) => set({ settings: { ...get().settings, onboarded: true, onboardedAt: Date.now(), objective, weeklyGoalMl } }),
      resetData: () => set({ entries: [], settings: { ...DEFAULT_SETTINGS, onboarded: true, onboardedAt: Date.now(), objective: get().settings.objective } }),
    }),
    {
      name: "refrilog-v1", // preserve prototype records
      storage: createJSONStorage(() => typeof window === "undefined" ? memoryStorage : localStorage),
      merge: (persisted, current) => {
        const old = persisted as Partial<RefriState> | undefined;
        return { ...current, ...old, settings: { ...DEFAULT_SETTINGS, ...old?.settings, confirmedWeeks: old?.settings?.confirmedWeeks ?? [], achievedWeeks: old?.settings?.achievedWeeks ?? [] } };
      },
      partialize: (state) => ({ entries: state.entries, settings: state.settings }),
    },
  ),
);
export function useHasHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    const finish = () => setHydrated(true);
    const unsub = useRefriStore.persist.onFinishHydration(finish);
    if (useRefriStore.persist.hasHydrated()) finish();
    return unsub;
  }, []);
  return hydrated;
}
