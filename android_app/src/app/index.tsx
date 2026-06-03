import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Animated, Easing } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function SplashScreen() {
  const router = useRouter();

  // Animation values for the 3 dots
  const [dot1] = useState(() => new Animated.Value(0.3));
  const [dot2] = useState(() => new Animated.Value(0.3));
  const [dot3] = useState(() => new Animated.Value(0.3));

  useEffect(() => {
    // Pulse animation logic
    const pulse = (dot: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: 1,
            duration: 400,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0.3,
            duration: 400,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ])
      );
    };

    Animated.parallel([
      pulse(dot1, 0),
      pulse(dot2, 200),
      pulse(dot3, 400),
    ]).start();

    // Auto navigate after 1.8s delay
    const timer = setTimeout(() => {
      // Direct user to login for mock flow demonstration
      router.replace('/login');
    }, 1800);

    return () => clearTimeout(timer);
  }, [dot1, dot2, dot3, router]);

  return (
    <ThemedView style={styles.container}>
      <View style={styles.logoSection}>
        {/* Immersive orange brand icon */}
        <View style={styles.logoBackground}>
          <Ionicons name="cube" size={48} color="#FF6600" />
        </View>
        <ThemedText type="h1" style={styles.title}>
          SmartBox
        </ThemedText>
        <ThemedText type="caption" themeColor="textSecondary" style={styles.subtitle}>
          Smart Locker
        </ThemedText>
      </View>

      <View style={styles.loader}>
        <Animated.View style={[styles.dot, { opacity: dot1 }]} />
        <Animated.View style={[styles.dot, { opacity: dot2 }]} />
        <Animated.View style={[styles.dot, { opacity: dot3 }]} />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoBackground: {
    width: 96,
    height: 96,
    borderRadius: 24,
    backgroundColor: '#1C1C1B',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  loader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF6600',
    marginHorizontal: 6,
  },
});
