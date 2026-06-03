import React, { useState } from 'react';
import { StyleSheet, View, Pressable, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function RegisterScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
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

  const validateConfirmPassword = (val: string) => {
    if (!val) {
      setConfirmPasswordError('Vui lòng nhập lại mật khẩu');
      return false;
    }
    if (val !== password) {
      setConfirmPasswordError('Mật khẩu nhập lại không trùng khớp');
      return false;
    }
    setConfirmPasswordError('');
    return true;
  };

  const handlePhoneChange = (val: string) => {
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

  const handleRegister = () => {
    const isPhoneValid = validatePhone(phone);
    const isPassValid = validatePassword(password);
    const isConfirmValid = validateConfirmPassword(confirmPassword);

    if (isPhoneValid && isPassValid && isConfirmValid) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        // Automatically direct to Login screen or straight to Home upon registration
        router.replace('/home');
      }, 1500);
    }
  };

  const isFormValid =
    phone.replace(/\s+/g, '').length === 10 &&
    password.length >= 6 &&
    confirmPassword === password;

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
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#A1A1A0" />
          </Pressable>

          <View style={styles.titleSection}>
            <ThemedText type="h2" style={styles.title}>Tạo tài khoản mới</ThemedText>
            <ThemedText type="caption" themeColor="textSecondary">Đăng ký nhanh chóng và dễ dàng</ThemedText>
          </View>

          <View style={styles.formSection}>
            <Input
              label="Số điện thoại"
              placeholder="09xx xxx xxx"
              value={phone}
              onChangeText={handlePhoneChange}
              keyboardType="phone-pad"
              iconName="phone-portrait-outline"
              error={phoneError}
              maxLength={12}
            />

            <Input
              label="Họ và tên (Tùy chọn)"
              placeholder="Nguyễn Văn A"
              value={name}
              onChangeText={setName}
              iconName="person-outline"
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

            <Input
              label="Xác nhận mật khẩu"
              placeholder="Nhập lại mật khẩu"
              value={confirmPassword}
              onChangeText={(val) => {
                setConfirmPassword(val);
                if (confirmPasswordError) validateConfirmPassword(val);
              }}
              secureTextEntry
              iconName="lock-closed-outline"
              error={confirmPasswordError}
            />

            <Button
              title="ĐĂNG KÝ"
              variant="primary"
              size="lg"
              onPress={handleRegister}
              disabled={!isFormValid || loading}
              loading={loading}
              style={styles.registerButton}
            />
          </View>

          <View style={styles.footerSection}>
            <ThemedText themeColor="textSecondary" type="caption">
              Đã có tài khoản?{' '}
            </ThemedText>
            <Pressable onPress={() => router.replace('/login')}>
              <ThemedText themeColor="brand" type="caption" style={styles.linkText}>
                Đăng nhập
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
  titleSection: {
    marginBottom: 32,
  },
  title: {
    marginBottom: 6,
  },
  formSection: {
    width: '100%',
    marginBottom: 24,
  },
  registerButton: {
    marginTop: 16,
  },
  linkText: {
    fontWeight: '600',
  },
  footerSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
});
