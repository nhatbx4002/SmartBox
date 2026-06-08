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

export default function RegisterScreen() {
  const router = useRouter();

  // Form states
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Focus states
  const [isNameFocused, setIsNameFocused] = useState(false);
  const [isPhoneFocused, setIsPhoneFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] = useState(false);

  // Error states
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // Button spring values
  const buttonScale = useSharedValue(1);
  const buttonOpacity = useSharedValue(1);

  // Phone number formatter: "09x xxx xxxx"
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

  const validate = () => {
    let isValid = true;

    if (!fullName.trim()) {
      setNameError("Họ và tên không được trùng.");
      isValid = false;
    } else {
      setNameError("");
    }

    const rawPhone = phone.replace(/\s/g, "");
    if (rawPhone.length !== 10 || !rawPhone.startsWith("0")) {
      setPhoneError("Số điện thoại phải bắt đầu bằng số 0.");
      isValid = false;
    } else {
      setPhoneError("");
    }

    if (password.length < 6) {
      setPasswordError("Mật khẩu ít nhất phải có 6 kí tự.");
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

  const handleRegister = () => {
    if (!validate()) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Route back to login upon successful registration
      router.replace("/login");
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
          
          {/* Ambient Background Glow Effects */}
          <View className="absolute top-[-50px] right-[-50px] w-64 h-64 rounded-full bg-brand-glow opacity-25" />
          <View className="absolute bottom-[-80px] left-[-80px] w-80 h-80 rounded-full bg-brand-glow opacity-20" />
          
          {/* Header */}
          <View className="items-center mb-six z-10">
            <Text className="text-h1 text-white font-sans text-center">Tạo tài khoản</Text>
            <Text className="text-caption text-text-secondary mt-one text-center">Tham gia hệ thống của OmniBox</Text>
          </View>

          {/* Form Card */}
          <View className="bg-glass p-four rounded-panel border border-border gap-four shadow-lg z-10">
            
            {/* Full Name Input */}
            <View>
              <Text className="text-small-bold text-text-secondary mb-two">Họ và tên</Text>
              <View 
                className={`flex-row items-center h-12 px-three bg-surface-glass border rounded-input transition-colors duration-200 ${
                  nameError 
                    ? "border-error" 
                    : isNameFocused 
                      ? "border-border-focused" 
                      : "border-border"
                }`}
              >
                <Ionicons 
                  name="person-outline" 
                  size={20} 
                  color={nameError ? "#FF3D00" : isNameFocused ? "#FF6600" : "#A1A1A0"} 
                  className="mr-two"
                />
                <TextInput
                  value={fullName}
                  onChangeText={(text) => { setFullName(text); if (nameError) setNameError(""); }}
                  onFocus={() => setIsNameFocused(true)}
                  onBlur={() => setIsNameFocused(false)}
                  placeholder="Nguyễn Văn A"
                  placeholderTextColor="#6B6B6A"
                  className="flex-1 text-text text-body h-full font-sans"
                />
              </View>
              {nameError ? (
                <Text className="text-small text-error mt-two ml-one">{nameError}</Text>
              ) : null}
            </View>

            {/* Phone Input */}
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
                  placeholder="09x xxx xxxx"
                  placeholderTextColor="#6B6B6A"
                  className="flex-1 text-text text-body h-full font-sans"
                />
              </View>
              {phoneError ? (
                <Text className="text-small text-error mt-two ml-one">{phoneError}</Text>
              ) : null}
            </View>

            {/* Password Input */}
            <View>
              <Text className="text-small-bold text-text-secondary mb-two">Mật khẩu</Text>
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

            {/* Confirm Password Input */}
            <View>
              <Text className="text-small-bold text-text-secondary mb-two">Xác nhận mật khẩu</Text>
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

            {/* Register Button */}
            <Animated.View style={animatedButtonStyle} className="mt-two">
              <Pressable
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={handleRegister}
                disabled={isLoading}
                className="h-12 bg-brand rounded-button justify-center items-center shadow-brand-glow active:bg-brand-light"
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text className="text-btn text-white">Đăng ký</Text>
                )}
              </Pressable>
            </Animated.View>
            
          </View>

          {/* Back to Login Redirect */}
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
