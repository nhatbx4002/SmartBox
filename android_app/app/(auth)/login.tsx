import React, { useEffect, useRef } from "react";
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
const STAGGER_DELAY = 180;

function FloatingOrb() {
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);

  useEffect(() => {
    const animate = () => {
      translateY.value = withSequence(
        withTiming(-24, { duration: 4000 }),
        withTiming(12, { duration: 3500 }),
        withTiming(-8, { duration: 3000 }),
        withTiming(0, { duration: 2500 }),
      );
      translateX.value = withSequence(
        withTiming(16, { duration: 5000 }),
        withTiming(-12, { duration: 4500 }),
        withTiming(8, { duration: 4000 }),
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
      className="absolute w-72 h-72 rounded-full"
      pointerEvents="none"
    >
      <View
        className="w-full h-full rounded-full opacity-10"
        style={{ backgroundColor: "#FF6600" }}
      />
    </Animated.View>
  );
}

function BrandHeader() {
  return (
    <View className="px-four pt-six">
      <View className="flex-row items-center gap-three mb-two">
        <View className="w-12 h-12 rounded-2xl bg-brand items-center justify-center shadow-brand-glow">
          <Ionicons name="cube" size={24} color="#FFFFFF" />
        </View>
        <Text className="text-h1 text-white font-sans font-bold tracking-tight">
          OmniBox
        </Text>
      </View>
      <Text className="text-body text-text-muted max-w-[280px] leading-relaxed">
         Dịch vụ tủ thông minh — truy cập nhanh, bảo mật tuyệt đối.
      </Text>
    </View>
  );
}

function StaggeredChildren({
  index,
  children,
}: {
  index: number;
  children: React.ReactNode;
}) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

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

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
}

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const login = useAuthStore((state) => state.login);
  const storeLoading = useAuthStore((state) => state.isLoading);

  const [phone, setPhone] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [phoneError, setPhoneError] = React.useState("");
  const [passwordError, setPasswordError] = React.useState("");
  const [formError, setFormError] = React.useState("");

  const buttonScale = useSharedValue(1);
  const buttonGlow = useSharedValue(0);

  const handleValidation = () => {
    let valid = true;
    const rawPhone = phone.replace(/\s/g, "");

    if (rawPhone.length !== 10 || !rawPhone.startsWith("0")) {
      setPhoneError("Số điện thoại không hợp lệ.");
      valid = false;
    } else {
      setPhoneError("");
    }

    if (password.length < 6) {
      setPasswordError("Mật khẩu tối thiểu 6 ký tự.");
      valid = false;
    } else {
      setPasswordError("");
    }

    return valid;
  };

  const handleLogin = async () => {
    if (!handleValidation()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      setFormError("");
      await login({ phone: phone.replace(/\s/g, ""), password });
      router.replace("/home");
    } catch (error: any) {
      const msg = error?.message || "Đăng nhập thất bại.";
      setFormError(msg);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const handlePressIn = () => {
    buttonScale.value = withSpring(0.97, SPRING_CONFIG);
    buttonGlow.value = withSpring(1, SPRING_CONFIG);
  };

  const handlePressOut = () => {
    buttonScale.value = withSpring(1, SPRING_CONFIG);
    buttonGlow.value = withSpring(0, SPRING_CONFIG);
  };

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const isDisabled = storeLoading;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
      style={{ backgroundColor: "#0A0A0A" }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1" style={{ paddingTop: insets.top }}>
          {/* Decorative orb */}
          <View className="absolute top-[-60px] right-[-80px]">
            <FloatingOrb />
          </View>

          <ScrollableContent>
            <BrandHeader />

            <View className="px-four mt-eight mb-four">
              <StaggeredChildren index={0}>
                <View
                  className="overflow-hidden rounded-2xl border border-white/10"
                  style={{ backgroundColor: "rgba(28, 28, 27, 0.88)" }}
                >
                  <View className="p-5">

                    <View className="gap-4">
                      {/* Phone */}
                      <StaggeredChildren index={1}>
                        <View>
                          <Text className="text-small-bold text-text-muted mb-2 tracking-wide uppercase">
                            Số điện thoại
                          </Text>
                          <View
                            className={`flex-row items-center h-12 px-3 rounded-xl border ${
                              phoneError ? "border-error" : "border-white/10"
                            } bg-white/5`}
                          >
                            <Ionicons
                              name="phone-portrait-outline"
                              size={18}
                              color={phoneError ? "#FF3D00" : "#999"}
                            />
                            <TextInput
                              value={phone}
                              onChangeText={(text) => {
                                const cleaned = text.replace(/\D/g, "").slice(0, 10);
                                let formatted = cleaned;
                                if (cleaned.length > 6) {
                                  formatted = `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
                                } else if (cleaned.length > 3) {
                                  formatted = `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
                                }
                                setPhone(formatted);
                                setPhoneError("");
                                setFormError("");
                              }}
                              keyboardType="numeric"
                              placeholder="09x xxx xxxx"
                              placeholderTextColor="#6B6B6A"
                              className="flex-1 text-text text-body h-full font-sans ml-2"
                            />
                          </View>
                          {phoneError ? (
                            <Text className="text-small text-error mt-1.5 ml-1">{phoneError}</Text>
                          ) : null}
                        </View>
                      </StaggeredChildren>

                      {/* Password */}
                      <StaggeredChildren index={2}>
                        <PasswordInput
                          value={password}
                          onChangeText={(text) => {
                            setPassword(text);
                            setPasswordError("");
                            setFormError("");
                          }}
                          error={passwordError}
                        />
                      </StaggeredChildren>

                      {/* Forgot password */}
                      <StaggeredChildren index={3}>
                        <Pressable
                          onPress={() => router.push("/forgot-password")}
                          className="self-start"
                        >
                          <Text className="text-caption text-brand font-semibold">
                            Quên mật khẩu?
                          </Text>
                        </Pressable>
                      </StaggeredChildren>

                      {/* Error */}
                      {formError && (
                        <StaggeredChildren index={4}>
                          <View className="flex-row items-center gap-2 bg-error-bg rounded-xl px-3 py-2.5 border border-error/20">
                            <Ionicons name="alert-circle" size={16} color="#FF3D00" />
                            <Text className="text-small text-error flex-1">{formError}</Text>
                          </View>
                        </StaggeredChildren>
                      )}

                      {/* Login button */}
                      <StaggeredChildren index={5}>
                        <Animated.View style={buttonAnimatedStyle}>
                          <Pressable
                            onPressIn={handlePressIn}
                            onPressOut={handlePressOut}
                            onPress={handleLogin}
                            disabled={isDisabled}
                            className="h-13 bg-brand rounded-xl items-center justify-center shadow-brand-glow active:bg-brand-light"
                            style={
                              isDisabled
                                ? { backgroundColor: "rgba(255, 102, 0, 0.35)" }
                                : {}
                            }
                          >
                            {isDisabled ? (
                              <ActivityIndicator color="#FFFFFF" size="small" />
                            ) : (
                              <Text className="text-btn text-white font-semibold tracking-wide">
                                Đăng nhập
                              </Text>
                            )}
                          </Pressable>
                        </Animated.View>
                      </StaggeredChildren>
                    </View>
                  </View>
                </View>
              </StaggeredChildren>

              {/* Register link */}
              <StaggeredChildren index={6}>
                <View className="flex-row justify-center items-center mt-6">
                  <Text className="text-caption text-text-muted">
                    Chưa có tài khoản?{" "}
                  </Text>
                  <Pressable onPress={() => router.push("/register")}>
                    <Text className="text-caption text-brand font-semibold">
                      Đăng ký ngay
                    </Text>
                  </Pressable>
                </View>
              </StaggeredChildren>
            </View>
          </ScrollableContent>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

function PasswordInput({
  value,
  onChangeText,
  error,
}: {
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
}) {
  const [visible, setVisible] = React.useState(false);

  return (
    <View>
      <Text className="text-small-bold text-text-muted mb-2 tracking-wide uppercase">
        Mật khẩu
      </Text>
      <View
        className={`flex-row items-center h-12 px-3 rounded-xl border ${
          error ? "border-error" : "border-white/10"
        } bg-white/5`}
      >
        <Ionicons
          name="lock-closed-outline"
          size={18}
          color={error ? "#FF3D00" : "#999"}
        />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={!visible}
          placeholder="••••••••"
          placeholderTextColor="#6B6B6A"
          className="flex-1 text-text text-body h-full font-sans ml-2"
        />
        <Pressable onPress={() => setVisible((v) => !v)} hitSlop={8}>
          <Ionicons
            name={visible ? "eye-off" : "eye"}
            size={18}
            color="#999"
          />
        </Pressable>
      </View>
      {error ? (
        <Text className="text-small text-error mt-1.5 ml-1">{error}</Text>
      ) : null}
    </View>
  );
}

function ScrollableContent({ children }: { children: React.ReactNode }) {
  const scrollRef = useRef<any>(null);
  return (
    <Animated.ScrollView
      ref={scrollRef}
      className="flex-1"
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      entering={FadeIn.duration(600)}
    >
      {children}
    </Animated.ScrollView>
  );
}
