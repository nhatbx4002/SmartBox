import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

export default function ResetPasswordScreen() {
  const router = useRouter();

  // Tr?ng th?i m?t kh?u m?i
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Tr?ng th?i focus hi?u ?ng
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] = useState(false);

  // Th?ng b?o l?i
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  // Tr?ng th?i t?i v? ho?n th?nh
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Hi?u ?ng spring cho n?t b?m
  const buttonScale = useSharedValue(1);
  const buttonOpacity = useSharedValue(1);

  const validate = () => {
    let isValid = true;

    if (password.length < 6) {
      setPasswordError("M?t kh?u m?i ph?i ch?a ?t nh?t 6 k? t?.");
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("X?c nh?n m?t kh?u m?i kh?ng tr?ng kh?p.");
      isValid = false;
    } else {
      setConfirmPasswordError("");
    }

    return isValid;
  };

  const handleResetPassword = () => {
    if (!validate()) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 1500);
  };

  const pressSpringConfig = {
    damping: 15,
    stiffness: 120,
    mass: 1,
  };

  const handlePressIn = () => {
    buttonScale.value = withSpring(0.97, pressSpringConfig);
    buttonOpacity.value = withSpring(0.85, pressSpringConfig);
  };

  const handlePressOut = () => {
    buttonScale.value = withSpring(1, pressSpringConfig);
    buttonOpacity.value = withSpring(1, pressSpringConfig);
  };

  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }],
      opacity: buttonOpacity.value,
    };
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-background"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }} className="px-four py-six">
          
          {/* Hi?u ?ng n?n ph?t s?ng Neon-Tech */}
          <View className="absolute top-[-50px] left-[-50px] w-64 h-64 rounded-full bg-brand-glow opacity-25" />
          <View className="absolute bottom-[-80px] right-[-80px] w-80 h-80 rounded-full bg-brand-glow opacity-20" />
          
          {/* Header ti?u ?? */}
          <View className="items-center mb-six z-10">
            <Text className="text-h1 text-white font-sans text-center">Đặt lại mật khẩu</Text>
          </View>

          {/* Form Card */}
          <View className="bg-glass p-four rounded-panel border border-border gap-four shadow-lg z-10">
            
            {isSuccess ? (
              // Tr?ng th?i ??i m?t kh?u th?nh c?ng
              <View className="items-center py-four gap-three">
                <Ionicons name="checkmark-circle-outline" size={64} color="#00C853" />
                <Text className="text-h3 text-white text-center">Cập nhật thành công!</Text>
                <Text className="text-caption text-text-secondary text-center">
                  Mật khẩu mới đã được thiết lập bạn có thể đăng nhập lại ngay bây giờ.
                </Text>
                
                <Pressable
                  onPress={() => router.replace("/login")}
                  className="w-full h-12 bg-brand rounded-button justify-center items-center shadow-brand-glow mt-four active:bg-brand-light"
                >
                  <Text className="text-btn text-white">Quay lại đăng nhập</Text>
                </Pressable>
              </View>
            ) : (
              // Form nhập mật khẩu mới
              <View className="gap-four">
                {/* Mật khẩu mới */}
                <View>
                  <Text className="text-small-bold text-text-secondary mb-two">Mật khẩu mới</Text>
                  <View 
                    className={`flex-row items-center h-12 px-three bg-surface-glass border rounded-input transition-colors duration-200 ${
                      passwordError 
                        ? "border-error" 
                        : isPasswordFocused 
                          ? "border-border-focused" 
                          : "border-border"
                    }`}
                  >
                    <Ionicons 
                      name="lock-closed-outline" 
                      size={20} 
                      color={passwordError ? "#FF3D00" : isPasswordFocused ? "#FF6600" : "#A1A1A0"} 
                      className="mr-two"
                    />
                    <TextInput
                      value={password}
                      onChangeText={(text) => { setPassword(text); if (passwordError) setPasswordError(""); }}
                      onFocus={() => setIsPasswordFocused(true)}
                      onBlur={() => setIsPasswordFocused(false)}
                      secureTextEntry={!showPassword}
                      placeholder="*******"
                      placeholderTextColor="#6B6B6A"
                      className="flex-1 text-text text-body h-full font-sans"
                    />
                    <Pressable onPress={() => setShowPassword(!showPassword)} className="p-one">
                      <Ionicons 
                        name={showPassword ? "eye-off-outline" : "eye-outline"} 
                        size={20} 
                        color="#A1A1A0" 
                      />
                    </Pressable>
                  </View>
                  {passwordError ? (
                    <Text className="text-small text-error mt-two ml-one">{passwordError}</Text>
                  ) : null}
                </View>

                {/* X?c nh?n m?t kh?u m?i */}
                <View>
                  <Text className="text-small-bold text-text-secondary mb-two">Xác nhận mật khẩu mới</Text>
                  <View 
                    className={`flex-row items-center h-12 px-three bg-surface-glass border rounded-input transition-colors duration-200 ${
                      confirmPasswordError 
                        ? "border-error" 
                        : isConfirmPasswordFocused 
                          ? "border-border-focused" 
                          : "border-border"
                    }`}
                  >
                    <Ionicons 
                      name="lock-closed-outline" 
                      size={20} 
                      color={confirmPasswordError ? "#FF3D00" : isConfirmPasswordFocused ? "#FF6600" : "#A1A1A0"} 
                      className="mr-two"
                    />
                    <TextInput
                      value={confirmPassword}
                      onChangeText={(text) => { setConfirmPassword(text); if (confirmPasswordError) setConfirmPasswordError(""); }}
                      onFocus={() => setIsConfirmPasswordFocused(true)}
                      onBlur={() => setIsConfirmPasswordFocused(false)}
                      secureTextEntry={!showConfirmPassword}
                      placeholder="*******"
                      placeholderTextColor="#6B6B6A"
                      className="flex-1 text-text text-body h-full font-sans"
                    />
                    <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)} className="p-one">
                      <Ionicons 
                        name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                        size={20} 
                        color="#A1A1A0" 
                      />
                    </Pressable>
                  </View>
                  {confirmPasswordError ? (
                    <Text className="text-small text-error mt-two ml-one">{confirmPasswordError}</Text>
                  ) : null}
                </View>

                {/* N?t ??t l?i m?t kh?u */}
                <Animated.View style={animatedButtonStyle} className="mt-two">
                  <Pressable
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    onPress={handleResetPassword}
                    disabled={isLoading}
                    className="h-12 bg-brand rounded-button justify-center items-center shadow-brand-glow active:bg-brand-light"
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#FFFFFF" size="small" />
                    ) : (
                      <Text className="text-btn text-white">Cập nhật mật khẩu</Text>
                    )}
                  </Pressable>
                </Animated.View>
              </View>
            )}

          </View>

          {/* Quay lại đăng nhập*/}
          {!isSuccess && (
            <View className="flex-row justify-center items-center mt-four z-10">
              <Pressable onPress={() => router.push("/login")} className="flex-row items-center gap-one">
                <Ionicons name="arrow-back-outline" size={16} color="#FF6600" />
                <Text className="text-caption text-brand font-semibold">Quay lại đăng nhập</Text>
              </Pressable>
            </View>
          )}

        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
