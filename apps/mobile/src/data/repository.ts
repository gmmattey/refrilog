import * as SQLite from "expo-sqlite";
import { DEFAULT_SETTINGS, type AppData, type DrinkEntry, type Settings, type WeekGoalSnapshot } from "../domain/types";

const DATABASE = "refrilog.db";
let database: SQLite.SQLiteDatabase | undefined;
const getDb = async () => database ??= await SQLite.openDatabaseAsync(DATABASE);
const encode = (value: unknown) => JSON.stringify(value);
const decode = <T>(value: string | null | undefined, fallback: T): T => { try { return value ? JSON.parse(value) as T : fallback; } catch { return fallback; } };

export async function initializeDatabase(): Promise<void> {
  const db = await getDb();
  await db.execAsync(`PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS schema_migrations (version INTEGER PRIMARY KEY);
    CREATE TABLE IF NOT EXISTS entries (id TEXT PRIMARY KEY NOT NULL, at INTEGER NOT NULL, brand TEXT NOT NULL, variant TEXT, ml INTEGER NOT NULL, cost REAL);
    CREATE TABLE IF NOT EXISTS kv (key TEXT PRIMARY KEY NOT NULL, value TEXT NOT NULL);`);
  const migration = await db.getFirstAsync<{ version: number }>("SELECT version FROM schema_migrations WHERE version = 1");
  if (!migration) {
    await db.withTransactionAsync(async () => {
      await db.runAsync("INSERT OR REPLACE INTO kv (key, value) VALUES (?, ?)", "settings", encode(DEFAULT_SETTINGS));
      await db.runAsync("INSERT OR REPLACE INTO kv (key, value) VALUES (?, ?)", "weekGoals", "[]");
      await db.runAsync("INSERT INTO schema_migrations (version) VALUES (1)");
    });
  }
}

export async function loadData(): Promise<AppData> {
  await initializeDatabase(); const db = await getDb();
  const rows = await db.getAllAsync<DrinkEntry & { variant: string | null; cost: number | null }>("SELECT id, at, brand, variant, ml, cost FROM entries ORDER BY at DESC");
  const settingsRow = await db.getFirstAsync<{ value: string }>("SELECT value FROM kv WHERE key = 'settings'");
  const goalsRow = await db.getFirstAsync<{ value: string }>("SELECT value FROM kv WHERE key = 'weekGoals'");
  const entries: DrinkEntry[] = rows.map(({ variant, cost, ...entry }) => ({ ...entry, variant: variant ?? undefined, cost: cost ?? undefined }));
  return { entries, settings: { ...DEFAULT_SETTINGS, ...decode<Partial<Settings>>(settingsRow?.value, {}) }, weekGoals: decode<WeekGoalSnapshot[]>(goalsRow?.value, []) };
}

export async function saveEntry(entry: DrinkEntry): Promise<void> {
  const db = await getDb();
  await db.runAsync("INSERT INTO entries (id, at, brand, variant, ml, cost) VALUES (?, ?, ?, ?, ?, ?)", entry.id, entry.at, entry.brand, entry.variant ?? null, entry.ml, entry.cost ?? null);
}
export async function updateEntry(entry: DrinkEntry): Promise<void> {
  const db = await getDb();
  await db.runAsync("UPDATE entries SET at = ?, brand = ?, variant = ?, ml = ?, cost = ? WHERE id = ?", entry.at, entry.brand, entry.variant ?? null, entry.ml, entry.cost ?? null, entry.id);
}
export async function removeEntry(id: string): Promise<void> { const db = await getDb(); await db.runAsync("DELETE FROM entries WHERE id = ?", id); }
export async function saveSettings(settings: Settings): Promise<void> { const db = await getDb(); await db.runAsync("INSERT OR REPLACE INTO kv (key, value) VALUES (?, ?)", "settings", encode(settings)); }
export async function saveWeekGoals(goals: WeekGoalSnapshot[]): Promise<void> { const db = await getDb(); await db.runAsync("INSERT OR REPLACE INTO kv (key, value) VALUES (?, ?)", "weekGoals", encode(goals)); }
export async function replaceAll(data: AppData): Promise<void> {
  await initializeDatabase(); const db = await getDb();
  await db.withTransactionAsync(async () => {
    await db.runAsync("DELETE FROM entries");
    for (const entry of data.entries) await db.runAsync("INSERT INTO entries (id, at, brand, variant, ml, cost) VALUES (?, ?, ?, ?, ?, ?)", entry.id, entry.at, entry.brand, entry.variant ?? null, entry.ml, entry.cost ?? null);
    await db.runAsync("INSERT OR REPLACE INTO kv (key, value) VALUES (?, ?)", "settings", encode(data.settings));
    await db.runAsync("INSERT OR REPLACE INTO kv (key, value) VALUES (?, ?)", "weekGoals", encode(data.weekGoals));
  });
}
