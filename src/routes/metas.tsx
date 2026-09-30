import { subDays } from "date-fns";
import { createFileRoute } from "@tanstack/react-router";
import { Award, BookOpen, Share2, Sparkles } from "lucide-react";
import { dayKey, formatMl, startOfAppWeek, sumMl, weekEntries } from "@/lib/stats";
import { shareText } from "@/lib/share";
import { useRefriStore } from "@/lib/store";
import type { Objective } from "@/lib/types";
import { cn } from "@/lib/utils";
export const Route = createFileRoute("/metas")({ component: GoalsPage });
function GoalsPage() {
  const entries = useRefriStore((s) => s.entries); const settings = useRefriStore((s) => s.settings); const setSettings = useRefriStore((s) => s.setSettings);
  const weekMl = sumMl(weekEntries(entries));
  const reduce = settings.objective === "reduce";
  const weekEnded = Date.now() - settings.onboardedAt >= 7 * 86400000;
  const lastWeekStart = subDays(startOfAppWeek(), 7);
  const lastWeekKey = dayKey(lastWeekStart.getTime());
  const lastWeekEntries = weekEntries(entries, lastWeekStart);
  const lastWeekMl = sumMl(lastWeekEntries);
  const canReview = settings.onboardedAt < lastWeekStart.getTime() + 7 * 86400000;
  const confirmed = settings.confirmedWeeks.includes(lastWeekKey);
  const medals = [
    { title: "Meu começo", detail: "Escolheu conhecer seus hábitos", unlocked: entries.length > 0 },
    { title: "Primeiro panorama", detail: "Sete dias desde o começo", unlocked: weekEnded },
    ...(reduce ? [{ title: "No meu ritmo", detail: "Definiu uma meta pessoal", unlocked: settings.weeklyGoalMl > 0 }, { title: "Semana na meta", detail: "Conferiu uma semana encerrada dentro da meta", unlocked: settings.achievedWeeks.length > 0 }] : []),
  ];
  return <div className="px-5 pb-7 pt-5"><header className="mb-5"><h1 className="text-2xl font-bold tracking-tight">Meu objetivo</h1><p className="mt-1 text-sm text-muted-foreground">Seu jeito de usar o RefriLog pode mudar a qualquer momento.</p></header>
    <section className="rounded-3xl bg-card p-5 shadow-card"><p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Eu quero</p><div className="mt-4 grid grid-cols-2 gap-2">{([{ id: "track", label: "Só registrar", icon: BookOpen }, { id: "reduce", label: "Reduzir", icon: Sparkles }] as const).map((item) => <button key={item.id} type="button" onClick={() => setSettings({ objective: item.id as Objective })} className={cn("flex min-h-24 flex-col items-center justify-center gap-2 rounded-2xl bg-secondary px-2 text-sm font-semibold", settings.objective === item.id && "bg-primary/10 ring-2 ring-primary")}><item.icon className="size-5" />{item.label}</button>)}</div><p className="mt-3 text-xs text-muted-foreground">Seus registros continuam aqui quando você troca de objetivo.</p></section>
    {reduce ? <section className="mt-4 rounded-3xl bg-card p-5 shadow-card"><h2 className="font-semibold">Meta semanal</h2><p className="mt-1 text-sm text-muted-foreground">Uma referência escolhida por você, não uma obrigação.</p><label className="mt-4 block text-sm font-semibold">Limite que quero acompanhar, em ml<input type="number" inputMode="numeric" min={100} max={30000} step={50} value={settings.weeklyGoalMl} onChange={(e) => { const n = Number(e.target.value); if (Number.isFinite(n) && n >= 100 && n <= 30000) setSettings({ weeklyGoalMl: n }); }} className="mt-2 h-12 w-full rounded-xl border border-border bg-background px-4 text-lg" /></label><div className="mt-5 flex justify-between text-sm"><span>Esta semana</span><strong>{formatMl(weekMl)} / {formatMl(settings.weeklyGoalMl)}</strong></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-track"><div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(100, weekMl / settings.weeklyGoalMl * 100)}%` }} /></div><p className="mt-3 text-xs text-muted-foreground">Um dia sem anotação não conta como dia sem consumo.</p>{canReview && <div className="mt-5 rounded-2xl bg-secondary p-4"><p className="text-sm font-bold">Semana passada: {formatMl(lastWeekMl)}</p><p className="mt-1 text-xs text-muted-foreground">Confira se registrou tudo antes de avaliar a meta.</p><button type="button" disabled={confirmed} className="mt-3 rounded-xl bg-card px-4 py-2 text-sm font-semibold text-primary disabled:text-muted-foreground" onClick={() => setSettings({ confirmedWeeks: [...settings.confirmedWeeks, lastWeekKey], achievedWeeks: lastWeekMl <= settings.weeklyGoalMl ? [...settings.achievedWeeks, lastWeekKey] : settings.achievedWeeks })}>{confirmed ? "Semana conferida" : "Conferi meus registros"}</button></div>}</section> : <section className="mt-4 rounded-3xl bg-card p-5 shadow-card"><BookOpen className="size-6 text-primary" /><h2 className="mt-3 font-semibold">Só observar já é um objetivo</h2><p className="mt-1 text-sm text-muted-foreground">Veja seus padrões e marcas favoritas. Aqui não há teto ou contagem de dias sem refri.</p></section>}
    <section className="mt-5"><div className="mb-3 flex items-center gap-2"><Award className="size-5 text-primary" /><h2 className="font-semibold">Conquistas</h2></div><div className="space-y-3">{medals.map((medal) => <div key={medal.title} className={cn("flex items-center gap-3 rounded-3xl bg-card p-4 shadow-card", !medal.unlocked && "opacity-50")}><span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-2xl">{medal.unlocked ? "🏅" : "☆"}</span><div><p className="text-sm font-bold">{medal.title}</p><p className="text-xs text-muted-foreground">{medal.detail}</p></div>{medal.unlocked && <button type="button" aria-label={`Compartilhar ${medal.title}`} className="ml-auto rounded-xl p-2 text-primary" onClick={() => void shareText(`Conquistei a medalha ${medal.title} no RefriLog. Acompanhando meus hábitos do meu jeito!`)}><Share2 className="size-4" /></button>}</div>)}</div><p className="mt-3 text-xs text-muted-foreground">Conquistas celebram sua escolha de acompanhar, nunca a quantidade bebida.</p></section>
  </div>;
}
