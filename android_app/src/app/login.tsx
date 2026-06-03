import React, { useState } from 'react';
import { StyleSheet, View, Pressable, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function LoginScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  const validatePhone = (val: string) => {
    if (!val) {
      setPhoneError('Vui lòng nhập số điện thoại');
      return false;
    }
    const cleanPhone = val.replace(/\s+/g, '');
    if (!/^0\d{9}$/.test(cleanPhone)) {
      setPhoneError('Số điện thoại phải gồm 10 chữ số và bắt đầu bằng số 0');
      return false;
    }
    setPhoneError('');
    return true;
  };

  const validatePassword = (val: string) => {
    if (!val) {
      setPasswordError('Vui lòng nhập mật khẩu');
      return false;
    }
    if (val.length < 6) {
      setPasswordError('Mật khẩu tối thiểu 6 ký tự');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handlePhoneChange = (val: string) => {
    // Format input to 09x xxx xxxx if they want
    const cleaned = ('' + val).replace(/\D/g, '');
    let formatted = cleaned;
    if (cleaned.length > 3 && cleaned.length <= 6) {
      formatted = `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
    } else if (cleaned.length > 6) {
      formatted = `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 10)}`;
    }
    setPhone(formatted);
    if (phoneError) validatePhone(formatted);
  };

  const handleLogin = () => {
    const isPhoneValid = validatePhone(phone);
    const isPassValid = validatePassword(password);

    if (isPhoneValid && isPassValid) {
      setLoading(true);
      // Simulate API call delay
      setTimeout(() => {
        setLoading(false);
        router.replace('/home');
      }, 1500);
    }
  };

  const isFormValid = phone.replace(/\s+/g, '').length === 10 && password.length >= 6;

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
          {/* Logo and Brand Section */}
          <View style={styles.headerSection}>
            <View style={styles.logoBackground}>
              <Ionicons name="cube" size={32} color="#FF6600" />
            </View>
            <ThemedText type="h1" style={styles.brandTitle}>SmartBox</ThemedText>
            <ThemedText type="caption" themeColor="textSecondary">Smart Locker</ThemedText>
          </View>

          {/* Welcome Titles */}
          <View style={styles.titleSection}>
            <ThemedText type="h2" style={styles.welcomeText}>Chào mừng bạn!</ThemedText>
            <ThemedText type="caption" themeColor="textSecondary">Đăng nhập để tiếp tục sử dụng hệ thống tủ</ThemedText>
          </View>

          {/* Form Inputs */}
          <View style={styles.formSection}>
            <Input
              label="Số điện thoại"
              placeholder="09xx xxx xxx"
              value={phone}
              onChangeText={handlePhoneChange}
              keyboardType="phone-pad"
              iconName="phone-portrait-outline"
              error={phoneError}
              maxLength={12} // 10 digits + 2 spaces
            />

            <Input
              label="Mật khẩu"
              placeholder="Nhập mật khẩu"
              value={password}
              onChangeText={(val) => {
                setPassword(val);
                if (passwordError) validatePassword(val);
              }}
              secureTextEntry
              iconName="lock-closed-outline"
              error={passwordError}
            />

            <View style={styles.forgotPasswordWrapper}>
              <Pressable onPress={() => router.push('/forgot-password')}>
                <ThemedText themeColor="brand" type="caption" style={styles.linkText}>
                  Quên mật khẩu?
                </ThemedText>
              </Pressable>
            </View>

            <Button
              title="ĐĂNG NHẬP"
              variant="primary"
              size="lg"
              onPress={handleLogin}
              disabled={!isFormValid || loading}
              loading={loading}
              style={styles.loginButton}
            />
          </View>

          {/* Register Redirect */}
          <View style={styles.footerSection}>
            <ThemedText themeColor="textSecondary" type="caption">
              Chưa có tài khoản?{' '}
            </ThemedText>
            <Pressable onPress={() => router.push('/register')}>
              <ThemedText themeColor="brand" type="caption" style={styles.linkText}>
                Đăng ký ngay
              </ThemedText>
            </Pressable>
          </View>
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
    justifyContent: 'center',
    paddingVertical: 48,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoBackground: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#1C1C1B',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 2,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  welcomeText: {
    marginBottom: 6,
  },
  formSection: {
    width: '100%',
    marginBottom: 24,
  },
  forgotPasswordWrapper: {
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  loginButton: {
    marginTop: 8,
  },
  linkText: {
    fontWeight: '600',
  },
  footerSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
});
