import { ClipboardList, House, SlidersHorizontal, Target } from "lucide-react";
import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Onboarding, Splash } from "@/components/onboarding";
import { APP_NAME, APP_TAGLINE } from "@/lib/constants";
import { formatMl, sumMl, todayEntries } from "@/lib/stats";
import { useHasHydrated, useRefriStore } from "@/lib/store";
import { cn } from "@/lib/utils";
const TABS = [ { to: "/", label: "Início", icon: House }, { to: "/historico", label: "Histórico", icon: ClipboardList }, { to: "/metas", label: "Objetivos", icon: Target }, { to: "/ajustes", label: "Ajustes", icon: SlidersHorizontal } ] as const;
export function AppFrame() {
  const hydrated = useHasHydrated(); const onboarded = useRefriStore((s) => s.settings.onboarded);
  return <div className="min-h-dvh bg-background text-foreground antialiased"><div className="mx-auto flex min-h-dvh max-w-6xl justify-center lg:gap-10 lg:px-8">
    <BrandPanel /><div className="relative flex h-dvh w-full max-w-md flex-col overflow-hidden bg-background lg:border-x lg:border-border">
      {!hydrated ? <Splash /> : !onboarded ? <Onboarding /> : <><main className="flex-1 overflow-y-auto overscroll-contain"><Outlet /></main><TabBar /></>}
    </div></div></div>;
}
function BrandPanel() {
  const entries = useRefriStore((s) => s.entries);
  return <aside className="hidden min-w-0 flex-1 flex-col justify-center lg:flex"><div className="max-w-sm"><img src="/mascot.jpg" alt="Lata, o mascote do RefriLog" className="size-56 object-contain" /><p className="text-sm font-semibold uppercase tracking-widest text-primary">{APP_NAME}</p><h1 className="mt-2 text-4xl font-bold tracking-tight">{APP_TAGLINE}</h1><p className="mt-3 text-sm leading-relaxed text-muted-foreground">Registre marcas, porções e custos. Acompanhe seus hábitos sem cobrança e escolha se quer uma meta.</p><span className="mt-6 inline-block rounded-full bg-card px-3 py-1.5 text-xs font-semibold shadow-card">{formatMl(sumMl(todayEntries(entries)))} hoje</span></div></aside>;
}
function TabBar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return <nav className="shrink-0 border-t border-border bg-background/95 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-sm"><ul className="grid grid-cols-4 px-2">{TABS.map((tab) => { const active = pathname === tab.to; const Icon = tab.icon; return <li key={tab.to}><Link to={tab.to} className={cn("flex flex-col items-center gap-1 rounded-2xl py-2 text-xs font-semibold transition-colors duration-150", active ? "text-primary" : "text-muted-foreground")}><Icon className="size-5" strokeWidth={active ? 2.4 : 2} />{tab.label}</Link></li>; })}</ul></nav>;
}
