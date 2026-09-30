import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { createBackup, parseBackup } from "../domain/backup";
import { csv } from "../domain/stats";
import type { AppData } from "../domain/types";

const root = FileSystem.documentDirectory ?? FileSystem.cacheDirectory;
async function shareFile(name: string, content: string, mimeType: string): Promise<void> {
  if (!root) throw new Error("Não foi possível acessar o armazenamento de arquivos.");
  const uri = `${root}${name}`;
  await FileSystem.writeAsStringAsync(uri, content, { encoding: FileSystem.EncodingType.UTF8 });
  if (!await Sharing.isAvailableAsync()) throw new Error("O compartilhamento não está disponível neste aparelho.");
  await Sharing.shareAsync(uri, { mimeType, dialogTitle: "Compartilhar RefriLog", UTI: mimeType });
}
export async function exportCsv(data: AppData): Promise<void> { await shareFile(`refrilog-${Date.now()}.csv`, "\uFEFF" + csv(data.entries), "text/csv"); }
export async function exportBackup(data: AppData): Promise<void> { await shareFile(`refrilog-backup-${Date.now()}.json`, JSON.stringify(createBackup(data), null, 2), "application/json"); }
export async function chooseBackup(): Promise<AppData | null> {
  const result = await DocumentPicker.getDocumentAsync({ type: ["application/json", "text/json"], copyToCacheDirectory: true });
  if (result.canceled) return null;
  const raw = await FileSystem.readAsStringAsync(result.assets[0].uri, { encoding: FileSystem.EncodingType.UTF8 });
  return parseBackup(raw).data;
}
