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
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { authService } from "../../src/services/auth";

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { token } = useLocalSearchParams<{ token?: string }>();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const buttonScale = useSharedValue(1);
  const buttonOpacity = useSharedValue(1);

  const validate = () => {
    let isValid = true;
    if (password.length < 6) {
      setPasswordError("Mật khẩu mới phải có ít nhất 6 ký tự.");
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("Xác nhận mật khẩu không khớp.");
      isValid = false;
    } else {
      setConfirmPasswordError("");
    }

    if (!token) {
      Alert.alert("Thiếu token", "Không có reset token hợp lệ.");
      isValid = false;
    }

    return isValid;
  };

  const handleResetPassword = async () => {
    if (!validate()) return;

    try {
      setIsLoading(true);
      await authService.resetPassword({
        token: String(token),
        newPassword: password,
      });
      setIsSuccess(true);
    } catch (error: any) {
      Alert.alert("Đặt lại mật khẩu thất bại", error?.message || "Có lỗi xảy ra.");
    } finally {
      setIsLoading(false);
    }
  };

  const pressSpringConfig = { damping: 15, stiffness: 120, mass: 1 };
  const handlePressIn = () => {
    buttonScale.value = withSpring(0.97, pressSpringConfig);
    buttonOpacity.value = withSpring(0.85, pressSpringConfig);
  };
  const handlePressOut = () => {
    buttonScale.value = withSpring(1, pressSpringConfig);
    buttonOpacity.value = withSpring(1, pressSpringConfig);
  };
  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
    opacity: buttonOpacity.value,
  }));

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-background"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }} className="px-four py-six">
          <View className="items-center mb-six z-10">
            <Text className="text-h1 text-white font-sans text-center">Đặt lại mật khẩu</Text>
          </View>

          <View className="bg-glass p-four rounded-panel border border-border gap-four z-10">
            {isSuccess ? (
              <View className="items-center py-four gap-three">
                <Ionicons name="checkmark-circle-outline" size={64} color="#00C853" />
                <Text className="text-h3 text-white text-center">Cập nhật thành công</Text>
                <Text className="text-caption text-text-secondary text-center">
                  Mật khẩu mới đã được thiết lập. Bạn có thể đăng nhập lại ngay bây giờ.
                </Text>
                <Pressable
                  onPress={() => router.replace("/login")}
                  className="w-full h-12 bg-brand rounded-button justify-center items-center shadow-brand-glow mt-four active:bg-brand-light"
                >
                  <Text className="text-btn text-white">Quay lại đăng nhập</Text>
                </Pressable>
              </View>
            ) : (
              <View className="gap-four">
                <View>
                  <Text className="text-small-bold text-text-secondary mb-two">Mật khẩu mới</Text>
                  <View className={`flex-row items-center h-12 px-three bg-surface-glass border rounded-input ${passwordError ? "border-error" : "border-border"}`}>
                    <Ionicons name="lock-closed-outline" size={20} color={passwordError ? "#FF3D00" : "#A1A1A0"} />
                    <TextInput
                      value={password}
                      onChangeText={(text) => {
                        setPassword(text);
                        setPasswordError("");
                      }}
                      secureTextEntry={!showPassword}
                      placeholder="*******"
                      placeholderTextColor="#6B6B6A"
                      className="flex-1 text-text text-body h-full font-sans ml-two"
                    />
                    <Pressable onPress={() => setShowPassword((value) => !value)} className="p-one">
                      <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#A1A1A0" />
                    </Pressable>
                  </View>
                  {passwordError ? <Text className="text-small text-error mt-two ml-one">{passwordError}</Text> : null}
                </View>

                <View>
                  <Text className="text-small-bold text-text-secondary mb-two">Xác nhận mật khẩu mới</Text>
                  <View className={`flex-row items-center h-12 px-three bg-surface-glass border rounded-input ${confirmPasswordError ? "border-error" : "border-border"}`}>
                    <Ionicons name="lock-closed-outline" size={20} color={confirmPasswordError ? "#FF3D00" : "#A1A1A0"} />
                    <TextInput
                      value={confirmPassword}
                      onChangeText={(text) => {
                        setConfirmPassword(text);
                        setConfirmPasswordError("");
                      }}
                      secureTextEntry={!showConfirmPassword}
                      placeholder="*******"
                      placeholderTextColor="#6B6B6A"
                      className="flex-1 text-text text-body h-full font-sans ml-two"
                    />
                    <Pressable onPress={() => setShowConfirmPassword((value) => !value)} className="p-one">
                      <Ionicons name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#A1A1A0" />
                    </Pressable>
                  </View>
                  {confirmPasswordError ? <Text className="text-small text-error mt-two ml-one">{confirmPasswordError}</Text> : null}
                </View>

                <Animated.View style={animatedButtonStyle} className="mt-two">
                  <Pressable
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    onPress={handleResetPassword}
                    disabled={isLoading}
                    className="h-12 bg-brand rounded-button justify-center items-center shadow-brand-glow active:bg-brand-light"
                  >
                    {isLoading ? <ActivityIndicator color="#FFFFFF" size="small" /> : <Text className="text-btn text-white">Cập nhật mật khẩu</Text>}
                  </Pressable>
                </Animated.View>
              </View>
            )}
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
