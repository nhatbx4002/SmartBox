/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    brand: '#FF6600',
    brandLight: '#FF8533',
    background: '#0A0A0A',
    surface: '#1C1C1B',
    surfaceElevated: '#2A2A29',
    border: '#333332',
    borderFocused: '#FF6600',
    text: '#FFFFFF',
    textSecondary: '#A1A1A0',
    textMuted: '#6B6B6A',
    success: '#00C853',
    successBg: '#0D2818',
    warning: '#FFB300',
    warningBg: '#2A1F00',
    error: '#FF3D00',
    errorBg: '#2A0D00',
    info: '#2196F3',
    online: '#00FF41',
  },
  dark: {
    brand: '#FF6600',
    brandLight: '#FF8533',
    background: '#0A0A0A',
    surface: '#1C1C1B',
    surfaceElevated: '#2A2A29',
    border: '#333332',
    borderFocused: '#FF6600',
    text: '#FFFFFF',
    textSecondary: '#A1A1A0',
    textMuted: '#6B6B6A',
    success: '#00C853',
    successBg: '#0D2818',
    warning: '#FFB300',
    warningBg: '#2A1F00',
    error: '#FF3D00',
    errorBg: '#2A0D00',
    info: '#2196F3',
    online: '#00FF41',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
