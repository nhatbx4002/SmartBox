import React, { useEffect, useCallback } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

import { useTheme } from '@/hooks/use-theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface BottomSheetProps {
  snapPoints: number[]; // e.g. [100, 350, 700] representing height from bottom
  children: React.ReactNode;
  activeSnapIndex?: number;
  onChangeSnap?: (index: number) => void;
}

export function BottomSheet({
  snapPoints,
  children,
  activeSnapIndex = 0,
  onChangeSnap,
}: BottomSheetProps) {
  const theme = useTheme();

  // Convert height from bottom to translateY values (where 0 is top of screen)
  const getTranslateYForIndex = useCallback((index: number) => {
    const heightFromBottom = snapPoints[index];
    return SCREEN_HEIGHT - heightFromBottom;
  }, [snapPoints]);

  const translateY = useSharedValue(SCREEN_HEIGHT);

  // Sync with activeSnapIndex from parent
  useEffect(() => {
    if (activeSnapIndex >= 0 && activeSnapIndex < snapPoints.length) {
      translateY.value = withSpring(getTranslateYForIndex(activeSnapIndex), {
        damping: 15,
        stiffness: 120,
      });
    }
  }, [activeSnapIndex, snapPoints.length, getTranslateYForIndex, translateY]);

  const context = useSharedValue({ y: 0 });

  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = { y: translateY.value };
    })
    .onUpdate((event) => {
      // Allow dragging but bound it within the min and max snap points
      const newY = context.value.y + event.translationY;
      const minY = SCREEN_HEIGHT - snapPoints[snapPoints.length - 1];
      const maxY = SCREEN_HEIGHT - snapPoints[0];
      // eslint-disable-next-line react-hooks/immutability
      translateY.value = Math.max(minY, Math.min(maxY, newY));
    })
    .onEnd((event) => {
      const currentY = translateY.value;
      // Find the closest snap point
      let closestIndex = 0;
      let minDistance = Infinity;

      for (let i = 0; i < snapPoints.length; i++) {
        const snapY = getTranslateYForIndex(i);
        const distance = Math.abs(currentY - snapY);
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = i;
        }
      }

      // Add velocity bias for swiping up/down quickly
      if (Math.abs(event.velocityY) > 500) {
        if (event.velocityY < 0 && closestIndex < snapPoints.length - 1) {
          closestIndex = Math.min(snapPoints.length - 1, closestIndex + 1);
        } else if (event.velocityY > 0 && closestIndex > 0) {
          closestIndex = Math.max(0, closestIndex - 1);
        }
      }

      // eslint-disable-next-line react-hooks/immutability
      translateY.value = withSpring(getTranslateYForIndex(closestIndex), {
        damping: 15,
        stiffness: 120,
      });

      if (onChangeSnap) {
        onChangeSnap(closestIndex);
      }
    });

  const rBottomSheetStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={[
          styles.bottomSheetContainer,
          { backgroundColor: theme.surface, shadowColor: '#000' },
          rBottomSheetStyle,
        ]}
      >
        <View style={styles.lineWrapper}>
          <View style={[styles.line, { backgroundColor: theme.border }]} />
        </View>
        <View style={styles.content}>
          {children}
        </View>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  bottomSheetContainer: {
    height: SCREEN_HEIGHT,
    width: '100%',
    position: 'absolute',
    top: 0,
    borderRadius: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 24,
    zIndex: 100,
  },
  lineWrapper: {
    width: '100%',
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  line: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  content: {
    flex: 1,
  },
});
