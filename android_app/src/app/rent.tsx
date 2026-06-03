import React, { useState } from 'react';
import { StyleSheet, View, Pressable, ScrollView, Animated } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Mock location lookup
const LOCATIONS: Record<string, string> = {
  '1': 'Đại học Bách Khoa - A1',
  '2': 'Ký túc xá Bách Khoa',
  '3': 'SmartBox Zone 3',
  '4': 'BK Tech Park',
};

export default function RentScreen() {
  const router = useRouter();
  const { locationId } = useLocalSearchParams<{ locationId: string }>();
  const locationName = LOCATIONS[locationId || '1'] || 'Đại học Bách Khoa - A1';

  const [step, setStep] = useState(1); // 1 = Size, 2 = Plan, 3 = Payment, 4 = Success
  const [selectedSize, setSelectedSize] = useState<'SMALL' | 'LARGE' | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'VIETQR' | 'MOMO' | 'ZALOPAY'>('VIETQR');
  const [loading, setLoading] = useState(false);

  // Success screen scale animation
  const [checkScale] = useState(() => new Animated.Value(0));

  const handleNextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    } else if (step === 3) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setStep(4);
        Animated.spring(checkScale, {
          toValue: 1,
          friction: 4,
          useNativeDriver: true,
        }).start();
      }, 1500);
    }
  };

  const handleBackStep = () => {
    if (step > 1 && step < 4) {
      setStep(step - 1);
    } else {
      router.back();
    }
  };

  const getPlanName = () => {
    if (selectedPlan === 'once') return 'Một lần';
    if (selectedPlan === 'daily') return 'Theo ngày';
    return 'Theo tháng';
  };

  const getPlanPrice = () => {
    if (selectedSize === 'SMALL') {
      if (selectedPlan === 'once') return 15000;
      if (selectedPlan === 'daily') return 10000;
      return 80000;
    } else {
      if (selectedPlan === 'once') return 30000;
      if (selectedPlan === 'daily') return 20000;
      return 150000;
    }
  };

  const isNextDisabled = () => {
    if (step === 1) return !selectedSize;
    if (step === 2) return !selectedPlan;
    return false;
  };

  return (
    <ThemedView style={styles.container}>
      
      {/* Header (Hidden on Success screen) */}
      {step < 4 && (
        <View style={styles.header}>
          <Pressable style={styles.backBtn} onPress={handleBackStep}>
            <Ionicons name="arrow-back" size={24} color="#A1A1A0" />
          </Pressable>
          <View style={styles.headerTitleContainer}>
            <ThemedText type="h3">
              {step === 1 ? 'Chọn kích thước' : step === 2 ? 'Chọn gói thuê' : 'Thanh toán'}
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              Bước {step}/3
            </ThemedText>
          </View>
          <View style={{ width: 40 }} />
        </View>
      )}

      {/* Step Indicator (Hidden on Success screen) */}
      {step < 4 && (
        <View style={styles.stepIndicatorContainer}>
          <View style={styles.stepIndicatorRow}>
            {/* Step 1 */}
            <View style={[styles.stepDot, step >= 1 ? styles.stepDotActive : styles.stepDotInactive]}>
              {step > 1 ? (
                <Ionicons name="checkmark" size={14} color="#FFFFFF" />
              ) : (
                <ThemedText style={styles.stepNumText}>1</ThemedText>
              )}
            </View>
            <View style={[styles.stepLine, step >= 2 ? styles.stepLineActive : styles.stepLineInactive]} />

            {/* Step 2 */}
            <View style={[styles.stepDot, step >= 2 ? styles.stepDotActive : styles.stepDotInactive]}>
              {step > 2 ? (
                <Ionicons name="checkmark" size={14} color="#FFFFFF" />
              ) : (
                <ThemedText style={styles.stepNumText}>2</ThemedText>
              )}
            </View>
            <View style={[styles.stepLine, step >= 3 ? styles.stepLineActive : styles.stepLineInactive]} />

            {/* Step 3 */}
            <View style={[styles.stepDot, step >= 3 ? styles.stepDotActive : styles.stepDotInactive]}>
              <ThemedText style={styles.stepNumText}>3</ThemedText>
            </View>
          </View>
          <View style={styles.stepLabelsRow}>
            <ThemedText type="small" themeColor={step >= 1 ? 'brand' : 'textSecondary'} style={styles.stepLabel}>Chọn tủ</ThemedText>
            <ThemedText type="small" themeColor={step >= 2 ? 'brand' : 'textSecondary'} style={styles.stepLabel}>Chọn gói</ThemedText>
            <ThemedText type="small" themeColor={step >= 3 ? 'brand' : 'textSecondary'} style={styles.stepLabel}>Thanh toán</ThemedText>
          </View>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {step === 1 && (
          // STEP 1: Select Size
          <View style={styles.stepContainer}>
            <View style={styles.titleWrapper}>
              <ThemedText type="h2" style={styles.stepTitle}>Chọn kích thước tủ</ThemedText>
              <ThemedText type="caption" themeColor="textSecondary">{locationName}</ThemedText>
            </View>

            <Pressable
              style={[styles.card, selectedSize === 'SMALL' && styles.cardSelected]}
              onPress={() => setSelectedSize('SMALL')}
            >
              <View style={styles.cardHeader}>
                <Ionicons name="cube-outline" size={32} color={selectedSize === 'SMALL' ? '#FF6600' : '#A1A1A0'} />
                <View style={[styles.radioCircle, selectedSize === 'SMALL' && styles.radioCircleActive]}>
                  {selectedSize === 'SMALL' && <View style={styles.radioDot} />}
                </View>
              </View>
              <ThemedText type="bodyBold" style={styles.cardTitle}>Tủ Nhỏ (SMALL)</ThemedText>
              <ThemedText type="caption" themeColor="textSecondary" style={styles.cardDesc}>
                Kích thước: 20 × 30 × 40 cm. Phù hợp cho balo, túi xách, laptop, sách vở và tài liệu cá nhân.
              </ThemedText>
              <ThemedText type="price" themeColor="brand" style={styles.cardPrice}>Từ 15.000đ</ThemedText>
            </Pressable>

            <Pressable
              style={[styles.card, selectedSize === 'LARGE' && styles.cardSelected]}
              onPress={() => setSelectedSize('LARGE')}
            >
              <View style={styles.cardHeader}>
                <Ionicons name="grid-outline" size={32} color={selectedSize === 'LARGE' ? '#FF6600' : '#A1A1A0'} />
                <View style={[styles.radioCircle, selectedSize === 'LARGE' && styles.radioCircleActive]}>
                  {selectedSize === 'LARGE' && <View style={styles.radioDot} />}
                </View>
              </View>
              <ThemedText type="bodyBold" style={styles.cardTitle}>Tủ Lớn (LARGE)</ThemedText>
              <ThemedText type="caption" themeColor="textSecondary" style={styles.cardDesc}>
                Kích thước: 40 × 60 × 80 cm. Phù hợp cho vali du lịch, túi thể thao lớn, mũ bảo hiểm fullface.
              </ThemedText>
              <ThemedText type="price" themeColor="brand" style={styles.cardPrice}>Từ 30.000đ</ThemedText>
            </Pressable>
          </View>
        )}

        {step === 2 && (
          // STEP 2: Select Plan
          <View style={styles.stepContainer}>
            <View style={styles.titleWrapper}>
              <ThemedText type="h2" style={styles.stepTitle}>Chọn gói thuê phù hợp</ThemedText>
              <ThemedText type="caption" themeColor="textSecondary">
                Tủ {selectedSize === 'SMALL' ? 'Nhỏ' : 'Lớn'} • {locationName}
              </ThemedText>
            </View>

            {/* Plan 1: Once */}
            <Pressable
              style={[styles.cardRow, selectedPlan === 'once' && styles.cardRowSelected]}
              onPress={() => setSelectedPlan('once')}
            >
              <View style={[styles.radioCircle, selectedPlan === 'once' && styles.radioCircleActive]}>
                {selectedPlan === 'once' && <View style={styles.radioDot} />}
              </View>
              <View style={styles.planInfo}>
                <ThemedText type="bodyBold">Gói Một Lần</ThemedText>
                <ThemedText type="caption" themeColor="textSecondary">Mở tối đa 2 lần • Hết hạn sau 24 giờ</ThemedText>
              </View>
              <ThemedText type="price" themeColor="brand">
                {selectedSize === 'SMALL' ? '15.000đ' : '30.000đ'}
              </ThemedText>
            </Pressable>

            {/* Plan 2: Daily */}
            <Pressable
              style={[styles.cardRow, selectedPlan === 'daily' && styles.cardRowSelected]}
              onPress={() => setSelectedPlan('daily')}
            >
              <View style={[styles.radioCircle, selectedPlan === 'daily' && styles.radioCircleActive]}>
                {selectedPlan === 'daily' && <View style={styles.radioDot} />}
              </View>
              <View style={styles.planInfo}>
                <ThemedText type="bodyBold">Gói Theo Ngày</ThemedText>
                <ThemedText type="caption" themeColor="textSecondary">Mở tối đa 5 lần/ngày • Thuê không giới hạn</ThemedText>
              </View>
              <ThemedText type="price" themeColor="brand">
                {selectedSize === 'SMALL' ? '10.000đ' : '20.000đ'}<ThemedText type="small" themeColor="brand">/ngày</ThemedText>
              </ThemedText>
            </Pressable>

            {/* Plan 3: Monthly */}
            <Pressable
              style={[styles.cardRow, selectedPlan === 'monthly' && styles.cardRowSelected]}
              onPress={() => setSelectedPlan('monthly')}
            >
              <View style={[styles.radioCircle, selectedPlan === 'monthly' && styles.radioCircleActive]}>
                {selectedPlan === 'monthly' && <View style={styles.radioDot} />}
              </View>
              <View style={styles.planInfo}>
                <View style={styles.planLabelWrapper}>
                  <ThemedText type="bodyBold">Gói Theo Tháng</ThemedText>
                  <Badge label="Tiết kiệm 33%" status="active" style={styles.savingBadge} />
                </View>
                <ThemedText type="caption" themeColor="textSecondary">Mở tối đa 30 lần/tháng • Tối ưu lưu trữ dài hạn</ThemedText>
              </View>
              <ThemedText type="price" themeColor="brand">
                {selectedSize === 'SMALL' ? '80.000đ' : '150.000đ'}
              </ThemedText>
            </Pressable>
          </View>
        )}

        {step === 3 && (
          // STEP 3: Confirm & Payment
          <View style={styles.stepContainer}>
            <View style={styles.titleWrapper}>
              <ThemedText type="h2" style={styles.stepTitle}>Xác nhận thanh toán</ThemedText>
            </View>

            {/* Summary Card */}
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <ThemedText themeColor="textSecondary">Địa điểm:</ThemedText>
                <ThemedText type="bodyBold">{locationName}</ThemedText>
              </View>
              <View style={styles.summaryRow}>
                <ThemedText themeColor="textSecondary">Kích thước:</ThemedText>
                <ThemedText type="bodyBold">Tủ {selectedSize === 'SMALL' ? 'Nhỏ' : 'Lớn'}</ThemedText>
              </View>
              <View style={styles.summaryRow}>
                <ThemedText themeColor="textSecondary">Gói thuê:</ThemedText>
                <ThemedText type="bodyBold">{getPlanName()}</ThemedText>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryTotalRow}>
                <ThemedText type="bodyBold">Tổng tiền cần trả:</ThemedText>
                <ThemedText type="price" themeColor="brand">
                  {getPlanPrice().toLocaleString('vi-VN')} đ
                </ThemedText>
              </View>
            </View>

            <ThemedText type="h3" style={styles.paymentSectionTitle}>Chọn phương thức thanh toán</ThemedText>

            {/* Payment Method 1: VietQR */}
            <Pressable
              style={[styles.paymentMethodCard, paymentMethod === 'VIETQR' && styles.paymentMethodCardSelected]}
              onPress={() => setPaymentMethod('VIETQR')}
            >
              <View style={[styles.radioCircle, paymentMethod === 'VIETQR' && styles.radioCircleActive]}>
                {paymentMethod === 'VIETQR' && <View style={styles.radioDot} />}
              </View>
              <View style={styles.paymentMethodInfo}>
                <View style={styles.planLabelWrapper}>
                  <ThemedText type="bodyBold">VietQR (Ngân hàng)</ThemedText>
                  <Badge label="Khuyên dùng" status="info" style={styles.savingBadge} />
                </View>
                <ThemedText type="caption" themeColor="textSecondary">Quét mã VietQR chuyển khoản nhanh 24/7</ThemedText>
              </View>
            </Pressable>

            {/* Payment Method 2: MoMo */}
            <Pressable
              style={[styles.paymentMethodCard, paymentMethod === 'MOMO' && styles.paymentMethodCardSelected]}
              onPress={() => setPaymentMethod('MOMO')}
            >
              <View style={[styles.radioCircle, paymentMethod === 'MOMO' && styles.radioCircleActive]}>
                {paymentMethod === 'MOMO' && <View style={styles.radioDot} />}
              </View>
              <View style={styles.paymentMethodInfo}>
                <ThemedText type="bodyBold">Ví điện tử MoMo</ThemedText>
                <ThemedText type="caption" themeColor="textSecondary">Thanh toán tự động bằng ứng dụng MoMo</ThemedText>
              </View>
            </Pressable>

            {/* Payment Method 3: ZaloPay */}
            <Pressable
              style={[styles.paymentMethodCard, paymentMethod === 'ZALOPAY' && styles.paymentMethodCardSelected]}
              onPress={() => setPaymentMethod('ZALOPAY')}
            >
              <View style={[styles.radioCircle, paymentMethod === 'ZALOPAY' && styles.radioCircleActive]}>
                {paymentMethod === 'ZALOPAY' && <View style={styles.radioDot} />}
              </View>
              <View style={styles.paymentMethodInfo}>
                <ThemedText type="bodyBold">Ví điện tử ZaloPay</ThemedText>
                <ThemedText type="caption" themeColor="textSecondary">Thanh toán tiện lợi qua cổng ví ZaloPay</ThemedText>
              </View>
            </Pressable>
          </View>
        )}

        {step === 4 && (
          // STEP 4: Success Screen
          <View style={styles.successContainer}>
            <Animated.View style={[styles.successIconWrapper, { transform: [{ scale: checkScale }] }]}>
              <Ionicons name="checkmark-circle" size={80} color="#00C853" />
            </Animated.View>

            <ThemedText type="h1" style={styles.successTitle}>Thuê tủ thành công!</ThemedText>
            <ThemedText type="caption" themeColor="textSecondary" style={styles.successSubtitle}>
              Mã QR và OTP của bạn đã được khởi tạo
            </ThemedText>

            {/* QR Code Container */}
            <View style={styles.qrContainer}>
              <QRCode
                value="smartbox-rental-r1-auth-token-123456"
                size={160}
                backgroundColor="#FFFFFF"
                color="#000000"
              />
              <ThemedText type="small" themeColor="textMuted" style={styles.qrHint}>
                Đưa mã này trước camera của tủ để mở
              </ThemedText>
            </View>

            {/* OTP Section */}
            <ThemedText type="caption" themeColor="textSecondary" style={styles.otpLabel}>
              Mã OTP mở tủ thủ công:
            </ThemedText>
            <View style={styles.otpBox}>
              <ThemedText type="otpCodeLarge" themeColor="brand" style={styles.otpDigits}>
                1  2  3  4  5  6
              </ThemedText>
            </View>

            {/* Locker Info Summary */}
            <View style={styles.rentalSummary}>
              <View style={styles.summaryItem}>
                <Ionicons name="location-outline" size={16} color="#A1A1A0" style={styles.summaryIcon} />
                <ThemedText type="small" themeColor="textSecondary">{locationName}</ThemedText>
              </View>
              <View style={styles.summaryItem}>
                <Ionicons name="cube-outline" size={16} color="#A1A1A0" style={styles.summaryIcon} />
                <ThemedText type="small" themeColor="textSecondary">Tủ A1 • Cỡ {selectedSize === 'SMALL' ? 'Nhỏ' : 'Lớn'}</ThemedText>
              </View>
              <View style={styles.summaryItem}>
                <Ionicons name="time-outline" size={16} color="#A1A1A0" style={styles.summaryIcon} />
                <ThemedText type="small" themeColor="textSecondary">Hết hạn: 04/06/2026 10:00</ThemedText>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.successActions}>
              <Button
                title="CHIA SẺ MÃ QR"
                variant="secondary"
                size="md"
                onPress={() => {}}
                style={styles.successActionBtn}
              />
              <Button
                title="XEM CHI TIẾT TỦ"
                variant="primary"
                size="md"
                onPress={() => router.replace('/rental-detail?id=r1')}
                style={styles.successActionBtn}
              />
            </View>

            <Pressable onPress={() => router.replace('/home')}>
              <ThemedText themeColor="brand" type="caption" style={styles.homeLink}>
                Về màn hình chính
              </ThemedText>
            </Pressable>
          </View>
        )}
      </ScrollView>

      {/* Persistent Bottom Action Button (Steps 1-3) */}
      {step < 4 && (
        <View style={styles.bottomBar}>
          <Button
            title={step === 3 ? 'XÁC NHẬN THUÊ TỦ' : 'TIẾP TỤC →'}
            variant="primary"
            size="lg"
            onPress={handleNextStep}
            disabled={isNextDisabled() || loading}
            loading={loading}
          />
        </View>
      )}

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
  headerTitleContainer: {
    alignItems: 'center',
  },
  stepIndicatorContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1C1C1B',
  },
  stepIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepDotActive: {
    backgroundColor: '#FF6600',
  },
  stepDotInactive: {
    backgroundColor: '#1C1C1B',
    borderWidth: 1,
    borderColor: '#333332',
  },
  stepNumText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  stepLine: {
    height: 2,
    flex: 1,
    marginHorizontal: 8,
  },
  stepLineActive: {
    backgroundColor: '#FF6600',
  },
  stepLineInactive: {
    backgroundColor: '#333332',
  },
  stepLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingHorizontal: 10,
  },
  stepLabel: {
    fontWeight: '600',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 120,
  },
  stepContainer: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  titleWrapper: {
    marginBottom: 24,
  },
  stepTitle: {
    marginBottom: 4,
  },
  card: {
    backgroundColor: '#1C1C1B',
    borderWidth: 1,
    borderColor: '#333332',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardSelected: {
    borderColor: '#FF6600',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#6B6B6A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioCircleActive: {
    borderColor: '#FF6600',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF6600',
  },
  cardTitle: {
    marginBottom: 8,
  },
  cardDesc: {
    marginBottom: 16,
  },
  cardPrice: {
    fontWeight: '700',
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1B',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333332',
    padding: 16,
    marginBottom: 16,
  },
  cardRowSelected: {
    borderColor: '#FF6600',
  },
  planInfo: {
    flex: 1,
    marginLeft: 16,
  },
  planLabelWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  savingBadge: {
    marginLeft: 8,
  },
  summaryCard: {
    backgroundColor: '#1C1C1B',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333332',
    padding: 16,
    marginBottom: 24,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#333332',
    marginVertical: 12,
  },
  summaryTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentSectionTitle: {
    marginBottom: 16,
  },
  paymentMethodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1B',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333332',
    padding: 16,
    marginBottom: 12,
  },
  paymentMethodCardSelected: {
    borderColor: '#FF6600',
  },
  paymentMethodInfo: {
    flex: 1,
    marginLeft: 16,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#0A0A0A',
    borderTopWidth: 1,
    borderTopColor: '#1C1C1B',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  successContainer: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 48,
  },
  successIconWrapper: {
    marginBottom: 20,
  },
  successTitle: {
    marginBottom: 6,
  },
  successSubtitle: {
    marginBottom: 32,
    textAlign: 'center',
  },
  qrContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
  },
  qrHint: {
    color: '#6B6B6A',
    marginTop: 12,
  },
  otpLabel: {
    marginBottom: 8,
  },
  otpBox: {
    backgroundColor: '#1C1C1B',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#333332',
  },
  otpDigits: {
    letterSpacing: 4,
    textAlign: 'center',
  },
  rentalSummary: {
    width: '100%',
    backgroundColor: '#1C1C1B',
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#333332',
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryIcon: {
    marginRight: 10,
  },
  successActions: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
    width: '100%',
  },
  successActionBtn: {
    flex: 1,
  },
  homeLink: {
    fontWeight: '600',
    textDecorationLine: 'underline',
    marginBottom: 48,
  },
});
