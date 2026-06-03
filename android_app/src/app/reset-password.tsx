import React, { useState } from 'react';
import { StyleSheet, View, Pressable, KeyboardAvoidingView, Platform, ScrollView, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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
      setConfirmPasswordError('Mật khẩu xác nhận không trùng khớp');
      return false;
    }
    setConfirmPasswordError('');
    return true;
  };

  const handleSubmit = () => {
    const isPassValid = validatePassword(password);
    const isConfirmValid = validateConfirmPassword(confirmPassword);

    if (isPassValid && isConfirmValid) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setShowSuccessModal(true);
      }, 1500);
    }
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
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#A1A1A0" />
          </Pressable>

          <View style={styles.titleSection}>
            <ThemedText type="h2" style={styles.title}>Đặt mật khẩu mới</ThemedText>
            <ThemedText type="caption" themeColor="textSecondary">Nhập mật khẩu mới của bạn và hoàn tất quá trình khôi phục</ThemedText>
          </View>

          <View style={styles.formSection}>
            <Input
              label="Mật khẩu mới"
              placeholder="Nhập mật khẩu mới"
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
              placeholder="Nhập lại mật khẩu mới"
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
              title="ĐẶT MẬT KHẨU MỚI"
              variant="primary"
              size="lg"
              onPress={handleSubmit}
              disabled={password.length < 6 || confirmPassword !== password || loading}
              loading={loading}
              style={styles.button}
            />
          </View>

          {/* Success Dialog Modal */}
          <Modal
            transparent
            visible={showSuccessModal}
            animationType="fade"
            onRequestClose={() => {}}
          >
            <View style={styles.modalBackdrop}>
              <View style={styles.modalContent}>
                <View style={styles.successIconWrapper}>
                  <Ionicons name="checkmark-circle" size={56} color="#00C853" />
                </View>
                
                <ThemedText type="h2" style={styles.modalTitle}>
                  Thành công!
                </ThemedText>
                
                <ThemedText type="body" themeColor="textSecondary" style={styles.modalMessage}>
                  Mật khẩu của bạn đã được thay đổi thành công. Bạn có thể sử dụng mật khẩu mới này để đăng nhập.
                </ThemedText>

                <Button
                  title="ĐĂNG NHẬP NGAY"
                  variant="primary"
                  size="md"
                  onPress={() => {
                    setShowSuccessModal(false);
                    router.replace('/login');
                  }}
                  fullWidth
                />
              </View>
            </View>
          </Modal>
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
  },
  button: {
    marginTop: 16,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#1C1C1B',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333332',
  },
  successIconWrapper: {
    marginBottom: 16,
  },
  modalTitle: {
    marginBottom: 12,
  },
  modalMessage: {
    textAlign: 'center',
    marginBottom: 24,
  },
});
