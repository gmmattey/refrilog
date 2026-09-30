import { useEffect, useState } from "react";
import { BRANDS, PORTIONS } from "@/lib/constants";
import { mlOf } from "@/lib/stats";
import type { DrinkEntry } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
export type DrinkInput = Pick<DrinkEntry, "brand" | "variant" | "ml" | "cost">;
export function DrinkForm({ open, onClose, onSave, entry, onDelete, favorite }: {
  open: boolean; onClose: () => void; onSave: (value: DrinkInput) => void;
  entry?: DrinkEntry | null; onDelete?: () => void; favorite?: DrinkEntry | null;
}) {
  const [brand, setBrand] = useState("");
  const [customBrand, setCustomBrand] = useState("");
  const [variant, setVariant] = useState("");
  const [ml, setMl] = useState("350");
  const [cost, setCost] = useState("");
  useEffect(() => {
    if (!open) return;
    const source = entry ?? favorite;
    const name = source?.brand ?? "";
    setBrand(!name ? "" : BRANDS.includes(name) ? name : "Outra marca");
    setCustomBrand(!name || BRANDS.includes(name) ? "" : name);
    setVariant(source?.variant ?? "");
    setMl(String(source ? mlOf(source) : 350));
    setCost(source?.cost === undefined ? "" : String(source.cost).replace(".", ","));
  }, [open, entry, favorite]);
  const volume = Number(ml);
  const parsedCost = cost.trim() === "" ? undefined : Number(cost.replace(",", "."));
  const valid = ((brand !== "" && (brand !== "Outra marca" || customBrand.trim().length > 0))) && Number.isInteger(volume) && volume >= 1 && volume <= 10000 && (parsedCost === undefined || (Number.isFinite(parsedCost) && parsedCost >= 0 && parsedCost <= 10000));
  const field = "mt-1 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary";
  return <Dialog open={open} onOpenChange={(next) => !next && onClose()}><DialogContent className="max-h-[90dvh] overflow-y-auto">
    <DialogHeader><DialogTitle>{entry ? "Editar registro" : "Registrar refri"}</DialogTitle><DialogDescription>Conte o que você bebeu, do seu jeito.</DialogDescription></DialogHeader>
    <div className="grid gap-4 py-2">
      <label className="text-sm font-semibold">Marca
        <select className={field} value={brand} onChange={(e) => setBrand(e.target.value)}><option value="">Selecione a marca</option>{BRANDS.map((name) => <option key={name}>{name}</option>)}</select>
      </label>
      {brand === "Outra marca" && <label className="text-sm font-semibold">Nome da marca<input className={field} maxLength={60} value={customBrand} onChange={(e) => setCustomBrand(e.target.value)} placeholder="Qual marca?" /></label>}
      <label className="text-sm font-semibold">Versão <span className="font-normal text-muted-foreground">(opcional)</span><input className={field} maxLength={60} value={variant} onChange={(e) => setVariant(e.target.value)} placeholder="Original, Zero, sabor..." /></label>
      <label className="text-sm font-semibold">Quanto você bebeu?
        <select className={field} value={PORTIONS.some((item) => item.ml === volume) ? ml : "custom"} onChange={(e) => e.target.value !== "custom" && setMl(e.target.value)}>{PORTIONS.map((item) => <option key={item.ml} value={item.ml}>{item.label}</option>)}<option value="custom">Outra quantidade</option></select>
        <input className={field} type="number" inputMode="numeric" min={1} max={10000} step={1} value={ml} onChange={(e) => setMl(e.target.value)} aria-label="Quantidade consumida em ml" /><span className="mt-1 block text-xs font-normal text-muted-foreground">Em ml. Pode ser só um copo, mesmo se a embalagem for maior.</span>
      </label>
      <label className="text-sm font-semibold">Quanto custou? <span className="font-normal text-muted-foreground">(opcional)</span><input className={field} type="text" inputMode="decimal" value={cost} onChange={(e) => setCost(e.target.value)} placeholder="R$ 0,00" /></label>
    </div>
    <DialogFooter>{entry && onDelete && <Button variant="destructive" onClick={onDelete}>Apagar</Button>}<Button disabled={!valid} onClick={() => { onSave({ brand: brand === "Outra marca" ? customBrand.trim() : brand, variant: variant.trim() || undefined, ml: volume, cost: parsedCost }); onClose(); }}>{entry ? "Salvar" : "Registrar"}</Button></DialogFooter>
  </DialogContent></Dialog>;
}
