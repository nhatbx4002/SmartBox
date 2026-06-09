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
  Image,
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
  if (cleaned.length > 6) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
  }
  if (cleaned.length > 3) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
  }
  return cleaned;
}

export default function LoginScreen() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const storeLoading = useAuthStore((state) => state.isLoading);

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [formError, setFormError] = useState("");
  const [isPhoneFocused, setIsPhoneFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const buttonScale = useSharedValue(1);
  const buttonOpacity = useSharedValue(1);

  const validate = () => {
    let isValid = true;
    const rawPhone = phone.replace(/\s/g, "");

    if (rawPhone.length !== 10 || !rawPhone.startsWith("0")) {
      setPhoneError("Số điện thoại phải là 10 số.");
      isValid = false;
    } else {
      setPhoneError("");
    }

    if (password.length < 6) {
      setPasswordError("Mật khẩu phải tối thiểu 6 ký tự.");
      isValid = false;
    } else {
      setPasswordError("");
    }

    return isValid;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    try {
      setFormError("");
      await login({
        phone: phone.replace(/\s/g, ""),
        password,
      });
      router.replace("/home");
    } catch (error: any) {
      const message = error?.message || "Đăng nhập thất bại.";
      setFormError(message);
      Alert.alert("Đăng nhập thất bại", message);
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
        <View className="flex-1 justify-center px-four">
          <View className="items-center mb-six">
            <View className="w-20 h-20 bg-surface justify-center items-center mb-three border border-border shadow-brand-glow-strong overflow-hidden">
              <Image
                source={require("../../assets/images/AppLogo.png")}
                className="w-20 h-20"
                resizeMode="contain"
              />
            </View>
            <Text className="text-h1 text-white font-sans text-center">OmniBox</Text>
          </View>

          <View className="bg-glass p-four rounded-panel border border-border gap-four">
            <View>
              <Text className="text-small-bold text-text-secondary mb-two">Số điện thoại</Text>
              <View
                className={`flex-row items-center h-12 px-three bg-surface-glass border rounded-input ${
                  phoneError ? "border-error" : isPhoneFocused ? "border-border-focused" : "border-border"
                }`}
              >
                <Ionicons
                  name="phone-portrait-outline"
                  size={20}
                  color={phoneError ? "#FF3D00" : isPhoneFocused ? "#FF6600" : "#A1A1A0"}
                />
                <TextInput
                  value={phone}
                  onChangeText={(text) => {
                    setPhone(formatPhoneNumber(text));
                    setPhoneError("");
                    setFormError("");
                  }}
                  onFocus={() => setIsPhoneFocused(true)}
                  onBlur={() => setIsPhoneFocused(false)}
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
              <View
                className={`flex-row items-center h-12 px-three bg-surface-glass border rounded-input ${
                  passwordError ? "border-error" : isPasswordFocused ? "border-border-focused" : "border-border"
                }`}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={passwordError ? "#FF3D00" : isPasswordFocused ? "#FF6600" : "#A1A1A0"}
                />
                <TextInput
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    setPasswordError("");
                    setFormError("");
                  }}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                  secureTextEntry={!showPassword}
                  placeholder="********"
                  placeholderTextColor="#6B6B6A"
                  className="flex-1 text-text text-body h-full font-sans ml-two"
                />
                <Pressable onPress={() => setShowPassword((value) => !value)} className="p-one">
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="#A1A1A0"
                  />
                </Pressable>
              </View>
              <View className="flex-row justify-between items-center mt-two">
                {passwordError ? (
                  <Text className="text-small text-error ml-one">{passwordError}</Text>
                ) : (
                  <View />
                )}
                <Pressable onPress={() => router.push("/forgot-password")}>
                  <Text className="text-caption text-brand font-semibold">Quên mật khẩu?</Text>
                </Pressable>
              </View>
            </View>

            {formError ? <Text className="text-small text-error">{formError}</Text> : null}

            <Animated.View style={animatedButtonStyle} className="mt-two">
              <Pressable
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={handleLogin}
                disabled={storeLoading}
                className="h-12 bg-brand rounded-button justify-center items-center shadow-brand-glow active:bg-brand-light"
              >
                {storeLoading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text className="text-btn text-white">Đăng Nhập</Text>
                )}
              </Pressable>
            </Animated.View>
          </View>

          <View className="flex-row justify-center items-center mt-four">
            <Text className="text-caption text-text-secondary">Chưa có tài khoản? </Text>
            <Pressable onPress={() => router.push("/register")}>
              <Text className="text-caption text-brand font-semibold">Đăng ký ngay</Text>
            </Pressable>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
