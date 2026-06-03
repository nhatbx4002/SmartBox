import React, { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '../themed-text';
import { useTheme } from '@/hooks/use-theme';

interface InputProps extends TextInputProps {
  label?: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  error?: string;
  secureTextEntry?: boolean;
}

export function Input({
  label,
  iconName,
  error,
  secureTextEntry = false,
  style,
  onFocus,
  onBlur,
  disabled,
  editable = true,
  ...rest
}: InputProps) {
  const theme = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  const isEditable = editable && !disabled;

  const getInputContainerStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      height: 52,
      borderRadius: 8,
      borderWidth: 1,
      backgroundColor: theme.surface,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
    };

    if (!isEditable) {
      baseStyle.borderColor = theme.surface;
      baseStyle.backgroundColor = theme.surface;
    } else if (error) {
      baseStyle.borderColor = theme.error;
    } else if (isFocused) {
      baseStyle.borderColor = theme.brand;
    } else {
      baseStyle.borderColor = theme.border;
    }

    return baseStyle;
  };

  return (
    <View style={styles.container}>
      {label && (
        <ThemedText style={styles.label} themeColor="textSecondary" type="small">
          {label}
        </ThemedText>
      )}

      <View style={getInputContainerStyle()}>
        {iconName && (
          <Ionicons
            name={iconName}
            size={20}
            color={error ? theme.error : isFocused ? theme.brand : theme.textMuted}
            style={styles.leftIcon}
          />
        )}

        <TextInput
          style={[
            styles.input,
            { color: isEditable ? theme.text : theme.textMuted },
            style,
          ]}
          placeholderTextColor={theme.textMuted}
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={secureTextEntry && !passwordVisible}
          editable={isEditable}
          {...rest}
        />

        {secureTextEntry && (
          <Pressable
            onPress={() => setPasswordVisible(!passwordVisible)}
            style={styles.rightIconButton}
          >
            <Ionicons
              name={passwordVisible ? 'eye-off' : 'eye'}
              size={20}
              color={theme.textSecondary}
            />
          </Pressable>
        )}
      </View>

      {error && (
        <ThemedText style={styles.errorText} themeColor="error" type="small">
          {error}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    marginBottom: 6,
  },
  leftIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    padding: 0,
    margin: 0,
  },
  rightIconButton: {
    padding: 4,
    marginLeft: 8,
  },
  errorText: {
    marginTop: 4,
  },
});
