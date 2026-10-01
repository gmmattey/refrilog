import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppDataProvider } from "../src/data/AppDataContext";

export default function Layout() { return <SafeAreaProvider><AppDataProvider><StatusBar style="dark" /><Stack screenOptions={{ headerShown: false, animation: "fade" }} /></AppDataProvider></SafeAreaProvider>; }
