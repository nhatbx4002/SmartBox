import React, { useEffect, useRef, useState } from "react";
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
import { authService } from "../../src/services/auth";

function formatPhoneNumber(text: string) {
  const cleaned = text.replace(/\D/g, "").slice(0, 10);
  if (cleaned.length > 6) return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
  if (cleaned.length > 3) return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
  return cleaned;
}

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPhoneFocused, setIsPhoneFocused] = useState(false);

  const otpRefs = [
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
  ];

  const buttonScale = useSharedValue(1);
  const buttonOpacity = useSharedValue(1);

  useEffect(() => {
    if (step !== "otp" || timer <= 0) {
      if (timer <= 0) setCanResend(true);
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [step, timer]);

  const handleRequestOTP = async () => {
    const rawPhone = phone.replace(/\s/g, "");
    if (rawPhone.length !== 10 || !rawPhone.startsWith("0")) {
      setPhoneError("Số điện thoại không hợp lệ.");
      return;
    }

    try {
      setIsLoading(true);
      setPhoneError("");
      await authService.sendForgotPasswordOtp({ phone: rawPhone });
      setStep("otp");
      setTimer(60);
      setCanResend(false);
      setTimeout(() => otpRefs[0].current?.focus(), 100);
      Alert.alert("OTP đã được tạo", "Backend sẽ log OTP trong console server.");
    } catch (error: any) {
      Alert.alert("Không thể gửi OTP", error?.message || "Có lỗi xảy ra.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (text: string, index: number) => {
    const next = [...otp];
    next[index] = text.slice(-1);
    setOtp(next);
    setOtpError("");

    if (text && index < 5) {
      otpRefs[index + 1].current?.focus();
    }
  };

  const handleOtpKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

  const handleVerifyOTP = async () => {
    const fullOtp = otp.join("");
    if (fullOtp.length !== 6) {
      setOtpError("Vui lòng nhập đủ 6 số OTP.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await authService.verifyOtp({
        phone: phone.replace(/\s/g, ""),
        code: fullOtp,
      });
      router.replace({
        pathname: "/reset-password",
        params: { token: response.data.resetToken },
      });
    } catch (error: any) {
      const message = error?.message || "Xác thực OTP thất bại.";
      setOtpError(message);
      Alert.alert("OTP không hợp lệ", message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;
    setOtp(["", "", "", "", "", ""]);
    await handleRequestOTP();
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
            <Text className="text-h1 text-white font-sans text-center">
              {step === "phone" ? "Quên mật khẩu" : "Xác thực OTP"}
            </Text>
            <Text className="text-caption text-text-secondary mt-one text-center px-two">
              {step === "phone"
                ? "Nhập số điện thoại để lấy mã OTP"
                : `Nhập mã OTP đã được log cho số ${phone}`}
            </Text>
          </View>

          <View className="bg-glass p-four rounded-panel border border-border gap-four z-10">
            {step === "phone" ? (
              <View className="gap-four">
                <View>
                  <Text className="text-small-bold text-text-secondary mb-two">Số điện thoại</Text>
                  <View className={`flex-row items-center h-12 px-three bg-surface-glass border rounded-input ${phoneError ? "border-error" : isPhoneFocused ? "border-border-focused" : "border-border"}`}>
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

                <Animated.View style={animatedButtonStyle}>
                  <Pressable
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    onPress={handleRequestOTP}
                    disabled={isLoading}
                    className="h-12 bg-brand rounded-button justify-center items-center shadow-brand-glow active:bg-brand-light"
                  >
                    {isLoading ? <ActivityIndicator color="#FFFFFF" size="small" /> : <Text className="text-btn text-white">Gửi mã OTP</Text>}
                  </Pressable>
                </Animated.View>
              </View>
            ) : (
              <View className="gap-four">
                <View>
                  <Text className="text-small-bold text-text-secondary mb-three text-center">Mã xác thực OTP</Text>
                  <View className="flex-row justify-between mb-two gap-two">
                    {otp.map((digit, idx) => (
                      <TextInput
                        key={idx}
                        ref={otpRefs[idx]}
                        value={digit}
                        onChangeText={(text) => handleOtpChange(text, idx)}
                        onKeyPress={(e) => handleOtpKeyPress(e, idx)}
                        keyboardType="numeric"
                        maxLength={1}
                        placeholder="•"
                        placeholderTextColor="#6B6B6A"
                        className={`w-11 h-12 text-center text-otp bg-surface-glass border rounded-input text-white font-mono ${
                          otpError ? "border-error" : digit ? "border-border-focused" : "border-border"
                        }`}
                      />
                    ))}
                  </View>
                  {otpError ? <Text className="text-small text-error text-center mt-two">{otpError}</Text> : null}
                </View>

                <View className="items-center">
                  {canResend ? (
                    <Pressable onPress={handleResendOtp}>
                      <Text className="text-caption text-brand font-semibold">Gửi lại OTP</Text>
                    </Pressable>
                  ) : (
                    <Text className="text-caption text-text-muted">
                      Gửi lại sau <Text className="text-brand font-mono">{timer}s</Text>
                    </Text>
                  )}
                </View>

                <Animated.View style={animatedButtonStyle}>
                  <Pressable
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    onPress={handleVerifyOTP}
                    disabled={isLoading}
                    className="h-12 bg-brand rounded-button justify-center items-center shadow-brand-glow active:bg-brand-light"
                  >
                    {isLoading ? <ActivityIndicator color="#FFFFFF" size="small" /> : <Text className="text-btn text-white">Xác thực & tiếp tục</Text>}
                  </Pressable>
                </Animated.View>

                <Pressable onPress={() => setStep("phone")} className="items-center">
                  <Text className="text-caption text-text-secondary">Thay đổi số điện thoại</Text>
                </Pressable>
              </View>
            )}
          </View>

          <View className="flex-row justify-center items-center mt-four z-10">
            <Pressable onPress={() => router.push("/login")} className="flex-row items-center gap-one">
              <Ionicons name="arrow-back-outline" size={16} color="#FF6600" />
              <Text className="text-caption text-brand font-semibold">Quay lại đăng nhập</Text>
            </Pressable>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
