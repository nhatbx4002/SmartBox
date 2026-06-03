import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

import { ThemedText } from '../themed-text';
import { ThemeColor } from '@/constants/theme';

export type BadgeStatus = 'active' | 'completed' | 'expired' | 'warning' | 'info';

interface BadgeProps {
  label: string;
  status?: BadgeStatus;
  style?: ViewStyle;
}

export function Badge({ label, status = 'info', style }: BadgeProps) {

  const getBadgeStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      paddingVertical: 4,
      paddingHorizontal: 10,
      borderRadius: 6,
      alignSelf: 'flex-start',
      justifyContent: 'center',
      alignItems: 'center',
    };

    switch (status) {
      case 'active':
        return {
          ...baseStyle,
          backgroundColor: '#0D2818',
        };
      case 'completed':
        return {
          ...baseStyle,
          backgroundColor: '#1A1A1A',
        };
      case 'expired':
        return {
          ...baseStyle,
          backgroundColor: '#2A0D00',
        };
      case 'warning':
        return {
          ...baseStyle,
          backgroundColor: '#2A1F00',
        };
      case 'info':
        return {
          ...baseStyle,
          backgroundColor: '#0D1F2A',
        };
      default:
        return baseStyle;
    }
  };

  const getTextColor = (): ThemeColor => {
    switch (status) {
      case 'active':
        return 'success';
      case 'completed':
        return 'textMuted';
      case 'expired':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      default:
        return 'text';
    }
  };

  return (
    <View style={[getBadgeStyle(), style]}>
      <ThemedText
        style={styles.text}
        themeColor={getTextColor()}
      >
        {label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
  },
});
