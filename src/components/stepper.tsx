import type { ReactNode } from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Stepper({
  value,
  onChange,
  min,
  max,
  step = 1,
  formatValue,
  label,
}: {
  value: number;
  onChange: (next: number) => void;
  min: number;
  max: number;
  step?: number;
  formatValue?: (value: number) => string;
  label?: string;
}) {
  const display = formatValue ? formatValue(value) : String(value);

  return (
    <div className="flex items-center justify-between gap-3">
      <Button
        type="button"
        variant="secondary"
        size="icon"
        className="size-11 rounded-full"
        aria-label="Diminuir"
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, roundStep(value - step, step)))}
      >
        <Minus />
      </Button>
      <div className="min-w-0 flex-1 text-center">
        <p className="text-2xl font-bold tabular-nums tracking-tight">{display}</p>
        {label ? (
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
        ) : null}
      </div>
      <Button
        type="button"
        variant="secondary"
        size="icon"
        className="size-11 rounded-full"
        aria-label="Aumentar"
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, roundStep(value + step, step)))}
      >
        <Plus />
      </Button>
    </div>
  );
}

export function StepperRow({
  title,
  hint,
  className,
  children,
}: {
  title: string;
  hint?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("rounded-3xl bg-card p-4 shadow-card", className)}>
      <div className="mb-4">
        <h3 className="text-sm font-semibold">{title}</h3>
        {hint ? <p className="mt-1 text-sm text-muted-foreground">{hint}</p> : null}
      </div>
      {children}
    </div>
  );
}

function roundStep(value: number, step: number) {
  const n = Math.round(value / step) * step;
  return Number(n.toFixed(2));
}
