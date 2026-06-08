import React, { useState, useEffect, useRef } from "react";
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

export default function ForgotPasswordScreen() {
  const router = useRouter();

  // C?c b??c: "phone" (nh?p s? ?i?n tho?i) | "otp" (x?c th?c m? OTP)
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");

  // OTP State
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Focus state cho vi?n input s? ?i?n tho?i
  const [isPhoneFocused, setIsPhoneFocused] = useState(false);

  // Refs cho ? OTP nh?p li?u
  const otpRefs = [
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
  ];

  // Tr?ng th?i t?i c?a n?t b?m
  const [isLoading, setIsLoading] = useState(false);

  // Hi?u ?ng spring cho n?t b?m
  const buttonScale = useSharedValue(1);
  const buttonOpacity = useSharedValue(1);

  // ??m ng??c th?i gian g?i l?i m? OTP
  useEffect(() => {
    let interval: any;
    if (step === "otp" && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  // ??nh d?ng s? ?i?n tho?i t? ??ng theo m?u "09x xxx xxxx"
  const formatPhoneNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, "");
    const limited = cleaned.slice(0, 10);
    
    let formatted = limited;
    if (limited.length > 3 && limited.length <= 6) {
      formatted = `${limited.slice(0, 3)} ${limited.slice(3)}`;
    } else if (limited.length > 6) {
      formatted = `${limited.slice(0, 3)} ${limited.slice(3, 6)} ${limited.slice(6)}`;
    }
    return formatted;
  };

  const handlePhoneChange = (text: string) => {
    const formatted = formatPhoneNumber(text);
    setPhone(formatted);
    if (phoneError) setPhoneError("");
  };

  // G?i m? OTP x?c nh?n
  const handleRequestOTP = () => {
    const rawPhone = phone.replace(/\s/g, "");
    if (rawPhone.length !== 10 || !rawPhone.startsWith("0")) {
      setPhoneError("Số điện thoại không hợp lệ (Phải bắt đầu bằng số 0 và có 10 chữ số).");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep("otp");
      setTimer(60);
      setCanResend(false);
      // T? ??ng focus ? ??u ti?n
      setTimeout(() => otpRefs[0].current?.focus(), 100);
    }, 1500);
  };

  // X? l? thay ??i k? t? ? OTP
  const handleOtpChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text.slice(-1); // ch? nh?n 1 k? t? cu?i
    setOtp(newOtp);
    if (otpError) setOtpError("");

    // T? ??ng nh?y sang ? ti?p theo n?u c? k? t?
    if (text && index < 5) {
      otpRefs[index + 1].current?.focus();
    }
  };

  // X? l? n?t xo? ng??c
  const handleOtpKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

  // X?c th?c m? OTP v? chuy?n sang m?n ??t l?i m?t kh?u m?i
  const handleVerifyOTP = () => {
    const fullOtp = otp.join("");
    if (fullOtp.length < 6) {
      setOtpError("Vui lòng nhập mã có 6 chữ số.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Gi? l?p OTP ??ng (v? d?: b?t k? m? 6 s? n?o ??y ??)
      router.replace("/reset-password");
    }, 1500);
  };

  const handleResendOtp = () => {
    if (!canResend) return;
    setOtp(["", "", "", "", "", ""]);
    setTimer(60);
    setCanResend(false);
    otpRefs[0].current?.focus();
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
          
          {/* Ambient Background Glow Effect */}
          <View className="absolute top-[-50px] left-[-50px] w-64 h-64 rounded-full bg-brand-glow opacity-25" />
          <View className="absolute bottom-[-80px] right-[-80px] w-80 h-80 rounded-full bg-brand-glow opacity-20" />

          {/* Header ti?u ?? */}
          <View className="items-center mb-six z-10">
            <Text className="text-h1 text-white font-sans text-center">
              {step === "phone" ? "Quên mật khẩu" : "Xác thực mã OTP"}
            </Text>
            <Text className="text-caption text-text-secondary mt-one text-center px-two">
              {step === "phone" 
                ? "Nhập số điện thoại để nhận mã OTP"
                : `Chúng tôi đã gửi mã xác minh về số điện thoại: ${phone}`}
            </Text>
          </View>

          {/* Form Card */}
          <View className="bg-glass p-four rounded-panel border border-border gap-four shadow-lg z-10">
            {step === "phone" ? (
              // B??C 1: Nh?p S? ?i?n Tho?i
              <View className="gap-four">
                <View>
                  <Text className="text-small-bold text-text-secondary mb-two">Số điện thoại</Text>
                  <View 
                    className={`flex-row items-center h-12 px-three bg-surface-glass border rounded-input transition-colors duration-200 ${
                      phoneError 
                        ? "border-error" 
                        : isPhoneFocused 
                          ? "border-border-focused" 
                          : "border-border"
                    }`}
                  >
                    <Ionicons 
                      name="phone-portrait-outline" 
                      size={20} 
                      color={phoneError ? "#FF3D00" : isPhoneFocused ? "#FF6600" : "#A1A1A0"} 
                      className="mr-two"
                    />
                    <TextInput
                      value={phone}
                      onChangeText={handlePhoneChange}
                      onFocus={() => setIsPhoneFocused(true)}
                      onBlur={() => setIsPhoneFocused(false)}
                      keyboardType="numeric"
                      placeholder=" 09x xxx xxxx"
                      placeholderTextColor="#6B6B6A"
                      className="flex-1 text-text text-body h-full font-sans"
                    />
                  </View>
                  {phoneError ? (
                    <Text className="text-small text-error mt-two ml-one">{phoneError}</Text>
                  ) : null}
                </View>

                {/* N?t g?i y?u c?u */}
                <Animated.View style={animatedButtonStyle}>
                  <Pressable
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    onPress={handleRequestOTP}
                    disabled={isLoading}
                    className="h-12 bg-brand rounded-button justify-center items-center shadow-brand-glow active:bg-brand-light"
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#FFFFFF" size="small" />
                    ) : (
                      <Text className="text-btn text-white">Gửi Mã OTP</Text>
                    )}
                  </Pressable>
                </Animated.View>
              </View>
            ) : (
              // B??C 2: Nh?p M? X?c Th?c OTP
              <View className="gap-four">
                <View>
                  <Text className="text-small-bold text-text-secondary mb-three text-center">Mã xác thực OTP</Text>
                  
                  {/* B? c?c 6 ? nh?p m? OTP */}
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
                        placeholder="?"
                        placeholderTextColor="#6B6B6A"
                        className={`w-11 h-12 text-center text-otp bg-surface-glass border rounded-input text-white font-mono ${
                          otpError 
                            ? "border-error" 
                            : digit 
                              ? "border-border-focused" 
                              : "border-border"
                        }`}
                      />
                    ))}
                  </View>
                  {otpError ? (
                    <Text className="text-small text-error text-center mt-two">{otpError}</Text>
                  ) : null}
                </View>

                {/* Th?ng tin g?i l?i m? OTP */}
                <View className="items-center">
                  {canResend ? (
                    <Pressable onPress={handleResendOtp}>
                      <Text className="text-caption text-brand font-semibold">G?i l?i m? OTP</Text>
                    </Pressable>
                  ) : (
                    <Text className="text-caption text-text-muted">
                      G?i l?i m? sau <Text className="text-brand font-mono">{timer}s</Text>
                    </Text>
                  )}
                </View>

                {/* N?t x?c nh?n m? OTP */}
                <Animated.View style={animatedButtonStyle}>
                  <Pressable
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    onPress={handleVerifyOTP}
                    disabled={isLoading}
                    className="h-12 bg-brand rounded-button justify-center items-center shadow-brand-glow active:bg-brand-light"
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#FFFFFF" size="small" />
                    ) : (
                      <Text className="text-btn text-white">X?c Th?c & Ti?p T?c</Text>
                    )}
                  </Pressable>
                </Animated.View>

                {/* Thay ??i s? ?i?n tho?i */}
                <Pressable onPress={() => setStep("phone")} className="items-center">
                  <Text className="text-caption text-text-secondary">Thay đổi số điện thoại</Text>
                </Pressable>
              </View>
            )}
          </View>

          {/* Quay l?i trang ??ng nh?p */}
          <View className="flex-row justify-center items-center mt-four z-10">
            <Pressable onPress={() => router.push("/login")} className="flex-row items-center gap-one">
              <Ionicons name="arrow-back-outline" size={16} color="#FF6600" />
              <Text className="text-caption text-brand font-semibold">Quay lại đăng nhâp</Text>
            </Pressable>
          </View>

        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
