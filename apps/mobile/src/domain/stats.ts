import type { DrinkEntry } from "./types";

const DAY = 86_400_000;
export const sumMl = (entries: DrinkEntry[]) => entries.reduce((total, entry) => total + entry.ml, 0);
export const sumCost = (entries: DrinkEntry[]) => entries.reduce((total, entry) => total + (entry.cost ?? 0), 0);
export const entriesWithCost = (entries: DrinkEntry[]) => entries.filter((entry) => entry.cost !== undefined);
export const formatMl = (ml: number) => ml >= 1000 ? `${(ml / 1000).toLocaleString("pt-BR", { maximumFractionDigits: 2 })} L` : `${ml.toLocaleString("pt-BR")} ml`;
export const formatBRL = (amount: number) => amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
export function dayKey(at: number | Date): string {
  const date = new Date(at);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
export function startOfDay(date = new Date()): Date { return new Date(date.getFullYear(), date.getMonth(), date.getDate()); }
export function startOfWeek(date = new Date()): Date {
  const day = startOfDay(date); day.setDate(day.getDate() - day.getDay()); return day;
}
export const weekKey = (date = new Date()) => dayKey(startOfWeek(date));
export function entriesInWeek(entries: DrinkEntry[], date = new Date()): DrinkEntry[] {
  const start = startOfWeek(date).getTime(); return entries.filter((entry) => entry.at >= start && entry.at < start + 7 * DAY);
}
export function entriesToday(entries: DrinkEntry[], date = new Date()): DrinkEntry[] {
  const start = startOfDay(date).getTime(); return entries.filter((entry) => entry.at >= start && entry.at < start + DAY);
}
export function csv(entries: DrinkEntry[]): string {
  const escape = (value: string | number) => `"${String(value).replaceAll('"', '""')}"`;
  const header = "data;hora;marca;versao;ml;custo_reais";
  const rows = [...entries].sort((a, b) => a.at - b.at).map((entry) => {
    const date = new Date(entry.at);
    const dateText = dayKey(date);
    const time = `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
    return [dateText, time, entry.brand, entry.variant ?? "", entry.ml, entry.cost === undefined ? "" : entry.cost.toFixed(2).replace(".", ",")].map(escape).join(";");
  });
  return [header, ...rows].join("\r\n");
}
