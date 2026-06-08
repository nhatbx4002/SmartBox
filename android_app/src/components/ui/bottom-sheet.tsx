import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  useWindowDimensions,
  StyleProp,
  ViewStyle,
  AccessibilityInfo,
} from "react-native";
import {
  GestureHandlerRootView,
  Gesture,
  GestureDetector,
} from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolateColor,
  runOnJS,
} from "react-native-reanimated";

interface BottomSheetProps {
  children: React.ReactNode;
  initialSnap?: "collapsed" | "half" | "expanded";
  onSnap?: (snap: "collapsed" | "half" | "expanded") => void;
  style?: StyleProp<ViewStyle>;
}

export default function BottomSheet({
  children,
  initialSnap = "collapsed",
  onSnap,
  style,
}: BottomSheetProps) {
  const { height: screenHeight } = useWindowDimensions();
  const [reduceMotion, setReduceMotion] = React.useState(false);

  React.useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      setReduceMotion(enabled);
    });
  }, []);

  // Bottom Sheet Dimensions
  const expandedHeight = screenHeight - 120;
  const halfHeight = 360;
  const collapsedHeight = 88;

  // Snap Y positions (translateY from fully expanded top)
  const expandedY = 0;
  const halfY = expandedHeight - halfHeight;
  const collapsedY = expandedHeight - collapsedHeight;

  // Animation values
  const translateY = useSharedValue(collapsedY);
  const isDragging = useSharedValue(0); // 0 = false, 1 = true
  const contextY = useSharedValue(0);

  // Set initial position
  useEffect(() => {
    let targetY = collapsedY;
    if (initialSnap === "half") targetY = halfY;
    if (initialSnap === "expanded") targetY = expandedY;
    
    translateY.value = targetY;
  }, [initialSnap, collapsedY, halfY, expandedY, translateY]);

  const snapSpringConfig = {
    damping: 18,
    stiffness: 120,
    mass: 1,
  };

  const handleSnapChange = (targetY: number) => {
    if (!onSnap) return;
    if (targetY === expandedY) onSnap("expanded");
    else if (targetY === halfY) onSnap("half");
    else if (targetY === collapsedY) onSnap("collapsed");
  };

  const panGesture = Gesture.Pan()
    .onStart(() => {
      contextY.value = translateY.value;
      if (reduceMotion) {
        isDragging.value = 1;
      } else {
        isDragging.value = withSpring(1, { damping: 15 });
      }
    })
    .onUpdate((event) => {
      // Allow dragging but bound it within expandedY and collapsedY
      const newY = contextY.value + event.translationY;
      translateY.value = Math.max(expandedY, Math.min(collapsedY, newY));
    })
    .onEnd((event) => {
      if (reduceMotion) {
        isDragging.value = 0;
      } else {
        isDragging.value = withSpring(0, { damping: 15 });
      }

      // Determine snap target based on current position and velocity
      const currentY = translateY.value;
      const velocityY = event.velocityY;
      
      let targetY = collapsedY;

      // Simple threshold check + velocity influence
      if (velocityY < -500) {
        // Flicking up
        if (currentY > halfY) {
          targetY = halfY;
        } else {
          targetY = expandedY;
        }
      } else if (velocityY > 500) {
        // Flicking down
        if (currentY < halfY) {
          targetY = halfY;
        } else {
          targetY = collapsedY;
        }
      } else {
        // Dragging slowly, snap to nearest point
        const distToExpanded = Math.abs(currentY - expandedY);
        const distToHalf = Math.abs(currentY - halfY);
        const distToCollapsed = Math.abs(currentY - collapsedY);

        const minDist = Math.min(distToExpanded, distToHalf, distToCollapsed);
        if (minDist === distToExpanded) {
          targetY = expandedY;
        } else if (minDist === distToHalf) {
          targetY = halfY;
        } else {
          targetY = collapsedY;
        }
      }

      if (reduceMotion) {
        translateY.value = targetY;
      } else {
        translateY.value = withSpring(targetY, snapSpringConfig);
      }
      
      runOnJS(handleSnapChange)(targetY);
    });

  // Animated styles for sheet container
  const sheetAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  // Animated styles for grab handle background color and glow
  const handleAnimatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      isDragging.value,
      [0, 1],
      ["#252525", "#FF6600"]
    );

    return {
      backgroundColor,
      shadowColor: "#FF6600",
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: isDragging.value * 0.4,
      shadowRadius: isDragging.value * 8,
      elevation: isDragging.value * 8,
    };
  });

  return (
    <GestureHandlerRootView style={StyleSheet.absoluteFillObject} pointerEvents="box-none">
      <Animated.View
        style={[
          sheetAnimatedStyle,
          {
            height: expandedHeight,
            top: screenHeight - expandedHeight,
          },
          style,
        ]}
        className="absolute left-0 right-0 bg-surface-glass border border-border rounded-t-sheet"
      >
        {/* Grab Handle Header */}
        <GestureDetector gesture={panGesture}>
          <View className="items-center py-three cursor-pointer w-full" hitSlop={{ top: 20, bottom: 20, left: 0, right: 0 }}>
            <Animated.View
              style={[{ width: 48, height: 6, borderRadius: 3 }, handleAnimatedStyle]}
            />
          </View>
        </GestureDetector>

        {/* Content Container */}
        <View className="flex-1 px-four">
          {children}
        </View>
      </Animated.View>
    </GestureHandlerRootView>
  );
}
