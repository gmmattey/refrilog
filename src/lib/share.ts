import { formatMl, sumMl, weekEntries } from "./stats";
import type { DrinkEntry, Settings } from "./types";
export async function shareText(text: string): Promise<void> {
  if (navigator.share) { try { await navigator.share({ title: "Meu RefriLog", text }); } catch { /* share canceled */ } }
  else if (navigator.clipboard) { try { await navigator.clipboard.writeText(text); window.alert("Resumo copiado para compartilhar."); } catch { window.alert(text); } }
  else window.alert(text);
}

export async function shareSummary(entries: DrinkEntry[], settings: Settings): Promise<void> {
  const volume = formatMl(sumMl(weekEntries(entries)));
  const text = settings.objective === "reduce" ? `Meu resumo no RefriLog: ${volume} registrados nesta semana. Minha meta pessoal é ${formatMl(settings.weeklyGoalMl)}. No meu ritmo!` : `Meu resumo no RefriLog: ${volume} registrados nesta semana. Conhecendo meus hábitos, do meu jeito.`;
  await shareText(text);
}
