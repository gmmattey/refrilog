import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { DrinkForm } from "@/components/drink-form";
import { EmptyState } from "@/components/empty-state";
import { filterEntries, formatBRL, formatMl, formatTime, groupByDay, mlOf } from "@/lib/stats";
import { useRefriStore } from "@/lib/store";
import type { DrinkEntry, HistoryFilter } from "@/lib/types";
import { cn } from "@/lib/utils";
export const Route = createFileRoute("/historico")({ component: HistoryPage });
const FILTERS: { id: HistoryFilter; label: string }[] = [{ id: "today", label: "Hoje" }, { id: "week", label: "Semana" }, { id: "all", label: "Tudo" }];
function HistoryPage() {
  const entries = useRefriStore((s) => s.entries); const update = useRefriStore((s) => s.updateEntry); const remove = useRefriStore((s) => s.deleteEntry);
  const [filter, setFilter] = useState<HistoryFilter>("week"); const [editing, setEditing] = useState<DrinkEntry | null>(null);
  const groups = groupByDay(filterEntries(entries, filter));
  return <div className="px-5 pb-6 pt-5"><header className="mb-4"><h1 className="text-2xl font-bold tracking-tight">Histórico</h1><p className="mt-1 text-sm text-muted-foreground">Toque num registro para editar ou apagar.</p></header>
    <div className="grid grid-cols-3 rounded-full bg-secondary p-1">{FILTERS.map((item) => <button key={item.id} type="button" onClick={() => setFilter(item.id)} className={cn("h-9 rounded-full text-sm font-semibold", filter === item.id ? "bg-card text-foreground shadow-card" : "text-muted-foreground")}>{item.label}</button>)}</div>
    {!groups.length ? <EmptyState title="Nada por aqui" body="Quando você registrar uma bebida, ela aparece aqui." /> : <div className="mt-5 space-y-6">{groups.map((group) => <section key={group.key}><div className="mb-2 flex items-baseline justify-between"><h2 className="text-sm font-semibold">{group.heading}</h2><p className="text-xs font-medium text-muted-foreground">{formatMl(group.total)}</p></div><ul className="overflow-hidden rounded-3xl bg-card shadow-card">{group.entries.map((entry, i) => <li key={entry.id}>{i > 0 && <div className="mx-4 h-px bg-border" />}<button type="button" onClick={() => setEditing(entry)} className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-secondary/60"><span className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-xl">🥤</span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold">{entry.brand ?? "Refri sem marca"}{entry.variant ? ` · ${entry.variant}` : ""}</span><span className="block text-xs text-muted-foreground">{formatTime(entry.at)} · {formatMl(mlOf(entry))}{entry.cost === undefined ? "" : ` · ${formatBRL(entry.cost)}`}</span></span></button></li>)}</ul></section>)}</div>}
    <DrinkForm open={Boolean(editing)} entry={editing} onClose={() => setEditing(null)} onSave={(value) => editing && update(editing.id, value)} onDelete={() => { if (editing) remove(editing.id); setEditing(null); }} />
  </div>;
}
