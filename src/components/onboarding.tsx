import { useState } from "react";
import { Button } from "@/components/ui/button";
import { APP_NAME, APP_TAGLINE } from "@/lib/constants";
import { useRefriStore } from "@/lib/store";
import type { Objective } from "@/lib/types";
import { cn } from "@/lib/utils";
export function Onboarding() {
  const complete = useRefriStore((s) => s.completeOnboarding);
  const [step, setStep] = useState(0);
  const [objective, setObjective] = useState<Objective>("track");
  const [goal, setGoal] = useState(2450);
  return <div className="flex h-full flex-col px-6 pb-8 pt-10">
    {step === 0 ? <div className="flex flex-1 flex-col items-center justify-center text-center">
      <img src="/mascot.jpg" alt="Lata, o mascote do RefriLog" className="anim-rise size-44 object-contain" />
      <p className="mt-3 text-sm font-semibold uppercase tracking-widest text-primary">{APP_NAME}</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">{APP_TAGLINE}</h1>
      <p className="mt-3 max-w-xs text-sm text-muted-foreground">Registre o que bebe, conheça seus hábitos e escolha o que fazer com eles. Sem cobranças.</p>
    </div> : <div className="flex-1">
      <p className="text-sm font-semibold text-primary">Seu ponto de partida</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">O que você quer fazer?</h1>
      <p className="mt-2 text-sm text-muted-foreground">Você pode mudar de ideia quando quiser.</p>
      <div className="mt-7 space-y-3">
        {([{ id: "track", title: "Só registrar", detail: "Um diário leve, com marcas, quantidades e um retrato dos seus hábitos." }, { id: "reduce", title: "Reduzir no meu ritmo", detail: "Defina uma meta semanal e acompanhe seu progresso sem culpa." }] as const).map((item) =>
          <button key={item.id} type="button" onClick={() => setObjective(item.id)} className={cn("w-full rounded-3xl bg-card p-5 text-left shadow-card", objective === item.id && "ring-2 ring-primary")}>
            <span className="block font-bold">{item.title}</span><span className="mt-1 block text-sm text-muted-foreground">{item.detail}</span>
          </button>)}
      </div>
      {objective === "reduce" && <label className="mt-6 block rounded-3xl bg-card p-5 text-sm font-semibold shadow-card">Minha meta semanal em ml
        <input type="number" min={100} max={30000} step={50} value={goal} onChange={(e) => setGoal(Number(e.target.value))} className="mt-3 h-12 w-full rounded-xl border border-border bg-background px-4 text-lg" />
        <span className="mt-2 block text-xs font-normal text-muted-foreground">Exemplo: 2.450 ml equivalem a 7 latas de 350 ml.</span>
      </label>}
    </div>}
    <Button size="lg" className="w-full" disabled={step === 1 && objective === "reduce" && (!Number.isFinite(goal) || goal < 100 || goal > 30000)} onClick={() => step === 0 ? setStep(1) : complete(objective, goal)}>{step === 0 ? "Começar" : "Entrar no app"}</Button>
  </div>;
}
export function Splash() { return <div className="flex h-full flex-col items-center justify-center"><img src="/mascot.jpg" alt="" className="size-36 object-contain" /><p className="font-bold">{APP_NAME}</p></div>; }
