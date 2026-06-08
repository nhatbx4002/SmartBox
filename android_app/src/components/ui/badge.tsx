import React from "react";
import { View, Text, StyleProp, ViewStyle } from "react-native";

interface BadgeProps {
  label: string;
  status?: "active" | "completed" | "expired" | "warning" | "info";
  className?: string;
  style?: StyleProp<ViewStyle>;
}

export default function Badge({
  label,
  status = "active",
  className,
  style,
}: BadgeProps) {
  let bgClass = "";
  let textClass = "";
  let customStyle: ViewStyle = {};

  switch (status) {
    case "active":
      customStyle = { backgroundColor: "rgba(0, 200, 83, 0.22)" };
      textClass = "text-[#00FF66]";
      break;
    case "completed":
      customStyle = { backgroundColor: "rgba(42, 42, 41, 0.50)" };
      textClass = "text-text-muted";
      break;
    case "expired":
      customStyle = { backgroundColor: "rgba(255, 61, 0, 0.20)" };
      textClass = "text-[#FF6E40]";
      break;
    case "warning":
      customStyle = { backgroundColor: "rgba(255, 152, 0, 0.20)" };
      textClass = "text-[#FFA726]";
      break;
    case "info":
      bgClass = "bg-info-bg";
      textClass = "text-info";
      break;
  }

  return (
    <View
      className={`px-two py-half rounded-badge items-center justify-center ${bgClass} ${className || ""}`}
      style={[
        {
          borderRadius: 6, // 6px per border radius specification
          alignSelf: "flex-start",
        },
        customStyle,
        style,
      ]}
    >
      <Text className={`text-small-bold font-sans ${textClass}`}>
        {label}
      </Text>
    </View>
  );
}
