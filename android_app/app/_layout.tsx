import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { OfflineBanner } from "../src/components/ui/offline-banner";
import "../global.css";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" translucent />
      <OfflineBanner />
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaProvider>
  );
}
