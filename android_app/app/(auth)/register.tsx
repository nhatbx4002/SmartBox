import React, { useEffect } from "react";
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
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withSequence,
  withTiming,
  FadeIn,
} from "react-native-reanimated";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { useAuthStore } from "../../src/store/authStore";

const SPRING_CONFIG = { damping: 14, stiffness: 100, mass: 1 };
const STAGGER_DELAY = 150;

function FloatingOrb() {
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);

  useEffect(() => {
    const animate = () => {
      translateY.value = withSequence(
        withTiming(-20, { duration: 4000 }),
        withTiming(10, { duration: 3500 }),
        withTiming(-6, { duration: 3000 }),
        withTiming(0, { duration: 2500 }),
      );
      translateX.value = withSequence(
        withTiming(14, { duration: 5000 }),
        withTiming(-10, { duration: 4500 }),
        withTiming(6, { duration: 4000 }),
        withTiming(0, { duration: 3500 }),
      );
    };
    animate();
    const interval = setInterval(animate, 13000);
    return () => clearInterval(interval);
  }, []);

  const orbStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
    ],
  }));

  return (
    <Animated.View
      style={orbStyle}
      className="absolute w-64 h-64 rounded-full"
      pointerEvents="none"
    >
      <View
        className="w-full h-full rounded-full opacity-8"
        style={{ backgroundColor: "#FF6600" }}
      />
    </Animated.View>
  );
}

function StaggeredView({
  index,
  children,
}: {
  index: number;
  children: React.ReactNode;
}) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(18);

  useEffect(() => {
    opacity.value = withDelay(
      index * STAGGER_DELAY,
      withSpring(1, { ...SPRING_CONFIG, stiffness: 80 }),
    );
    translateY.value = withDelay(
      index * STAGGER_DELAY,
      withSpring(0, SPRING_CONFIG),
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return <Animated.View style={style}>{children}</Animated.View>;
}

function FormField({
  label,
  icon,
  value,
  onChangeText,
  placeholder,
  error,
  secureTextEntry,
  keyboardType,
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "numeric";
}) {
  const [visible, setVisible] = React.useState(false);
  const showToggle = secureTextEntry;

  return (
    <View>
      <Text className="text-small-bold text-text-muted mb-2 tracking-wide uppercase">
        {label}
      </Text>
      <View
        className={`flex-row items-center h-12 px-3 rounded-xl border ${
          error ? "border-error" : "border-white/10"
        } bg-white/5`}
      >
        <Ionicons
          name={icon}
          size={18}
          color={error ? "#FF3D00" : "#999"}
        />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#6B6B6A"
          secureTextEntry={secureTextEntry && !visible}
          keyboardType={keyboardType ?? "default"}
          className="flex-1 text-text text-body h-full font-sans ml-2"
          autoCapitalize="none"
        />
        {showToggle && (
          <Pressable onPress={() => setVisible((v) => !v)} hitSlop={8}>
            <Ionicons
              name={visible ? "eye-off" : "eye"}
              size={18}
              color="#999"
            />
          </Pressable>
        )}
      </View>
      {error ? (
        <Text className="text-small text-error mt-1.5 ml-1">{error}</Text>
      ) : null}
    </View>
  );
}

export default function RegisterScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const register = useAuthStore((state) => state.register);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const isLoading = useAuthStore((state) => state.isLoading);

  const [fullName, setFullName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [nameError, setNameError] = React.useState("");
  const [phoneError, setPhoneError] = React.useState("");
  const [passwordError, setPasswordError] = React.useState("");
  const [confirmPasswordError, setConfirmPasswordError] = React.useState("");
  const [formError, setFormError] = React.useState("");

  const buttonScale = useSharedValue(1);

  const validate = () => {
    let valid = true;
    const rawPhone = phone.replace(/\s/g, "");

    if (!fullName.trim()) {
      setNameError("Họ và tên không được để trống.");
      valid = false;
    } else {
      setNameError("");
    }

    if (rawPhone.length !== 10 || !rawPhone.startsWith("0")) {
      setPhoneError("Số điện thoại không hợp lệ.");
      valid = false;
    } else {
      setPhoneError("");
    }

    if (password.length < 6) {
      setPasswordError("Mật khẩu ít nhất 6 ký tự.");
      valid = false;
    } else {
      setPasswordError("");
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("Mật khẩu xác nhận không khớp.");
      valid = false;
    } else {
      setConfirmPasswordError("");
    }

    return valid;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      setFormError("");
      await register({ phone: rawPhone(), password });
      if (fullName.trim()) {
        await updateProfile(fullName.trim());
      }
      router.replace("/home");
    } catch (error: any) {
      const msg = error?.message || "Đăng ký thất bại.";
      setFormError(msg);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const rawPhone = () => phone.replace(/\s/g, "");

  const formatPhone = (text: string) => {
    const cleaned = text.replace(/\D/g, "").slice(0, 10);
    if (cleaned.length > 6) return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
    if (cleaned.length > 3) return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
    return cleaned;
  };

  const handlePressIn = () => {
    buttonScale.value = withSpring(0.97, SPRING_CONFIG);
  };

  const handlePressOut = () => {
    buttonScale.value = withSpring(1, SPRING_CONFIG);
  };

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
      style={{ backgroundColor: "#0A0A0A" }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1" style={{ paddingTop: insets.top }}>
          {/* Decorative element */}
          <View className="absolute top-[-40px] left-[-60px]">
            <FloatingOrb />
          </View>

          <Animated.ScrollView
            className="flex-1"
            contentContainerStyle={{ paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            entering={FadeIn.duration(600)}
          >
            {/* Back button */}
            <View className="px-four pt-four">
              <Pressable
                onPress={() => router.back()}
                className="w-10 h-10 rounded-xl items-center justify-center bg-white/5 border border-white/10"
              >
                <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
              </Pressable>
            </View>

            {/* Header */}
            <View className="px-four pt-five pb-two">
              <Text className="text-h1 text-white font-sans font-bold tracking-tight">
                Tạo tài khoản
              </Text>
              <Text className="text-body text-text-muted mt-2 max-w-[280px] leading-relaxed">
                Tham gia hệ thống tủ thông minh OmniBox.
              </Text>
            </View>

            {/* Form card */}
            <View className="px-four">
              <StaggeredView index={0}>
                <View
                  className="overflow-hidden rounded-2xl border border-white/10"
                  style={{ backgroundColor: "rgba(28, 28, 27, 0.88)" }}
                >
                  <View className="p-5">
                    <View className="gap-4">
                      <StaggeredView index={1}>
                        <FormField
                          label="Họ và tên"
                          icon="person-outline"
                          value={fullName}
                          onChangeText={(t) => { setFullName(t); setNameError(""); setFormError(""); }}
                          placeholder="Nguyễn Văn A"
                          error={nameError}
                        />
                      </StaggeredView>
                      <StaggeredView index={2}>
                        <FormField
                          label="Số điện thoại"
                          icon="phone-portrait-outline"
                          value={phone}
                          onChangeText={(t) => { setPhone(formatPhone(t)); setPhoneError(""); setFormError(""); }}
                          placeholder="09x xxx xxxx"
                          keyboardType="numeric"
                          error={phoneError}
                        />
                      </StaggeredView>
                      <StaggeredView index={3}>
                        <FormField
                          label="Mật khẩu"
                          icon="lock-closed-outline"
                          value={password}
                          onChangeText={(t) => { setPassword(t); setPasswordError(""); setFormError(""); }}
                          placeholder="••••••••"
                          secureTextEntry
                          error={passwordError}
                        />
                      </StaggeredView>
                      <StaggeredView index={4}>
                        <FormField
                          label="Xác nhận mật khẩu"
                          icon="lock-closed-outline"
                          value={confirmPassword}
                          onChangeText={(t) => { setConfirmPassword(t); setConfirmPasswordError(""); setFormError(""); }}
                          placeholder="••••••••"
                          secureTextEntry
                          error={confirmPasswordError}
                        />
                      </StaggeredView>

                      {formError && (
                        <StaggeredView index={5}>
                          <View className="flex-row items-center gap-2 bg-error-bg rounded-xl px-3 py-2.5 border border-error/20">
                            <Ionicons name="alert-circle" size={16} color="#FF3D00" />
                            <Text className="text-small text-error flex-1">{formError}</Text>
                          </View>
                        </StaggeredView>
                      )}

                      <StaggeredView index={6}>
                        <Animated.View style={buttonStyle}>
                          <Pressable
                            onPressIn={handlePressIn}
                            onPressOut={handlePressOut}
                            onPress={handleRegister}
                            disabled={isLoading}
                            className="h-13 bg-brand rounded-xl items-center justify-center shadow-brand-glow active:bg-brand-light mt-1"
                            style={
                              isLoading
                                ? { backgroundColor: "rgba(255, 102, 0, 0.35)" }
                                : {}
                            }
                          >
                            {isLoading ? (
                              <ActivityIndicator color="#FFFFFF" size="small" />
                            ) : (
                              <Text className="text-btn text-white font-semibold tracking-wide">
                                Đăng ký
                              </Text>
                            )}
                          </Pressable>
                        </Animated.View>
                      </StaggeredView>
                    </View>
                  </View>
                </View>
              </StaggeredView>

              {/* Login link */}
              <StaggeredView index={7}>
                <View className="flex-row justify-center items-center mt-6">
                  <Text className="text-caption text-text-muted">
                    Đã có tài khoản?{" "}
                  </Text>
                  <Pressable onPress={() => router.push("/login")}>
                    <Text className="text-caption text-brand font-semibold">
                      Đăng nhập ngay
                    </Text>
                  </Pressable>
                </View>
              </StaggeredView>
            </View>
          </Animated.ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
