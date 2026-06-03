import { Platform, StyleSheet, Text, type TextProps } from 'react-native';

import { Fonts, ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ThemedTextProps = TextProps & {
  type?: 'default' | 'h1' | 'h2' | 'h3' | 'body' | 'bodyBold' | 'caption' | 'small' | 'smallBold' | 'otpCode' | 'otpCodeLarge' | 'price' | 'button' | 'code';
  themeColor?: ThemeColor;
};

export function ThemedText({ style, type = 'default', themeColor, ...rest }: ThemedTextProps) {
  const theme = useTheme();

  return (
    <Text
      style={[
        { color: theme[themeColor ?? 'text'] },
        type === 'default' && styles.body,
        type === 'h1' && styles.h1,
        type === 'h2' && styles.h2,
        type === 'h3' && styles.h3,
        type === 'body' && styles.body,
        type === 'bodyBold' && styles.bodyBold,
        type === 'caption' && styles.caption,
        type === 'small' && styles.small,
        type === 'smallBold' && styles.smallBold,
        type === 'otpCode' && styles.otpCode,
        type === 'otpCodeLarge' && styles.otpCodeLarge,
        type === 'price' && styles.price,
        type === 'button' && styles.button,
        type === 'code' && styles.code,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  h1: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 36,
  },
  h2: {
    fontSize: 22,
    fontWeight: '600',
    lineHeight: 28,
  },
  h3: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 22,
  },
  bodyBold: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 18,
  },
  small: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
  },
  smallBold: {
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
  },
  otpCode: {
    fontFamily: Fonts.mono,
    fontSize: 40,
    fontWeight: '700',
    lineHeight: 48,
    letterSpacing: 4,
  },
  otpCodeLarge: {
    fontFamily: Fonts.mono,
    fontSize: 56,
    fontWeight: '700',
    lineHeight: 64,
    letterSpacing: 6,
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 26,
  },
  button: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 20,
  },
  code: {
    fontFamily: Fonts.mono,
    fontWeight: Platform.select({ android: '700' }) ?? '500',
    fontSize: 12,
  },
});
