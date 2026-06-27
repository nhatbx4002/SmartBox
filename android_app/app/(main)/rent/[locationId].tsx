import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, ScrollView, Pressable, ActivityIndicator, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Button from "../../../src/components/ui/button";
import Badge from "../../../src/components/ui/badge";
import SpringPressable from "../../../src/components/ui/spring-pressable";
import QrCodeDisplay from "../../../src/components/ui/qr-code-display";
import { PaymentMethod, PricePlan, RentalType, CreatePaymentResult } from "../../../src/types";
import { useLocationStore } from "../../../src/store/locationStore";
import { useRentalStore } from "../../../src/store/rentalStore";
import { paymentService } from "../../../src/services/payment";
import { useIsOnline } from "../../../src/hooks/useIsOnline";

const PLAN_GROUPS: Record<RentalType, { title: string; subtitle: string }> = {
  ONCE:    { title: 'Gói ngắn hạn',              subtitle: 'Phù hợp gửi/lấy trong thời gian ngắn' },
  DAILY:   { title: 'Gói nhiều lượt mở',          subtitle: 'Mở tủ nhiều lần trong nhiều ngày' },
  MONTHLY: { title: 'Gói không giới hạn lượt mở', subtitle: 'Dùng dài hạn, không giới hạn lượt mở' },
};

function formatPlanSubtitle(plan: PricePlan): string {
  if (plan.rentalType === 'MONTHLY') return 'Không giới hạn lượt mở';
  if (plan.rentalType === 'DAILY') return `${plan.maxOpens} lượt / ${plan.durationDays} ngày`;
  return `Sử dụng trong ${plan.durationDays} ngày`;
}

export default function RentFlowScreen() {
  const router = useRouter();
  const { locationId } = useLocalSearchParams<{ locationId: string }>();
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(1);
  const [selectedSize, setSelectedSize] = useState<"SMALL" | "LARGE" | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("VIETQR");
  const [createdRentalId, setCreatedRentalId] = useState<string | null>(null);
  const [plansLoading, setPlansLoading] = useState(false);
  const [payment, setPayment] = useState<CreatePaymentResult | null>(null);
  const [countdownText, setCountdownText] = useState("");
  const [selectedPlanGroup, setSelectedPlanGroup] = useState<RentalType | null>(null);
  const isOnline = useIsOnline();

  const selectedLocation = useLocationStore((state) => state.selectedLocation);
  const fetchLocationDetail = useLocationStore((state) => state.fetchLocationDetail);
  const plans = useLocationStore((state) => state.plans);
  const fetchPlans = useLocationStore((state) => state.fetchPlans);
  const isLocationLoading = useLocationStore((state) => state.isLoading);
  const createRental = useRentalStore((state) => state.createRental);
  const currentRental = useRentalStore((state) => state.currentRental);
  const isRentalLoading = useRentalStore((state) => state.isLoading);

  useEffect(() => {
    if (locationId) {
      fetchLocationDetail(String(locationId));
    }
  }, [fetchLocationDetail, locationId]);

  const sizePlans = useMemo(() => {
    if (!selectedSize) return [];
    return plans.filter((plan) => plan.size === selectedSize);
  }, [plans, selectedSize]);

  const groupedPlans = useMemo(() => {
    return sizePlans.reduce((acc, plan) => {
      (acc[plan.rentalType] ??= []).push(plan);
      return acc;
    }, {} as Partial<Record<RentalType, PricePlan[]>>);
  }, [sizePlans]);

  const selectedPlan = useMemo(
    () => sizePlans.find((plan) => plan.id === selectedPlanId) || null,
    [selectedPlanId, sizePlans],
  );

  const activeCabinetId = useMemo(() => {
    const activeCabinet = selectedLocation?.cabinets.find((cabinet) => cabinet.isOnline);
    return activeCabinet?.id || selectedLocation?.cabinets[0]?.id;
  }, [selectedLocation]);

  // Đếm ngăn trống theo size trên toàn location (khớp số liệu màn Chi tiết trạm)
  const availability = useMemo(() => {
    const result = { SMALL: 0, LARGE: 0 };
    for (const cabinet of selectedLocation?.cabinets ?? []) {
      for (const compartment of cabinet.compartments) {
        if (compartment.status === "AVAILABLE") result[compartment.size] += 1;
      }
    }
    return result;
  }, [selectedLocation]);

  const formatCurrency = (amount: number) => amount.toLocaleString("vi-VN") + "đ";

  const handleNextStep = async () => {
    if (step === 1 && !selectedSize) {
      Alert.alert("Thiếu thông tin", "Vui lòng chọn kích thước tủ.");
      return;
    }
    if (step === 1 && selectedSize && availability[selectedSize] === 0) {
      Alert.alert("Hết ngăn trống", `${selectedSize === "SMALL" ? "Tủ nhỏ" : "Tủ lớn"} tại trạm này đã hết ngăn trống. Vui lòng chọn kích thước khác.`);
      return;
    }
    if (step === 1 && selectedSize) {
      setStep(2);
      setPlansLoading(true);
      fetchPlans(selectedSize).finally(() => setPlansLoading(false));
      return;
    }
    if (step === 2) {
      if (!selectedPlanId) {
        Alert.alert("Thiếu thông tin", "Vui lòng chọn gói thuê.");
        return;
      }
    }
    setStep((prev) => prev + 1);
  };

  const handlePayment = async () => {
    if (!selectedSize || !selectedPlanId) return;

    try {
      const rental = await createRental({
        size: selectedSize,
        planId: selectedPlanId,
        paymentMethod,
        cabinetId: activeCabinetId,
      });
      setCreatedRentalId(rental.id);
      
      const res = await paymentService.createPayment({
        rentalId: rental.id,
        source: 'APP',
      });
      setPayment(res.data);
      setStep(4);
    } catch (error: any) {
      Alert.alert("Không thể tạo thanh toán", error?.message || "Có lỗi xảy ra.");
    }
  };

  // Countdown timer for payment expiry
  useEffect(() => {
    if (step !== 4 || !payment) return;

    const expiryTime = new Date(payment.expiresAt).getTime();
    const updateCountdown = () => {
      const now = Date.now();
      const diff = expiryTime - now;
      if (diff <= 0) {
        setCountdownText("Đã hết hạn");
        clearInterval(timerInterval);
        return;
      }
      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setCountdownText(`${minutes}:${seconds.toString().padStart(2, "0")}`);
    };

    updateCountdown();
    const timerInterval = setInterval(updateCountdown, 1000);
    return () => clearInterval(timerInterval);
  }, [step, payment]);

  // Polling effect
  useEffect(() => {
    if (step !== 4 || !payment) return;

    const maxRetries = 72;
    const retryCount = { current: 0 };

    const interval = setInterval(async () => {
      retryCount.current += 1;
      if (retryCount.current > maxRetries) {
        clearInterval(interval);
        Alert.alert('Hết thời gian', 'Phiên thanh toán đã hết hạn, vui lòng thử lại.');
        setStep(3);
        return;
      }

      try {
        const res = await paymentService.getPaymentStatus(payment.orderCode);
        if (res.data.status === 'PAID') {
          clearInterval(interval);
          setStep(5);
        } else if (res.data.status === 'FAILED') {
          clearInterval(interval);
          Alert.alert('Thanh toán hết hạn', 'Phiên thanh toán đã hết hạn, vui lòng thử lại.');
          setStep(3);
        }
      } catch {
        // keep polling
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [step, payment]);

  const loading = isLocationLoading || isRentalLoading;

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center px-four py-three border-b border-border/40 bg-surface/50">
        {step < 5 && (
          <Pressable
            onPress={step === 1 ? () => router.back() : () => setStep((prev) => prev - 1)}
            className="w-10 h-10 rounded-full items-center justify-center bg-surface border border-border"
          >
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </Pressable>
        )}
        <Text className="text-h3 text-white font-bold ml-three">
          {step === 5 ? "Thuê thành công" : selectedLocation?.name || "Thuê tủ"}
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-four"
        contentContainerStyle={{ paddingBottom: insets.bottom + 24, paddingTop: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {loading && step !== 5 ? (
          <ActivityIndicator color="#FF6600" />
        ) : (
          <>
            {step < 5 && (
              <View className="px-four py-four bg-surface/30 border border-border/40 rounded-panel items-center mb-four">
                <Text className="text-small text-text-secondary mb-three">
                  Bước {step}/4
                </Text>
                <Text className="text-caption text-text-secondary">
                  {step === 1 ? "Chọn kích thước" : step === 2 ? "Chọn gói thuê" : step === 3 ? "Xác nhận thanh toán" : "Quét mã thanh toán"}
                </Text>
              </View>
            )}

            {step === 1 && (
              <View className="gap-four">
                <Text className="text-body-bold text-white">Chọn kích thước tủ</Text>
                {(["SMALL", "LARGE"] as const).map((size) => {
                  const soldOut = availability[size] === 0;
                  return (
                    <SpringPressable
                      key={size}
                      onPress={() => {
                        if (soldOut) return;
                        setSelectedSize(size);
                        setSelectedPlanId(null);
                        setSelectedPlanGroup(null);
                      }}
                      className={`bg-surface border p-four rounded-panel ${soldOut ? "opacity-50 border-border" : selectedSize === size ? "border-brand" : "border-border"}`}
                    >
                      <View className="flex-row justify-between items-start">
                        <Text className="text-body-bold text-white">{size === "SMALL" ? "Tủ nhỏ" : "Tủ lớn"}</Text>
                        <Badge
                          label={soldOut ? "Hết ngăn" : `${availability[size]} ngăn trống`}
                          status={soldOut ? "expired" : "active"}
                        />
                      </View>
                      <Text className="text-caption text-text-secondary mt-two">
                        {size === "SMALL" ? "Phù hợp balo, laptop, tài liệu." : "Phù hợp vali, túi lớn, nhiều đồ."}
                      </Text>
                    </SpringPressable>
                  );
                })}
                <Button
                  title="Tiếp tục"
                  disabled={!selectedSize || availability[selectedSize] === 0}
                  onPress={handleNextStep}
                />
              </View>
            )}

            {step === 2 && (
              <View className="gap-four">
                {plansLoading ? (
                  <View className="items-center py-eight">
                    <ActivityIndicator color="#FF6600" />
                  </View>
                ) : sizePlans.length === 0 ? (
                  <>
                    <Text className="text-caption text-text-secondary">Không có gói thuê cho kích thước này.</Text>
                    <Button title="Quay lại" variant="secondary" onPress={() => setStep(1)} />
                  </>
                ) : selectedPlanGroup === null ? (
                  <>
                    <Text className="text-body-bold text-white">Chọn nhóm gói thuê</Text>
                    {(Object.keys(PLAN_GROUPS) as RentalType[])
                      .filter((type) => groupedPlans[type]?.length)
                      .map((type) => {
                        const group = PLAN_GROUPS[type];
                        const groupPlans = groupedPlans[type]!;
                        const minPrice = Math.min(...groupPlans.map((p) => p.price));
                        return (
                          <SpringPressable
                            key={type}
                            onPress={() => setSelectedPlanGroup(type)}
                            className="bg-surface border border-border p-four rounded-panel"
                          >
                            <Text className="text-body-bold text-white">{group.title}</Text>
                            <Text className="text-caption text-text-secondary mt-one">{group.subtitle}</Text>
                            <Text className="text-small-bold text-brand mt-two">Từ {formatCurrency(minPrice)}</Text>
                          </SpringPressable>
                        );
                      })}
                    <Button title="Quay lại" variant="secondary" onPress={() => setStep(1)} />
                  </>
                ) : (
                  <>
                    <Pressable
                      onPress={() => { setSelectedPlanGroup(null); setSelectedPlanId(null); }}
                      className="flex-row items-center gap-two"
                    >
                      <Ionicons name="arrow-back" size={16} color="#FF6600" />
                      <Text className="text-small-bold text-brand">{PLAN_GROUPS[selectedPlanGroup].title}</Text>
                    </Pressable>
                    {(groupedPlans[selectedPlanGroup] ?? []).map((plan) => (
                      <SpringPressable
                        key={plan.id}
                        onPress={() => setSelectedPlanId(plan.id)}
                        className={`bg-surface border p-four rounded-panel ${selectedPlanId === plan.id ? "border-brand" : "border-border"}`}
                      >
                        <View className="flex-row justify-between items-start">
                          <View className="flex-1 pr-three">
                            <Text className="text-body-bold text-white">{plan.name}</Text>
                            <Text className="text-caption text-text-secondary mt-one">{formatPlanSubtitle(plan)}</Text>
                          </View>
                          <Badge label={formatCurrency(plan.price)} status="active" />
                        </View>
                      </SpringPressable>
                    ))}
                    <View className="flex-row gap-three">
                      <View className="flex-1">
                        <Button title="Quay lại" variant="secondary" onPress={() => { setSelectedPlanGroup(null); setSelectedPlanId(null); }} />
                      </View>
                      <View className="flex-1">
                        <Button title="Tiếp tục" disabled={!selectedPlanId} onPress={handleNextStep} />
                      </View>
                    </View>
                  </>
                )}
              </View>
            )}

            {step === 3 && selectedPlan && (
              <View className="gap-four">
                <Text className="text-body-bold text-white">Xác nhận phiên thuê</Text>
                <View className="bg-surface border border-border rounded-panel p-four gap-three">
                  <View className="flex-row justify-between">
                    <Text className="text-small text-text-secondary">Địa điểm</Text>
                    <Text className="text-small-bold text-white">{selectedLocation?.name}</Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-small text-text-secondary">Kích thước</Text>
                    <Text className="text-small-bold text-white">{selectedSize === "SMALL" ? "Tủ nhỏ" : "Tủ lớn"}</Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-small text-text-secondary">Gói thuê</Text>
                    <Text className="text-small-bold text-white">{selectedPlan.name}</Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-small text-text-secondary">Thanh toán</Text>
                    <Text className="text-small-bold text-white">{paymentMethod === "VIETQR" ? "VietQR (PayOS)" : paymentMethod}</Text>
                  </View>
                  <View className="flex-row justify-between pt-one">
                    <Text className="text-body-bold text-white">Tổng tiền</Text>
                    <Text className="text-h3 text-brand font-bold">{formatCurrency(selectedPlan.price)}</Text>
                  </View>
                </View>

                <View className="bg-surface border border-border rounded-panel overflow-hidden">
                  {(["VIETQR", "MOMO", "ZALOPAY"] as PaymentMethod[]).map((method, index, arr) => (
                    <Pressable
                      key={method}
                      onPress={() => setPaymentMethod(method)}
                      className={`flex-row justify-between items-center p-four ${index < arr.length - 1 ? "border-b border-border/40" : ""}`}
                    >
                      <Text className="text-body text-white">{method}</Text>
                      <View className={`w-5 h-5 rounded-full border items-center justify-center ${paymentMethod === method ? "border-brand" : "border-border"}`}>
                        {paymentMethod === method ? <View className="w-3 h-3 rounded-full bg-brand" /> : null}
                      </View>
                    </Pressable>
                  ))}
                </View>

                <View className="flex-row gap-three">
                  <View className="flex-1">
                    <Button title="Quay lại" variant="secondary" onPress={() => setStep(2)} />
                  </View>
                  <View className="flex-1">
                    <Button title="Thanh toán" onPress={handlePayment} disabled={!isOnline} />
                  </View>
                </View>
              </View>
            )}

            {step === 4 && payment && (
              <View className="gap-five items-center pt-four">
                <Text className="text-h3 text-white font-bold text-center">Quét mã VietQR để thanh toán</Text>
                
                <QrCodeDisplay
                  value={payment.qrCode}
                  code={String(payment.orderCode)}
                  size={220}
                />

                <Text className="text-h3 text-brand font-bold">{formatCurrency(payment.amount)}</Text>
                <Text className="text-small text-text-secondary">Thời gian còn lại: {countdownText}</Text>
                
                <View className="w-full mt-four">
                  <Button
                    title="Hủy thanh toán"
                    variant="secondary"
                    onPress={() => setStep(3)}
                  />
                </View>
              </View>
            )}

            {step === 5 && currentRental && (
              <View className="gap-five items-center pt-four">
                <View className="w-16 h-16 rounded-full bg-success-bg border border-success items-center justify-center mb-two">
                  <Ionicons name="checkmark-circle" size={40} color="#00C853" />
                </View>
                <View className="items-center">
                  <Text className="text-h2 text-white font-bold text-center">Thuê tủ thành công</Text>
                  <Text className="text-body text-text-secondary text-center mt-one px-four">
                    Thanh toán thành công, hệ thống đã ghi nhận phiên thuê của bạn.
                  </Text>
                </View>

                <QrCodeDisplay
                  value={currentRental.qrToken}
                  code={currentRental.code}
                  size={180}
                />

                <View className="bg-surface border border-border rounded-panel p-four w-full gap-two">
                  <View className="flex-row justify-between items-center">
                    <Text className="text-small text-text-secondary">Cabinet</Text>
                    <Text className="text-small-bold text-white">{currentRental.compartment.cabinet.name}</Text>
                  </View>
                  <View className="flex-row justify-between items-center">
                    <Text className="text-small text-text-secondary">Ngăn</Text>
                    <Text className="text-small-bold text-white">{currentRental.compartment.name}</Text>
                  </View>
                  <View className="flex-row justify-between items-center">
                    <Text className="text-small text-text-secondary">Phiên thuê</Text>
                    <Text className="text-small-bold text-white">{currentRental.id}</Text>
                  </View>
                </View>

                <View className="w-full">
                  <Button
                    title="Xem chi tiết phiên thuê"
                    onPress={() => router.replace(`/rental/${createdRentalId || currentRental.id}` as any)}
                  />
                </View>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}
