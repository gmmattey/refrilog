import { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Redirect } from "expo-router";
import { useAppData } from "../src/data/AppDataContext";
import type { Objective } from "../src/domain/types";
import { Button, Choice, Field, Mascot, Screen, Title } from "../src/ui/components";
import { colors } from "../src/ui/theme";

export default function Start() {
  const { data, ready, error, completeOnboarding } = useAppData(); const [step, setStep] = useState(0); const [objective, setObjective] = useState<Objective>("track"); const [goal, setGoal] = useState("2450");
  if (!ready) return <View style={styles.loading}><ActivityIndicator size="large" color={colors.blue} /><Text style={styles.loadingText}>Abrindo seu diário...</Text></View>;
  if (error) return <Screen><Title>Seus dados precisam de atenção</Title><Text style={styles.loadingText}>{error}</Text></Screen>;
  if (data.settings.onboarded) return <Redirect href="/(tabs)" />;
  const finish = () => { const amount = Number(goal); if (objective === "reduce" && (!Number.isInteger(amount) || amount < 100 || amount > 30000)) return; void completeOnboarding(objective, amount); };
  return <Screen>{step === 0 ? <View style={styles.hero}><Mascot /><Text style={styles.eyebrow}>REFRILOG</Text><Title>Seu refri, do seu jeito.</Title><Text style={styles.copy}>Registre o que bebe, conheça seus hábitos e escolha o que fazer com eles. Sem cobranças.</Text><Button onPress={() => setStep(1)}>Começar</Button></View> : <><Text style={styles.eyebrow}>SEU PONTO DE PARTIDA</Text><Title>O que você quer fazer?</Title><Text style={styles.copy}>Você pode mudar de ideia quando quiser.</Text><Choice active={objective === "track"} onPress={() => setObjective("track")} title="Só registrar" detail="Um diário leve, com marcas, quantidades e um retrato dos seus hábitos." /><Choice active={objective === "reduce"} onPress={() => setObjective("reduce")} title="Reduzir no meu ritmo" detail="Defina uma meta semanal e acompanhe seu progresso sem culpa." />{objective === "reduce" ? <Field label="Minha meta semanal em ml" keyboardType="number-pad" value={goal} onChangeText={setGoal} help="Exemplo: 2.450 ml são 7 latas de 350 ml." /> : null}<Button onPress={finish}>Entrar no app</Button></>}</Screen>;
}
const styles = StyleSheet.create({ loading: { flex: 1, justifyContent: "center", alignItems: "center", gap: 12, backgroundColor: colors.background }, loadingText: { color: colors.muted, fontSize: 15, textAlign: "center" }, hero: { flex: 1, justifyContent: "center", gap: 15 }, eyebrow: { color: colors.blueDark, fontSize: 12, fontWeight: "800", letterSpacing: 1.4 }, copy: { color: colors.muted, fontSize: 15, lineHeight: 22 } });
