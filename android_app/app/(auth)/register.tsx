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
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { useAuthStore } from "../../src/store/authStore";

function formatPhoneNumber(text: string) {
  const cleaned = text.replace(/\D/g, "").slice(0, 10);
  if (cleaned.length > 6) return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
  if (cleaned.length > 3) return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
  return cleaned;
}

export default function RegisterScreen() {
  const router = useRouter();
  const register = useAuthStore((state) => state.register);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const isLoading = useAuthStore((state) => state.isLoading);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [formError, setFormError] = useState("");

  const buttonScale = useSharedValue(1);
  const buttonOpacity = useSharedValue(1);

  const validate = () => {
    let isValid = true;
    const rawPhone = phone.replace(/\s/g, "");

    if (!fullName.trim()) {
      setNameError("Họ và tên không được để trống.");
      isValid = false;
    } else {
      setNameError("");
    }

    if (rawPhone.length !== 10 || !rawPhone.startsWith("0")) {
      setPhoneError("Số điện thoại không hợp lệ.");
      isValid = false;
    } else {
      setPhoneError("");
    }

    if (password.length < 6) {
      setPasswordError("Mật khẩu ít nhất 6 ký tự.");
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("Mật khẩu xác nhận không khớp.");
      isValid = false;
    } else {
      setConfirmPasswordError("");
    }

    return isValid;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    try {
      setFormError("");
      await register({
        phone: phone.replace(/\s/g, ""),
        password,
      });

      if (fullName.trim()) {
        await updateProfile(fullName.trim());
      }

      router.replace("/home");
    } catch (error: any) {
      const message = error?.message || "Đăng ký thất bại.";
      setFormError(message);
      Alert.alert("Đăng ký thất bại", message);
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
            <Text className="text-h1 text-white font-sans text-center">Tạo tài khoản</Text>
            <Text className="text-caption text-text-secondary mt-one text-center">Tham gia hệ thống của OmniBox</Text>
          </View>

          <View className="bg-glass p-four rounded-panel border border-border gap-four z-10">
            <View>
              <Text className="text-small-bold text-text-secondary mb-two">Họ và tên</Text>
              <View className={`flex-row items-center h-12 px-three bg-surface-glass border rounded-input ${nameError ? "border-error" : "border-border"}`}>
                <Ionicons name="person-outline" size={20} color={nameError ? "#FF3D00" : "#A1A1A0"} />
                <TextInput
                  value={fullName}
                  onChangeText={(text) => {
                    setFullName(text);
                    setNameError("");
                    setFormError("");
                  }}
                  placeholder="Nguyễn Văn A"
                  placeholderTextColor="#6B6B6A"
                  className="flex-1 text-text text-body h-full font-sans ml-two"
                />
              </View>
              {nameError ? <Text className="text-small text-error mt-two ml-one">{nameError}</Text> : null}
            </View>

            <View>
              <Text className="text-small-bold text-text-secondary mb-two">Số điện thoại</Text>
              <View className={`flex-row items-center h-12 px-three bg-surface-glass border rounded-input ${phoneError ? "border-error" : "border-border"}`}>
                <Ionicons name="phone-portrait-outline" size={20} color={phoneError ? "#FF3D00" : "#A1A1A0"} />
                <TextInput
                  value={phone}
                  onChangeText={(text) => {
                    setPhone(formatPhoneNumber(text));
                    setPhoneError("");
                    setFormError("");
                  }}
                  keyboardType="numeric"
                  placeholder="09x xxx xxxx"
                  placeholderTextColor="#6B6B6A"
                  className="flex-1 text-text text-body h-full font-sans ml-two"
                />
              </View>
              {phoneError ? <Text className="text-small text-error mt-two ml-one">{phoneError}</Text> : null}
            </View>

            <View>
              <Text className="text-small-bold text-text-secondary mb-two">Mật khẩu</Text>
              <View className={`flex-row items-center h-12 px-three bg-surface-glass border rounded-input ${passwordError ? "border-error" : "border-border"}`}>
                <Ionicons name="lock-closed-outline" size={20} color={passwordError ? "#FF3D00" : "#A1A1A0"} />
                <TextInput
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    setPasswordError("");
                    setFormError("");
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
              <Text className="text-small-bold text-text-secondary mb-two">Xác nhận mật khẩu</Text>
              <View className={`flex-row items-center h-12 px-three bg-surface-glass border rounded-input ${confirmPasswordError ? "border-error" : "border-border"}`}>
                <Ionicons name="lock-closed-outline" size={20} color={confirmPasswordError ? "#FF3D00" : "#A1A1A0"} />
                <TextInput
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    setConfirmPasswordError("");
                    setFormError("");
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

            {formError ? <Text className="text-small text-error">{formError}</Text> : null}

            <Animated.View style={animatedButtonStyle} className="mt-two">
              <Pressable
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={handleRegister}
                disabled={isLoading}
                className="h-12 bg-brand rounded-button justify-center items-center shadow-brand-glow active:bg-brand-light"
              >
                {isLoading ? <ActivityIndicator color="#FFFFFF" size="small" /> : <Text className="text-btn text-white">Đăng ký</Text>}
              </Pressable>
            </Animated.View>
          </View>

          <View className="flex-row justify-center items-center mt-four z-10">
            <Text className="text-caption text-text-secondary">Đã có tài khoản? </Text>
            <Pressable onPress={() => router.push("/login")}>
              <Text className="text-caption text-brand font-semibold">Đăng nhập ngay</Text>
            </Pressable>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
