import assert from "node:assert/strict";
import test from "node:test";
import { createBackup, parseBackup } from "./backup.ts";
import { DEFAULT_SETTINGS, type AppData } from "./types.ts";
const data: AppData = { entries: [{ id: "x", at: 1, brand: "Fanta", ml: 350, cost: 3.75 }], settings: { ...DEFAULT_SETTINGS, onboarded: true, onboardedAt: 1 }, weekGoals: [] };
test("backup versionado preserva os dados", () => { const backup = parseBackup(JSON.stringify(createBackup(data))); assert.deepEqual(backup.data, data); });
test("backup inválido é rejeitado antes de atingir persistência", () => { assert.throws(() => parseBackup('{"format":"refrilog-backup","version":1,"data":{"entries":[]}}'), /compatível/); assert.throws(() => parseBackup("não-json"), /JSON válido/); });
