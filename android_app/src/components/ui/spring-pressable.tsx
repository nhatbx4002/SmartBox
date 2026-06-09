import React from "react";
import { Pressable, StyleProp, ViewStyle, AccessibilityInfo } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

interface SpringPressableProps {
  children: React.ReactNode;
  onPress?: () => void;
  scaleTo?: number;
  glowOnPress?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  className?: string;
}

export default function SpringPressable({
  children,
  onPress,
  scaleTo = 0.98,
  glowOnPress = false,
  disabled = false,
  style,
  className,
}: SpringPressableProps) {
  const scale = useSharedValue(1);
  const glow = useSharedValue(0);
  const [reduceMotion, setReduceMotion] = React.useState(false);

  React.useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      setReduceMotion(enabled);
    });
  }, []);

  const pressSpringConfig = {
    damping: 15,
    stiffness: 120,
    mass: 1,
  };

  const handlePressIn = () => {
    if (disabled) return;
    if (reduceMotion) {
      scale.value = scaleTo;
      glow.value = 1;
    } else {
      scale.value = withSpring(scaleTo, pressSpringConfig);
      glow.value = withSpring(1, pressSpringConfig);
    }
  };

  const handlePressOut = () => {
    if (disabled) return;
    if (reduceMotion) {
      scale.value = 1;
      glow.value = 0;
    } else {
      scale.value = withSpring(1, pressSpringConfig);
      glow.value = withSpring(0, pressSpringConfig);
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    const styles: ViewStyle = {
      transform: [{ scale: scale.value }],
    };

    if (glowOnPress) {
      styles.shadowColor = "#FF6600";
      styles.shadowOffset = { width: 0, height: 0 };
      styles.shadowOpacity = glow.value * 0.35;
      styles.shadowRadius = glow.value * 12;
      styles.elevation = glow.value * 12;
    }

    return styles;
  });

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={style}
      className={className}
    >
      <Animated.View style={animatedStyle}>
        {children}
      </Animated.View>
    </Pressable>
  );
}
