import { addDays, endOfDay, format, startOfDay, startOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { DrinkEntry, DrinkSize, HistoryFilter } from "./types";

const LEGACY_ML: Record<DrinkSize, number> = { can: 350, bottle: 600, twoLiter: 2000 };
export const mlOf = (entry: DrinkEntry): number => entry.ml ?? (entry.size ? LEGACY_ML[entry.size] : 0);
export const sumMl = (entries: DrinkEntry[]): number => entries.reduce((n, entry) => n + mlOf(entry), 0);
export const sumCost = (entries: DrinkEntry[]): number => entries.reduce((n, entry) => n + (entry.cost ?? 0), 0);
export const formatMl = (ml: number): string => ml >= 1000 ? `${(ml / 1000).toLocaleString("pt-BR", { maximumFractionDigits: 2 })} L` : `${ml.toLocaleString("pt-BR")} ml`;
export const formatBRL = (n: number): string => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
export const dayKey = (ts: number): string => format(new Date(ts), "yyyy-MM-dd");
export const formatLongDate = (ts: number | Date): string => format(new Date(ts), "d 'de' MMMM", { locale: ptBR });
export const formatDayHeading = (ts: number): string => { const text = format(new Date(ts), "EEEE, d 'de' MMM", { locale: ptBR }); return text[0].toUpperCase() + text.slice(1); };
export const formatTime = (ts: number): string => format(new Date(ts), "HH:mm");
export const startOfAppWeek = (now = new Date()): Date => startOfWeek(now, { weekStartsOn: 0 });
export function entriesInRange(entries: DrinkEntry[], start: Date, end: Date): DrinkEntry[] { return entries.filter((entry) => entry.at >= start.getTime() && entry.at <= end.getTime()); }
export const todayEntries = (entries: DrinkEntry[], now = new Date()) => entriesInRange(entries, startOfDay(now), endOfDay(now));
export const weekEntries = (entries: DrinkEntry[], now = new Date()) => entriesInRange(entries, startOfAppWeek(now), endOfDay(addDays(startOfAppWeek(now), 6)));
export interface WeekDay { key: string; date: Date; label: string; ml: number; isToday: boolean; }
export function weekDays(entries: DrinkEntry[], now = new Date()): WeekDay[] {
  const start = startOfAppWeek(now);
  return Array.from({ length: 7 }, (_, i) => {
    const date = addDays(start, i); const key = dayKey(date.getTime());
    return { key, date, label: ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"][date.getDay()], ml: sumMl(entries.filter((entry) => dayKey(entry.at) === key)), isToday: key === dayKey(now.getTime()) };
  });
}
export function filterEntries(entries: DrinkEntry[], filter: HistoryFilter, now = new Date()): DrinkEntry[] {
  const selected = filter === "today" ? todayEntries(entries, now) : filter === "week" ? weekEntries(entries, now) : entries;
  return [...selected].sort((a, b) => b.at - a.at);
}
export interface DayGroup { key: string; heading: string; total: number; entries: DrinkEntry[]; }
export function groupByDay(entries: DrinkEntry[]): DayGroup[] {
  const groups = new Map<string, DrinkEntry[]>();
  for (const entry of entries) groups.set(dayKey(entry.at), [...(groups.get(dayKey(entry.at)) ?? []), entry]);
  return [...groups.entries()].sort((a, b) => b[0].localeCompare(a[0])).map(([key, list]) => ({ key, heading: formatDayHeading(list[0].at), total: sumMl(list), entries: [...list].sort((a, b) => b.at - a.at) }));
}
function csvCell(value: string | number): string { return `"${String(value).replaceAll('"', '""')}"`; }
export function entriesToCsv(entries: DrinkEntry[]): string {
  const lines = ["data;hora;marca;versao;ml;custo_reais"];
  for (const entry of [...entries].sort((a, b) => a.at - b.at)) {
    lines.push([format(new Date(entry.at), "yyyy-MM-dd"), formatTime(entry.at), entry.brand ?? "Não informado", entry.variant ?? "", mlOf(entry), entry.cost === undefined ? "" : entry.cost.toFixed(2).replace(".", ",")].map(csvCell).join(";"));
  }
  return lines.join("\r\n");
}
export function downloadCsv(csv: string): void {
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob); const anchor = document.createElement("a");
  anchor.href = url; anchor.download = `refrilog-${format(new Date(), "yyyy-MM-dd")}.csv`; anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
