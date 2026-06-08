import React from "react";
import {
  Text,
  Pressable,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
  TextStyle,
  AccessibilityInfo,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

interface ButtonProps {
  title: string;
  onPress?: () => void;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export default function Button({
  title,
  onPress,
  variant = "primary",
  loading = false,
  disabled = false,
  className,
  style,
  textStyle,
}: ButtonProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const [reduceMotion, setReduceMotion] = React.useState(false);

  React.useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      setReduceMotion(enabled);
    });
  }, []);

  const isInteractionDisabled = disabled || loading;

  const pressSpringConfig = {
    damping: 15,
    stiffness: 120,
    mass: 1,
  };

  const handlePressIn = () => {
    if (isInteractionDisabled) return;
    if (reduceMotion) {
      scale.value = 0.97;
      opacity.value = 0.8;
    } else {
      scale.value = withSpring(0.97, pressSpringConfig);
      opacity.value = withSpring(0.8, pressSpringConfig);
    }
  };

  const handlePressOut = () => {
    if (isInteractionDisabled) return;
    if (reduceMotion) {
      scale.value = 1;
      opacity.value = 1;
    } else {
      scale.value = withSpring(1, pressSpringConfig);
      opacity.value = withSpring(1, pressSpringConfig);
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  // Base styles depending on state and variant
  let buttonBg = "bg-brand";
  let buttonBorder = "";
  let buttonShadow = "shadow-brand-glow";
  let textColor = "text-white";

  if (variant === "primary") {
    if (isInteractionDisabled) {
      buttonBg = "";
      buttonShadow = "";
    } else {
      buttonBg = "bg-brand active:bg-[#E65C00]";
      buttonShadow = "shadow-brand-glow";
    }
  } else if (variant === "secondary") {
    buttonBg = "bg-surface-glass";
    buttonBorder = "border border-border";
    buttonShadow = "";
    textColor = "text-text";
    if (isInteractionDisabled) {
      buttonBg = "bg-surface-glass/40";
    }
  } else if (variant === "danger") {
    buttonBg = "bg-error-bg";
    buttonBorder = "border border-error";
    buttonShadow = "";
    textColor = "text-error";
    if (isInteractionDisabled) {
      buttonBg = "bg-error-bg/40";
    }
  } else if (variant === "ghost") {
    buttonBg = "bg-transparent";
    buttonBorder = "";
    buttonShadow = "";
    textColor = "text-brand";
  }

  // Handle styles for primary disabled
  const primaryDisabledStyle: ViewStyle = variant === "primary" && isInteractionDisabled ? {
    backgroundColor: "rgba(255, 102, 0, 0.35)",
  } : {};

  return (
    <Pressable
      onPress={isInteractionDisabled ? undefined : onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isInteractionDisabled}
      style={style}
      className={`w-full ${className || ""}`}
    >
      <Animated.View
        style={[
          animatedStyle,
          primaryDisabledStyle,
          variant === "primary" && !isInteractionDisabled ? {
            shadowColor: "#FF6600",
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          } : {},
        ]}
        className={`h-12 items-center justify-center rounded-button px-four flex-row ${buttonBg} ${buttonBorder} ${buttonShadow}`}
      >
        {loading ? (
          <ActivityIndicator color={variant === "primary" ? "#FFFFFF" : "#FF6600"} size="small" />
        ) : (
          <Text className={`text-btn font-sans font-semibold text-center ${textColor}`} style={textStyle}>
            {title}
          </Text>
        )}
      </Animated.View>
    </Pressable>
  );
}
