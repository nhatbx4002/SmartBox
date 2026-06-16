import React, { useEffect, useMemo, useState } from "react";
import { View, Text, ScrollView, Pressable, ActivityIndicator, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Button from "../../../src/components/ui/button";
import Badge from "../../../src/components/ui/badge";
import SpringPressable from "../../../src/components/ui/spring-pressable";
import QrCodeDisplay from "../../../src/components/ui/qr-code-display";
import { PaymentMethod, PricePlan } from "../../../src/types";
import { useLocationStore } from "../../../src/store/locationStore";
import { useRentalStore } from "../../../src/store/rentalStore";

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

  const selectedPlan = useMemo(
    () => sizePlans.find((plan) => plan.id === selectedPlanId) || null,
    [selectedPlanId, sizePlans],
  );

  const activeCabinetId = useMemo(() => {
    const activeCabinet = selectedLocation?.cabinets.find((cabinet) => cabinet.isOnline);
    return activeCabinet?.id || selectedLocation?.cabinets[0]?.id;
  }, [selectedLocation]);

  const formatCurrency = (amount: number) => amount.toLocaleString("vi-VN") + "đ";

  const handleNextStep = async () => {
    if (step === 1 && !selectedSize) {
      Alert.alert("Thiếu thông tin", "Vui lòng chọn kích thước tủ.");
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
      setStep(4);
    } catch (error: any) {
      Alert.alert("Không thể tạo phiên thuê", error?.message || "Có lỗi xảy ra.");
    }
  };

  const loading = isLocationLoading || isRentalLoading;

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center px-four py-three border-b border-border/40 bg-surface/50">
        {step < 4 && (
          <Pressable
            onPress={step === 1 ? () => router.back() : () => setStep((prev) => prev - 1)}
            className="w-10 h-10 rounded-full items-center justify-center bg-surface border border-border"
          >
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </Pressable>
        )}
        <Text className="text-h3 text-white font-bold ml-three">
          {step === 4 ? "Thuê thành công" : selectedLocation?.name || "Thuê tủ"}
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-four"
        contentContainerStyle={{ paddingBottom: insets.bottom + 24, paddingTop: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {loading && step !== 4 ? (
          <ActivityIndicator color="#FF6600" />
        ) : (
          <>
            {step < 4 && (
              <View className="px-four py-four bg-surface/30 border border-border/40 rounded-panel items-center mb-four">
                <Text className="text-small text-text-secondary mb-three">
                  Bước {step}/3
                </Text>
                <Text className="text-caption text-text-secondary">
                  {step === 1 ? "Chọn kích thước" : step === 2 ? "Chọn gói thuê" : "Xác nhận thanh toán mock"}
                </Text>
              </View>
            )}

            {step === 1 && (
              <View className="gap-four">
                <Text className="text-body-bold text-white">Chọn kích thước tủ</Text>
                {(["SMALL", "LARGE"] as const).map((size) => (
                  <SpringPressable
                    key={size}
                    onPress={() => {
                      setSelectedSize(size);
                      setSelectedPlanId(null);
                    }}
                    className={`bg-surface border p-four rounded-panel ${selectedSize === size ? "border-brand" : "border-border"}`}
                  >
                    <Text className="text-body-bold text-white">{size === "SMALL" ? "Tủ nhỏ" : "Tủ lớn"}</Text>
                    <Text className="text-caption text-text-secondary mt-two">
                      {size === "SMALL" ? "Phù hợp balo, laptop, tài liệu." : "Phù hợp vali, túi lớn, nhiều đồ."}
                    </Text>
                  </SpringPressable>
                ))}
                <Button
                  title="Tiếp tục"
                  disabled={!selectedSize}
                  onPress={handleNextStep}
                />
              </View>
            )}

            {step === 2 && (
              <View className="gap-four">
                <Text className="text-body-bold text-white">Chọn gói thuê</Text>
                {plansLoading ? (
                  <View className="items-center py-eight">
                    <ActivityIndicator color="#FF6600" />
                  </View>
                ) : sizePlans.length === 0 ? (
                  <Text className="text-caption text-text-secondary">Không có gói thuê cho kích thước này.</Text>
                ) : (
                  <>
                {sizePlans.map((plan: PricePlan) => (
                  <SpringPressable
                    key={plan.id}
                    onPress={() => setSelectedPlanId(plan.id)}
                    className={`bg-surface border p-four rounded-panel ${selectedPlanId === plan.id ? "border-brand" : "border-border"}`}
                  >
                    <View className="flex-row justify-between items-start">
                      <View className="flex-1 pr-three">
                        <Text className="text-body-bold text-white">{plan.name}</Text>
                        <Text className="text-caption text-text-secondary mt-one">
                          {plan.description || `${plan.durationDays} ngày • tối đa ${plan.maxOpens ?? "không giới hạn"} lượt mở`}
                        </Text>
                      </View>
                      <Badge label={formatCurrency(plan.price)} status="active" />
                    </View>
                  </SpringPressable>
                ))}
                  </>
                )}
                <View className="flex-row gap-three">
                  <View className="flex-1">
                    <Button title="Quay lại" variant="secondary" onPress={() => setStep(1)} />
                  </View>
                  <View className="flex-1">
                    <Button title="Tiếp tục" disabled={!selectedPlanId} onPress={handleNextStep} />
                  </View>
                </View>
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
                    <Text className="text-small-bold text-white">Mock payment</Text>
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
                    <Button title="Thanh toán" onPress={handlePayment} />
                  </View>
                </View>
              </View>
            )}

            {step === 4 && currentRental && (
              <View className="gap-five items-center pt-four">
                <View className="w-16 h-16 rounded-full bg-success-bg border border-success items-center justify-center mb-two">
                  <Ionicons name="checkmark-circle" size={40} color="#00C853" />
                </View>
                <View className="items-center">
                  <Text className="text-h2 text-white font-bold text-center">Thuê tủ thành công</Text>
                  <Text className="text-body text-text-secondary text-center mt-one px-four">
                    Thanh toán được mock, backend đã tạo phiên thuê thật cho bạn.
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
