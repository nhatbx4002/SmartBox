import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Pressable, ScrollView, Modal, Clipboard, ToastAndroid, Platform, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';

// Mock rentals dictionary
const RENTALS_DATA: Record<string, any> = {
  'r1': {
    id: 'r1',
    cabinetName: 'A1',
    size: 'Nhỏ',
    locationName: 'Đại học Bách Khoa',
    status: 'active',
    code: '123456',
    expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(), // 2h 30m from now
    openCount: 1,
    maxOpens: 2,
    startedAt: '03/06/2026, 10:00',
    paymentMethod: 'VietQR',
    planName: 'Gói Một lần (15.000đ)',
    logs: [
      { time: '10:00', action: 'Mở tủ' },
      { time: '10:05', action: 'Đóng tủ' },
      { time: '10:30', action: 'Mở tủ' },
    ],
  },
  'r2': {
    id: 'r2',
    cabinetName: 'B2',
    size: 'Lớn',
    locationName: 'Đại học Bách Khoa',
    status: 'completed',
    code: '654321',
    expiresAt: '2026-06-02T14:30:00Z',
    openCount: 2,
    maxOpens: 2,
    startedAt: '02/06/2026, 09:00',
    paymentMethod: 'VietQR',
    planName: 'Gói Một lần (30.000đ)',
    logs: [
      { time: '09:00', action: 'Mở tủ' },
      { time: '09:05', action: 'Đóng tủ' },
      { time: '14:25', action: 'Mở tủ' },
      { time: '14:30', action: 'Đóng tủ & Trả tủ' },
    ],
  },
  'r3': {
    id: 'r3',
    cabinetName: 'A3',
    size: 'Nhỏ',
    locationName: 'Ký túc xá Bách Khoa',
    status: 'expired',
    code: '987654',
    expiresAt: '2026-06-01T10:00:00Z',
    openCount: 0,
    maxOpens: 2,
    startedAt: '01/06/2026, 10:00',
    paymentMethod: 'Momo',
    planName: 'Gói Một lần (15.000đ)',
    logs: [],
  },
};

export default function RentalDetailScreen() {
  const router = useRouter();
  const { id, showQR, unlock } = useLocalSearchParams<{ id: string; showQR?: string; unlock?: string }>();
  const rentalId = id || 'r1';
  const rental = RENTALS_DATA[rentalId] || RENTALS_DATA['r1'];

  // State Management
  const [timeLeft, setTimeLeft] = useState(() => {
    if (rental.status === 'completed') return 'Đã hoàn thành';
    if (rental.status === 'expired') return 'Đã hết hạn';
    return '';
  });
  const [countdownColor, setCountdownColor] = useState<'textSecondary' | 'warning' | 'error'>(() => {
    if (rental.status === 'expired') return 'error';
    return 'textSecondary';
  });
  const [copied, setCopied] = useState(false);
  
  // Modals Visibility
  const [qrModalVisible, setQrModalVisible] = useState(showQR === 'true');
  const [returnModalVisible, setReturnModalVisible] = useState(false);
  
  // Unlock Cabinet Mock Flow states
  const [unlocking, setUnlocking] = useState(false);
  const [cabinetUnlocked, setCabinetUnlocked] = useState(false);
  const [unlockCountdown, setUnlockCountdown] = useState(30);

  // Dynamic countdown timer for rental expiry
  useEffect(() => {
    if (rental.status !== 'active') return;

    const targetTime = new Date(rental.expiresAt).getTime();

    const updateTimer = () => {
      const now = Date.now();
      const diff = targetTime - now;

      if (diff <= 0) {
        setTimeLeft('Đã hết hạn');
        setCountdownColor('error');
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (hours > 0) {
        setTimeLeft(`Còn ${hours} giờ ${minutes} phút`);
        setCountdownColor('textSecondary');
      } else {
        setTimeLeft(`Còn ${minutes} phút ${seconds} giây`);
        // Under 10 minutes turns error red, under 1h turns warning yellow
        if (minutes < 10) {
          setCountdownColor('error');
        } else {
          setCountdownColor('warning');
        }
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [rental]);

  // Handle Copy OTP to clipboard
  const handleCopyOtp = useCallback(() => {
    Clipboard.setString(rental.code);
    setCopied(true);
    if (Platform.OS === 'android') {
      ToastAndroid.show('Đã sao chép mã OTP!', ToastAndroid.SHORT);
    }
    setTimeout(() => setCopied(false), 2000);
  }, [rental.code]);

  // Unlock Cabinet Action
  const handleUnlockCabinet = useCallback(() => {
    if (rental.openCount >= rental.maxOpens) {
      Alert.alert('Lỗi', 'Đã đạt giới hạn số lần mở tủ tối đa!');
      return;
    }
    setUnlocking(true);
    setTimeout(() => {
      setUnlocking(false);
      setCabinetUnlocked(true);
      setUnlockCountdown(30);
    }, 2000);
  }, [rental.openCount, rental.maxOpens]);

  // Handle unlock countdown mock timer with safe state updates
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (cabinetUnlocked) {
      interval = setInterval(() => {
        setUnlockCountdown((prev) => {
          if (prev <= 1) {
            setCabinetUnlocked(false);
            return 30; // reset
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [cabinetUnlocked]);

  // Trigger unlock if parameter set
  useEffect(() => {
    if (unlock === 'true' && rental.status === 'active') {
      const timer = setTimeout(() => {
        handleUnlockCabinet();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [unlock, rental.status, handleUnlockCabinet]);

  const handleReturnLocker = () => {
    setReturnModalVisible(false);
    setUnlocking(true);
    setTimeout(() => {
      setUnlocking(false);
      Alert.alert('Thành công', 'Đã trả tủ thành công. Cảm ơn bạn đã sử dụng dịch vụ!', [
        { text: 'OK', onPress: () => router.replace('/home') }
      ]);
    }, 1500);
  };

  const isCompleted = rental.status === 'completed';
  const isLockerActive = rental.status === 'active';
  const maxOpensReached = rental.openCount >= rental.maxOpens;

  return (
    <ThemedView style={styles.container}>
      
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#A1A1A0" />
        </Pressable>
        <ThemedText type="h3">Chi tiết thuê tủ</ThemedText>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Main Details Card */}
        <View style={styles.detailCard}>
          {/* QR Code Container */}
          {isLockerActive ? (
            <Pressable style={styles.qrContainer} onPress={() => setQrModalVisible(true)}>
              <QRCode
                value={`smartbox-rental-${rental.id}-auth-token`}
                size={180}
                backgroundColor="#FFFFFF"
                color="#000000"
              />
              <ThemedText type="small" themeColor="textMuted" style={styles.qrHint}>
                Bấm vào để phóng to QR quét tại tủ
              </ThemedText>
            </Pressable>
          ) : (
            <View style={styles.inactiveQrPlaceholder}>
              <Ionicons
                name={isCompleted ? 'checkmark-circle' : 'alert-circle'}
                size={64}
                color={isCompleted ? '#00C853' : '#FF3D00'}
              />
              <ThemedText type="bodyBold" style={styles.inactiveQrText}>
                {isCompleted ? 'Đã trả tủ thành công' : 'Đã hết hạn thuê tủ'}
              </ThemedText>
            </View>
          )}

          {/* OTP Box */}
          {isLockerActive && (
            <Pressable style={styles.otpWrapper} onPress={handleCopyOtp}>
              <View style={styles.otpMain}>
                <ThemedText type="caption" themeColor="textSecondary">Mã OTP mở tủ thủ công:</ThemedText>
                <ThemedText type="otpCode" themeColor="brand">{rental.code.split('').join(' ')}</ThemedText>
              </View>
              <View style={styles.copyIconWrapper}>
                <Ionicons name={copied ? 'checkmark' : 'copy-outline'} size={20} color={copied ? '#00C853' : '#A1A1A0'} />
                {copied && <ThemedText type="small" themeColor="success">Copied</ThemedText>}
              </View>
            </Pressable>
          )}

          {/* Metadata Grid */}
          <View style={styles.metadataGrid}>
            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <ThemedText type="small" themeColor="textSecondary">Vị trí</ThemedText>
                <ThemedText type="bodyBold" numberOfLines={1}>{rental.locationName}</ThemedText>
              </View>
              <View style={styles.metaItem}>
                <ThemedText type="small" themeColor="textSecondary">Số ngăn</ThemedText>
                <ThemedText type="bodyBold">Ngăn {rental.cabinetName} (Cỡ {rental.size})</ThemedText>
              </View>
            </View>
            <View style={styles.metaDivider} />
            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <ThemedText type="small" themeColor="textSecondary">Thời gian thuê</ThemedText>
                <ThemedText type="bodyBold" themeColor={countdownColor}>{timeLeft}</ThemedText>
              </View>
              <View style={styles.metaItem}>
                <ThemedText type="small" themeColor="textSecondary">Số lần mở</ThemedText>
                <ThemedText type="bodyBold">{rental.openCount}/{rental.maxOpens} lần</ThemedText>
              </View>
            </View>
          </View>
        </View>

        {/* Invoice details summary */}
        <View style={styles.sectionCard}>
          <ThemedText type="bodyBold" style={styles.sectionTitle}>Thông tin hoá đơn</ThemedText>
          <View style={styles.infoRow}>
            <ThemedText type="caption" themeColor="textSecondary">Gói thuê:</ThemedText>
            <ThemedText type="caption">{rental.planName}</ThemedText>
          </View>
          <View style={styles.infoRow}>
            <ThemedText type="caption" themeColor="textSecondary">Bắt đầu lúc:</ThemedText>
            <ThemedText type="caption">{rental.startedAt}</ThemedText>
          </View>
          <View style={styles.infoRow}>
            <ThemedText type="caption" themeColor="textSecondary">Thanh toán qua:</ThemedText>
            <ThemedText type="caption">{rental.paymentMethod}</ThemedText>
          </View>
        </View>

        {/* Activity Logs */}
        {rental.logs && rental.logs.length > 0 && (
          <View style={styles.sectionCard}>
            <ThemedText type="bodyBold" style={styles.sectionTitle}>Lịch sử hoạt động</ThemedText>
            {rental.logs.map((log: any, idx: number) => (
              <View key={idx} style={styles.logRow}>
                <View style={styles.logDot} />
                <ThemedText type="caption" style={styles.logTime}>{log.time}</ThemedText>
                <ThemedText type="caption">{log.action}</ThemedText>
              </View>
            ))}
          </View>
        )}

        {/* Dynamic Buttons Area */}
        {isLockerActive && (
          <View style={styles.actionsContainer}>
            <Button
              title={maxOpensReached ? "ĐÃ ĐẠT GIỚI HẠN MỞ TỦ" : "MỞ TỦ NGAY"}
              variant="primary"
              size="lg"
              onPress={handleUnlockCabinet}
              disabled={maxOpensReached || unlocking}
              loading={unlocking}
              style={styles.actionBtn}
            />
            <Button
              title="Hoàn tất trả tủ"
              variant="secondary"
              size="lg"
              onPress={() => setReturnModalVisible(true)}
              disabled={unlocking}
              style={styles.actionBtn}
            />
          </View>
        )}

      </ScrollView>

      {/* MODAL 1: Fullscreen QR Code Overlay */}
      <Modal
        animationType="fade"
        transparent
        visible={qrModalVisible}
        onRequestClose={() => setQrModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.qrModalContent}>
            <View style={styles.modalHeader}>
              <ThemedText type="h2">Mã QR Mở Tủ</ThemedText>
              <Pressable style={styles.closeBtn} onPress={() => setQrModalVisible(false)}>
                <Ionicons name="close" size={24} color="#FFFFFF" />
              </Pressable>
            </View>

            <View style={styles.largeQrContainer}>
              <QRCode
                value={`smartbox-rental-${rental.id}-auth-token`}
                size={240}
                backgroundColor="#FFFFFF"
                color="#000000"
              />
            </View>

            <ThemedText type="caption" themeColor="textSecondary" style={styles.largeQrOtpLabel}>
              Mã OTP dự phòng:
            </ThemedText>
            <ThemedText type="otpCodeLarge" themeColor="brand" style={styles.largeQrOtp}>
              {rental.code.split('').join(' ')}
            </ThemedText>

            <View style={styles.largeQrMetadata}>
              <ThemedText type="bodyBold" style={{ textAlign: 'center' }}>
                {rental.locationName} • Ngăn {rental.cabinetName}
              </ThemedText>
              <ThemedText type="caption" themeColor="textSecondary" style={{ textAlign: 'center', marginTop: 4 }}>
                Thời gian: {timeLeft}
              </ThemedText>
            </View>

            <Button
              title="CHIA SẺ MÃ QR"
              variant="secondary"
              size="md"
              onPress={() => {}}
            />
          </View>
        </View>
      </Modal>

      {/* MODAL 2: Locker Open Active Overlay */}
      <Modal
        transparent
        visible={cabinetUnlocked}
        animationType="slide"
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.unlockedModalContent}>
            <View style={styles.unlockIndicator}>
              <Ionicons name="lock-open-outline" size={48} color="#FF6600" />
            </View>
            
            <ThemedText type="h2" style={styles.unlockTitle}>Tủ Đã Mở!</ThemedText>
            <ThemedText type="body" themeColor="textSecondary" style={styles.unlockMessage}>
              Ngăn tủ {rental.cabinetName} của bạn đã được mở thành công. Vui lòng đóng cửa tủ thật chặt sau khi hoàn tất sử dụng.
            </ThemedText>

            {/* Simulated hardware countdown */}
            <View style={styles.timerCircle}>
              <ThemedText type="h1" themeColor="brand">{unlockCountdown}</ThemedText>
              <ThemedText type="small" themeColor="textMuted">giây tự khoá</ThemedText>
            </View>

            <Button
              title="ĐÃ ĐÓNG TỦ"
              variant="primary"
              size="md"
              onPress={() => setCabinetUnlocked(false)}
              fullWidth
            />
          </View>
        </View>
      </Modal>

      {/* MODAL 3: Return Locker Confirmation destuctive Modal */}
      <Modal
        transparent
        visible={returnModalVisible}
        animationType="fade"
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.confirmModalContent}>
            <View style={styles.warningIconWrapper}>
              <Ionicons name="warning-outline" size={44} color="#FF3D00" />
            </View>
            <ThemedText type="h3" style={styles.confirmTitle}>Hoàn tất trả tủ?</ThemedText>
            <ThemedText type="caption" themeColor="textSecondary" style={styles.confirmMessage}>
              Hành động này sẽ giải phóng ngăn tủ A1 và chấm dứt thời hạn thuê hiện tại của bạn. Bạn không thể hoàn tác thao tác này.
            </ThemedText>

            <View style={styles.confirmActions}>
              <Pressable style={[styles.confirmBtn, styles.cancelBtn]} onPress={() => setReturnModalVisible(false)}>
                <ThemedText type="button" themeColor="textSecondary">Huỷ bỏ</ThemedText>
              </Pressable>
              <Pressable style={[styles.confirmBtn, styles.dangerConfirmBtn]} onPress={handleReturnLocker}>
                <ThemedText type="button" style={{ color: '#FFFFFF' }}>Xác nhận trả</ThemedText>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: '#1C1C1B',
    marginTop: 48,
  },
  backBtn: {
    padding: 4,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 48,
  },
  detailCard: {
    backgroundColor: '#1C1C1B',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#333332',
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  qrContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
    width: 212,
    height: 212,
    justifyContent: 'center',
  },
  qrHint: {
    color: '#6B6B6A',
    fontSize: 10,
    marginTop: 8,
    textAlign: 'center',
  },
  inactiveQrPlaceholder: {
    width: 212,
    height: 212,
    borderRadius: 16,
    backgroundColor: '#0A0A0A',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333332',
  },
  inactiveQrText: {
    marginTop: 12,
  },
  otpWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0A0A0A',
    borderWidth: 1,
    borderColor: '#333332',
    borderRadius: 8,
    padding: 12,
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  otpMain: {
    flex: 1,
  },
  copyIconWrapper: {
    alignItems: 'center',
    marginLeft: 12,
  },
  metadataGrid: {
    width: '100%',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#333332',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaItem: {
    flex: 1,
  },
  metaDivider: {
    height: 1,
    backgroundColor: '#1C1C1B',
    marginVertical: 12,
  },
  sectionCard: {
    backgroundColor: '#1C1C1B',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333332',
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  logRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 28,
  },
  logDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF6600',
    marginRight: 10,
  },
  logTime: {
    width: 50,
    fontWeight: '600',
  },
  actionsContainer: {
    gap: 12,
    marginTop: 8,
  },
  actionBtn: {
    width: '100%',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  qrModalContent: {
    width: '100%',
    backgroundColor: '#1C1C1B',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#333332',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  closeBtn: {
    padding: 4,
  },
  largeQrContainer: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 16,
    alignSelf: 'center',
    marginBottom: 24,
  },
  largeQrOtpLabel: {
    textAlign: 'center',
    marginBottom: 4,
  },
  largeQrOtp: {
    textAlign: 'center',
    marginBottom: 24,
    letterSpacing: 4,
  },
  largeQrMetadata: {
    marginBottom: 32,
  },
  unlockedModalContent: {
    width: '100%',
    backgroundColor: '#1C1C1B',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333332',
  },
  unlockIndicator: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 102, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  unlockTitle: {
    marginBottom: 12,
  },
  unlockMessage: {
    textAlign: 'center',
    marginBottom: 24,
  },
  timerCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#FF6600',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 28,
  },
  confirmModalContent: {
    width: '100%',
    backgroundColor: '#1C1C1B',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333332',
  },
  warningIconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#2A0D00',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  confirmTitle: {
    marginBottom: 8,
  },
  confirmMessage: {
    textAlign: 'center',
    marginBottom: 24,
  },
  confirmActions: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
  },
  confirmBtn: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelBtn: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#333332',
  },
  dangerConfirmBtn: {
    backgroundColor: '#FF3D00',
  },
});
