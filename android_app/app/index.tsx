import React, { useEffect } from "react";
import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      // Navigate directly to Home screen for previewing/testing
      router.replace("/home");
    }, 1800); // 1.8 seconds per design specification
    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-background">
      <View className="items-center justify-center p-three bg-surface rounded-avatar border border-border shadow-brand-glow-strong">
        {/* Glowing Cube Icon */}
        <Ionicons 
          name="cube" 
          size={48} 
          color="#FF6600" 
          style={{ textShadowColor: "rgba(255, 102, 0, 0.4)", textShadowRadius: 8, textShadowOffset: { width: 0, height: 0 } }} 
        />
      </View>
      <Text className="text-h1 text-white mt-four font-sans">SmartBox</Text>
      
      {/* Sequentially pulsing dots simulation */}
      <View className="flex-row mt-three gap-two">
        <View className="w-2.5 h-2.5 rounded-full bg-brand opacity-90" />
        <View className="w-2.5 h-2.5 rounded-full bg-brand opacity-60" />
        <View className="w-2.5 h-2.5 rounded-full bg-brand opacity-30" />
      </View>
    </View>
  );
}
