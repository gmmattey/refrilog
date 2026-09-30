import assert from "node:assert/strict";
import test from "node:test";
import { csv, entriesInWeek, entriesToday, sumCost, sumMl } from "./stats.ts";
import type { DrinkEntry } from "./types.ts";
const entries: DrinkEntry[] = [{ id: "a", at: new Date(2026, 8, 26, 23, 59).getTime(), brand: "Coca-Cola", ml: 350, cost: 4.5 }, { id: "b", at: new Date(2026, 8, 27, 0, 1).getTime(), brand: "Marca; com \"aspas\"", variant: "Zero", ml: 200 }];
test("soma volume e apenas custos informados", () => { assert.equal(sumMl(entries), 550); assert.equal(sumCost(entries), 4.5); });
test("dia e semana seguem a data local", () => { const sunday = new Date(2026, 8, 27, 12); assert.equal(entriesToday(entries, sunday).length, 1); assert.equal(entriesInWeek(entries, sunday).length, 1); });
test("CSV escapa separadores, aspas e usa decimal local", () => { const output = csv(entries); assert.match(output, /"Marca; com ""aspas"""/); assert.match(output, /"4,50"/); assert.match(output, /\r\n/); });
