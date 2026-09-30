import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Banknote, Plus, Share2, Sparkles } from "lucide-react";
import { DrinkForm } from "@/components/drink-form";
import { Button } from "@/components/ui/button";
import { formatBRL, formatLongDate, formatMl, sumCost, sumMl, todayEntries, weekDays, weekEntries } from "@/lib/stats";
import { useRefriStore } from "@/lib/store";
import { shareSummary } from "@/lib/share";
export const Route = createFileRoute("/")({ component: Home });
function Home() {
  const entries = useRefriStore((s) => s.entries); const settings = useRefriStore((s) => s.settings); const addEntry = useRefriStore((s) => s.addEntry);
  const [open, setOpen] = useState(false);
  const today = todayEntries(entries), week = weekEntries(entries), days = weekDays(entries);
  const todayMl = sumMl(today), weekMl = sumMl(week);
  const favorite = entries.find((entry) => entry.brand && entry.ml) ?? null;
  const withCost = week.filter((entry) => entry.cost !== undefined);
  const goal = settings.objective === "reduce" ? settings.weeklyGoalMl : null;
  return <div className="px-5 pb-7 pt-5">
    <header className="mb-5 flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-widest text-primary">RefriLog</p><h1 className="text-lg font-semibold tracking-tight">{formatLongDate(Date.now())}</h1></div><img src="/mascot.jpg" alt="Lata" className="size-14 object-contain" /></header>
    <section className="rounded-3xl bg-card p-6 text-center shadow-card"><p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Hoje você registrou</p><p className="mt-3 text-5xl font-extrabold tracking-tight tabular-nums">{formatMl(todayMl)}</p><p className="mt-3 text-sm text-muted-foreground">{today.length === 0 ? "Seu diário começa quando você quiser." : `${today.length} ${today.length === 1 ? "registro" : "registros"} hoje. Obrigado por anotar!`}</p></section>
    <Button size="lg" className="mt-4 h-14 w-full rounded-2xl text-base" onClick={() => setOpen(true)}><Plus className="mr-2 size-5" /> Registrar refri</Button>
    {favorite && <p className="mt-2 text-center text-xs text-muted-foreground">Seu último: {favorite.brand}{favorite.variant ? ` · ${favorite.variant}` : ""}</p>}
    {goal && <section className="mt-5 rounded-3xl bg-card p-5 shadow-card"><div className="flex justify-between"><div><p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Minha meta da semana</p><p className="mt-1 text-xl font-bold">{formatMl(weekMl)} <span className="text-sm text-muted-foreground">/ {formatMl(goal)}</span></p></div><Sparkles className="size-5 text-primary" /></div><div className="mt-4 h-2 overflow-hidden rounded-full bg-track"><div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(100, weekMl / goal * 100)}%` }} /></div><p className="mt-2 text-xs text-muted-foreground">{weekMl <= goal ? "Você está acompanhando seu plano. Continue registrando do seu jeito." : "Sua semana passou da referência escolhida. Você pode rever a meta quando quiser."}</p></section>}
    <section className="mt-5 rounded-3xl bg-card p-5 shadow-card"><div className="flex justify-between"><h2 className="text-sm font-semibold">Sua semana</h2><span className="text-sm font-bold text-primary">{formatMl(weekMl)}</span></div><div className="mt-4 grid grid-cols-7 gap-1">{days.map((day) => <div key={day.key} className="text-center"><div className="mx-auto flex h-12 w-9 items-end justify-center rounded-xl bg-secondary pb-1"><div className={`w-5 rounded-lg ${day.isToday ? "bg-primary" : "bg-primary/45"}`} style={{ height: `${day.ml ? Math.max(6, Math.min(36, day.ml / 2000 * 36)) : 4}px` }} /></div><p className="mt-2 text-[11px] font-medium capitalize text-muted-foreground">{day.label}</p></div>)}</div><p className="mt-3 text-xs text-muted-foreground">Sem registro significa apenas que você não anotou.</p></section>
    <div className="mt-3 grid grid-cols-2 gap-3"><article className="rounded-3xl bg-card p-4 shadow-card"><Banknote className="size-5 text-primary" /><p className="mt-3 text-xl font-bold">{formatBRL(sumCost(week))}</p><p className="mt-1 text-xs text-muted-foreground">Custos informados na semana · {withCost.length} de {week.length} registros</p></article><article className="rounded-3xl bg-card p-4 shadow-card"><Sparkles className="size-5 text-primary" /><p className="mt-3 text-xl font-bold">{new Set(week.map((e) => e.brand).filter(Boolean)).size}</p><p className="mt-1 text-xs text-muted-foreground">Marcas registradas nesta semana</p></article></div>
    <button type="button" className="mt-4 flex w-full items-center justify-center gap-2 py-3 text-sm font-semibold text-primary" onClick={() => void shareSummary(entries, settings)}><Share2 className="size-4" /> Compartilhar meu resumo</button>
    <DrinkForm open={open} onClose={() => setOpen(false)} onSave={addEntry} favorite={favorite} />
  </div>;
}
