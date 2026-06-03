import React from 'react';
import {
  ActivityIndicator,
  GestureResponderEvent,
  Pressable,
  ViewStyle,
} from 'react-native';

import { ThemedText } from '../themed-text';
import { useTheme } from '@/hooks/use-theme';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  onPress?: (event: GestureResponderEvent) => void;
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  fullWidth?: boolean;
}

export function Button({
  onPress,
  title,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  style,
  fullWidth = true,
}: ButtonProps) {
  const theme = useTheme();

  const getButtonStyles = (pressed: boolean): ViewStyle => {
    const baseStyle: ViewStyle = {
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 8,
      flexDirection: 'row',
      opacity: pressed ? 0.8 : 1,
    };

    if (fullWidth) {
      baseStyle.width = '100%';
    }

    // Size styling
    let height = 48;
    let paddingHorizontal = 16;
    if (size === 'sm') {
      height = 36;
      paddingHorizontal = 12;
    } else if (size === 'lg') {
      height = 56;
      paddingHorizontal = 24;
    }
    baseStyle.height = height;
    baseStyle.paddingHorizontal = paddingHorizontal;

    // Disabled styles
    if (disabled || loading) {
      if (variant === 'primary') {
        return {
          ...baseStyle,
          backgroundColor: '#4D331A',
        };
      }
      return {
        ...baseStyle,
        backgroundColor: theme.surface,
        borderColor: theme.border,
        borderWidth: 1,
        opacity: 0.5,
      };
    }

    // Variant styling
    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: pressed ? '#E65C00' : theme.brand,
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: theme.surface,
          borderColor: theme.border,
          borderWidth: 1,
        };
      case 'ghost':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
        };
      case 'danger':
        return {
          ...baseStyle,
          backgroundColor: '#2A0D00',
          borderColor: theme.error,
          borderWidth: 1,
        };
      default:
        return baseStyle;
    }
  };

  const getTextColor = () => {
    if (disabled || loading) {
      if (variant === 'primary') return 'textMuted';
      return 'textMuted';
    }

    switch (variant) {
      case 'primary':
        return 'text';
      case 'secondary':
        return 'text';
      case 'ghost':
        return 'brand';
      case 'danger':
        return 'error';
      default:
        return 'text';
    }
  };

  const getFontSize = () => {
    return size === 'sm' ? 14 : 16;
  };

  return (
    <Pressable
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [getButtonStyles(pressed), style]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? '#FFFFFF' : theme.brand}
        />
      ) : (
        <ThemedText
          style={{ fontSize: getFontSize(), fontWeight: '600' }}
          themeColor={getTextColor()}
        >
          {title}
        </ThemedText>
      )}
    </Pressable>
  );
}


