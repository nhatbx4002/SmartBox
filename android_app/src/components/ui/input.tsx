import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  TextInputProps,
  StyleProp,
  ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface InputProps extends Omit<TextInputProps, "secureTextEntry"> {
  label?: string;
  error?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  secureTextEntry?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
}

export default function Input({
  label,
  error,
  leftIcon,
  secureTextEntry = false,
  containerStyle,
  className,
  value,
  onChangeText,
  placeholder,
  onFocus,
  onBlur,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  // Determine border color and icon color
  const getBorderClass = () => {
    if (error) return "border-error";
    if (isFocused) return "border-border-focused";
    return "border-border";
  };

  const getIconColor = () => {
    if (error) return "#FF3D00"; // error
    if (isFocused) return "#FF6600"; // brand
    return "#A1A1A0"; // text-secondary
  };

  return (
    <View className={`w-full ${className || ""}`}>
      {/* Label */}
      {label && (
        <Text className="text-small-bold text-text-secondary mb-two">
          {label}
        </Text>
      )}

      {/* Input Container */}
      <View
        className={`flex-row items-center h-12 px-three bg-surface-glass border rounded-input transition-colors duration-200 ${getBorderClass()}`}
        style={containerStyle}
      >
        {/* Left Icon */}
        {leftIcon && (
          <Ionicons
            name={leftIcon}
            size={20}
            color={getIconColor()}
            style={{ marginRight: 8 }}
          />
        )}

        {/* Text Input */}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          placeholderTextColor="#6B6B6A"
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          className="flex-1 text-text text-body h-full font-sans"
          autoCapitalize="none"
          {...props}
        />

        {/* Right Toggle Icon for Password */}
        {secureTextEntry && (
          <Pressable
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={isPasswordVisible ? "eye-off" : "eye"}
              size={20}
              color="#A1A1A0"
            />
          </Pressable>
        )}
      </View>

      {/* Error Message */}
      {error ? (
        <Text className="text-small text-error mt-two ml-one">
          {error}
        </Text>
      ) : null}
    </View>
  );
}
