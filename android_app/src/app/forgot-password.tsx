import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Pressable, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1 = Phone request, 2 = OTP Code verification
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [loading, setLoading] = useState(false);

  // OTP State
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const otpRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handlePhoneSubmit = () => {
    if (!phone) {
      setPhoneError('Vui lòng nhập số điện thoại');
      return;
    }
    const cleanPhone = phone.replace(/\s+/g, '');
    if (!/^0\d{9}$/.test(cleanPhone)) {
      setPhoneError('Số điện thoại không hợp lệ');
      return;
    }

    setPhoneError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
      setTimer(60);
    }, 1200);
  };

  const handleOtpChange = (val: string, index: number) => {
    // Only accept numeric digit
    const cleaned = val.replace(/\D/g, '');
    const newOtp = [...otp];
    newOtp[index] = cleaned;
    setOtp(newOtp);

    // Auto-advance to next index if value is entered
    if (cleaned && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 fields are filled
    const fullyFilled = newOtp.every((digit) => digit !== '');
    if (fullyFilled && index === 5) {
      handleOtpVerify(newOtp.join(''));
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // If backspace is pressed on an empty block, go back to previous block
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    if (timer === 0) {
      setTimer(60);
      setOtp(['', '', '', '', '', '']);
      otpRefs.current[0]?.focus();
      // Mock API call to resend OTP
    }
  };

  const handleOtpVerify = (code: string) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.replace('/reset-password');
    }, 1200);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <ThemedView style={styles.container}>
          {/* Back button */}
          <Pressable
            style={styles.backButton}
            onPress={() => {
              if (step === 2) {
                setStep(1);
              } else {
                router.back();
              }
            }}
          >
            <Ionicons name="arrow-back" size={24} color="#A1A1A0" />
          </Pressable>

          {step === 1 ? (
            // STEP 1: Phone Request Layout
            <View style={styles.content}>
              <ThemedText type="h2" style={styles.title}>Quên mật khẩu?</ThemedText>
              <ThemedText type="caption" themeColor="textSecondary" style={styles.subtitle}>
                Nhập số điện thoại đăng ký tài khoản của bạn để nhận mã xác minh OTP
              </ThemedText>

              <Input
                label="Số điện thoại"
                placeholder="09xx xxx xxx"
                value={phone}
                onChangeText={(val) => {
                  const cleaned = val.replace(/\D/g, '');
                  let formatted = cleaned;
                  if (cleaned.length > 3 && cleaned.length <= 6) {
                    formatted = `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
                  } else if (cleaned.length > 6) {
                    formatted = `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 10)}`;
                  }
                  setPhone(formatted);
                }}
                keyboardType="phone-pad"
                iconName="phone-portrait-outline"
                error={phoneError}
                maxLength={12}
              />

              <Button
                title="GỬI MÃ OTP"
                variant="primary"
                size="lg"
                onPress={handlePhoneSubmit}
                loading={loading}
                style={styles.button}
              />
            </View>
          ) : (
            // STEP 2: OTP Verification Layout
            <View style={styles.content}>
              <ThemedText type="h2" style={styles.title}>Nhập mã OTP</ThemedText>
              <ThemedText type="caption" themeColor="textSecondary" style={styles.subtitle}>
                Mã xác minh đã được gửi đến số điện thoại {phone}. Nhập mã gồm 6 số bên dưới.
              </ThemedText>

              <View style={styles.otpGrid}>
                {otp.map((digit, i) => (
                  <TextInput
                    key={i}
                    ref={(ref) => (otpRefs.current[i] = ref)}
                    style={[
                      styles.otpBox,
                      {
                        borderColor: digit ? '#FF6600' : '#333332',
                        color: '#FFFFFF',
                      },
                    ]}
                    value={digit}
                    onChangeText={(val) => handleOtpChange(val, i)}
                    onKeyPress={(e) => handleKeyPress(e, i)}
                    keyboardType="numeric"
                    maxLength={1}
                    selectTextOnFocus
                    placeholder="-"
                    placeholderTextColor="#6B6B6A"
                  />
                ))}
              </View>

              <View style={styles.resendWrapper}>
                {timer > 0 ? (
                  <ThemedText themeColor="textSecondary" type="caption">
                    Gửi lại mã sau <ThemedText themeColor="brand" type="caption" style={styles.boldTimer}>{timer}s</ThemedText>
                  </ThemedText>
                ) : (
                  <Pressable onPress={handleResend}>
                    <ThemedText themeColor="brand" type="caption" style={styles.resendText}>
                      Gửi lại mã OTP
                    </ThemedText>
                  </Pressable>
                )}
              </View>

              <Button
                title="XÁC NHẬN"
                variant="primary"
                size="lg"
                onPress={() => handleOtpVerify(otp.join(''))}
                disabled={otp.some((d) => d === '') || loading}
                loading={loading}
                style={styles.button}
              />
            </View>
          )}
        </ThemedView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#0A0A0A',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  content: {
    width: '100%',
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    marginBottom: 32,
  },
  button: {
    marginTop: 24,
  },
  otpGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    width: '100%',
  },
  otpBox: {
    width: 44,
    height: 52,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#1C1C1B',
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
  },
  resendWrapper: {
    alignItems: 'center',
    marginBottom: 24,
  },
  resendText: {
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  boldTimer: {
    fontWeight: '700',
  },
});
