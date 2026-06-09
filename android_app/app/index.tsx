import React, { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import OmniBoxVerticalLogo from "../assets/Logos/omnibox-vertical-logo.svg";
import { useAuthStore } from "../src/store/authStore";

export default function Index() {
  const router = useRouter();
  const loadFromStorage = useAuthStore((state) => state.loadFromStorage);

  useEffect(() => {
    let mounted = true;

    const bootstrap = async () => {
      const isAuthenticated = await loadFromStorage();
      if (!mounted) return;
      router.replace(isAuthenticated ? "/home" : "/login");
    };

    bootstrap();

    return () => {
      mounted = false;
    };
  }, [loadFromStorage, router]);

  return (
    <View className="flex-1 items-center justify-center bg-background px-four">
      <View className="items-center justify-center px-four py-five bg-surface rounded-panel border border-border shadow-brand-glow-strong">
        <OmniBoxVerticalLogo width={124} height={124} />
      </View>
      <ActivityIndicator className="mt-four" color="#FF6600" />
    </View>
  );
}
