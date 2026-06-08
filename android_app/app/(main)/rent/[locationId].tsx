import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Platform,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";

import Button from "../../../src/components/ui/button";
import Badge from "../../../src/components/ui/badge";
import SpringPressable from "../../../src/components/ui/spring-pressable";

const LOCATION_NAMES: Record<string, string> = {
  "a3-campus-a": "Kiosk Nhà A3 - Campus A",
  "ktx-b10": "Cổng Ký Túc Xá B10",
  "lib-tqb": "Thư viện Tạ Quang Bửu",
  "parking-d3": "Nhà xe D3 - Campus B",
  "sports-outdoor": "Khu Thể thao Ngoài trời",
};

export default function RentFlowScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { locationId } = useLocalSearchParams();

  const locationName = LOCATION_NAMES[locationId as string] || "Trạm Tủ SmartBox";

  const [step, setStep] = useState(1);
  const [selectedSize, setSelectedSize] = useState<"SMALL" | "LARGE" | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<"once" | "daily" | "monthly" | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"vietqr" | "momo" | "zalopay">("vietqr");

  // Determine pricing dynamically based on size & plan
  const getPrice = (size: "SMALL" | "LARGE", plan: "once" | "daily" | "monthly") => {
    if (size === "SMALL") {
      switch (plan) {
        case "once": return 15000;
        case "daily": return 50000;
        case "monthly": return 300000;
      }
    } else {
      switch (plan) {
        case "once": return 30000;
        case "daily": return 100000;
        case "monthly": return 600000;
      }
    }
  };

  const handleNextStep = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    if (step === 1 && !selectedSize) {
      alert("Vui lòng chọn kích thước tủ.");
      return;
    }
    if (step === 2 && !selectedPlan) {
      alert("Vui lòng chọn gói thuê.");
      return;
    }
    setStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setStep((prev) => prev - 1);
  };

  const handlePayment = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setStep(4);
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("vi-VN") + "đ";
  };

  // Render Step Indicators (Bước 1/3 etc)
  const renderStepperHeader = () => {
    if (step > 3) return null; // hide on success screen
    return (
      <View className="px-four py-four bg-surface/30 border-b border-border/40 items-center">
        <Text className="text-small text-text-secondary mb-three">
          Bước {step}/3: {step === 1 ? "Chọn kích thước" : step === 2 ? "Chọn gói thuê" : "Thanh toán"}
        </Text>
        
        {/* Connection line & dot indicators */}
        <View className="w-48 h-1 bg-border/40 relative flex-row justify-between items-center mt-one">
          {/* Active orange background line fill */}
          <View 
            className="absolute left-0 h-1 bg-brand transition-all duration-300"
            style={{ width: step === 1 ? "0%" : step === 2 ? "50%" : "100%" }}
          />
          {/* Dot 1 */}
          <View className={`w-3.5 h-3.5 rounded-full border-2 ${step >= 1 ? "bg-brand border-brand" : "bg-background border-border"}`} />
          {/* Dot 2 */}
          <View className={`w-3.5 h-3.5 rounded-full border-2 ${step >= 2 ? "bg-brand border-brand" : "bg-background border-border"}`} />
          {/* Dot 3 */}
          <View className={`w-3.5 h-3.5 rounded-full border-2 ${step >= 3 ? "bg-brand border-brand" : "bg-background border-border"}`} />
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="flex-row items-center px-four py-three border-b border-border/40 bg-surface/50">
        {step < 4 && (
          <Pressable
            onPress={step === 1 ? () => router.back() : handlePrevStep}
            className="w-10 h-10 rounded-full items-center justify-center bg-surface border border-border"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </Pressable>
        )}
        <Text className="text-h3 text-white font-bold ml-three">
          {step === 4 ? "Thuê thành công" : locationName}
        </Text>
      </View>

      {/* Stepper progress */}
      {renderStepperHeader()}

      <ScrollView
        className="flex-1 px-four"
        contentContainerStyle={{ paddingBottom: insets.bottom + 24, paddingTop: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* STEP 1: Select Cabinet Size */}
        {step === 1 && (
          <View className="gap-four">
            <Text className="text-body-bold text-white mb-one">Chọn kích thước tủ phù hợp:</Text>
            
            {/* Small Cabinet Card */}
            <SpringPressable
              onPress={() => setSelectedSize("SMALL")}
              className={`bg-surface border p-four rounded-panel flex-row justify-between items-center ${
                selectedSize === "SMALL" ? "border-brand bg-brand-glow/5" : "border-border"
              }`}
            >
              <View className="flex-1 pr-four">
                <View className="flex-row items-center gap-two">
                  <MaterialCommunityIcons name="cube-outline" size={24} color={selectedSize === "SMALL" ? "#FF6600" : "#A1A1A0"} />
                  <Text className="text-body-bold text-white font-sans">Tủ Nhỏ (SMALL)</Text>
                </View>
                <Text className="text-caption text-text-secondary mt-two">
                  Kích thước: 30 x 40 x 50 cm
                </Text>
                <Text className="text-caption text-text-muted mt-one">
                  Phù hợp cho balo đi học, laptop, tài liệu, vật dụng nhỏ cá nhân.
                </Text>
              </View>
              {selectedSize === "SMALL" ? (
                <View className="w-6 h-6 rounded-full bg-brand items-center justify-center">
                  <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                </View>
              ) : (
                <View className="w-6 h-6 rounded-full border border-border" />
              )}
            </SpringPressable>

            {/* Large Cabinet Card */}
            <SpringPressable
              onPress={() => setSelectedSize("LARGE")}
              className={`bg-surface border p-four rounded-panel flex-row justify-between items-center ${
                selectedSize === "LARGE" ? "border-brand bg-brand-glow/5" : "border-border"
              }`}
            >
              <View className="flex-1 pr-four">
                <View className="flex-row items-center gap-two">
                  <MaterialCommunityIcons name="cube" size={24} color={selectedSize === "LARGE" ? "#FF6600" : "#A1A1A0"} />
                  <Text className="text-body-bold text-white font-sans">Tủ Lớn (LARGE)</Text>
                </View>
                <Text className="text-caption text-text-secondary mt-two">
                  Kích thước: 60 x 40 x 50 cm
                </Text>
                <Text className="text-caption text-text-muted mt-one">
                  Phù hợp cho vali du lịch, túi thể thao lớn, mũ bảo hiểm fullface, nhiều đồ vật.
                </Text>
              </View>
              {selectedSize === "LARGE" ? (
                <View className="w-6 h-6 rounded-full bg-brand items-center justify-center">
                  <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                </View>
              ) : (
                <View className="w-6 h-6 rounded-full border border-border" />
              )}
            </SpringPressable>

            <View className="mt-five">
              <Button title="Tiếp tục" disabled={!selectedSize} onPress={handleNextStep} />
            </View>
          </View>
        )}

        {/* STEP 2: Select Rental Plan */}
        {step === 2 && selectedSize && (
          <View className="gap-four">
            <Text className="text-body-bold text-white mb-one">Chọn gói thuê mong muốn:</Text>
            
            {/* Once plan */}
            <SpringPressable
              onPress={() => setSelectedPlan("once")}
              className={`bg-surface border p-four rounded-panel flex-row justify-between items-center ${
                selectedPlan === "once" ? "border-brand bg-brand-glow/5" : "border-border"
              }`}
            >
              <View className="flex-1 pr-four">
                <Text className="text-body-bold text-white font-sans">Thuê một lần (Single)</Text>
                <Text className="text-caption text-text-secondary mt-one">
                  Mở tủ 1 lần duy nhất trong ngày.
                </Text>
                <Text className="text-body-bold text-brand mt-two">
                  {formatCurrency(getPrice(selectedSize, "once"))}
                </Text>
              </View>
              {selectedPlan === "once" ? (
                <View className="w-6 h-6 rounded-full bg-brand items-center justify-center">
                  <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                </View>
              ) : (
                <View className="w-6 h-6 rounded-full border border-border" />
              )}
            </SpringPressable>

            {/* Daily plan */}
            <SpringPressable
              onPress={() => setSelectedPlan("daily")}
              className={`bg-surface border p-four rounded-panel flex-row justify-between items-center ${
                selectedPlan === "daily" ? "border-brand bg-brand-glow/5" : "border-border"
              }`}
            >
              <View className="flex-1 pr-four">
                <View className="flex-row items-center gap-two">
                  <Text className="text-body-bold text-white font-sans">Thuê theo ngày (Daily)</Text>
                  <Badge label="Tiết kiệm" status="active" />
                </View>
                <Text className="text-caption text-text-secondary mt-one">
                  Mở tủ không giới hạn số lần (tối đa 3 lần) trong vòng 24 giờ.
                </Text>
                <Text className="text-body-bold text-brand mt-two">
                  {formatCurrency(getPrice(selectedSize, "daily"))}
                </Text>
              </View>
              {selectedPlan === "daily" ? (
                <View className="w-6 h-6 rounded-full bg-brand items-center justify-center">
                  <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                </View>
              ) : (
                <View className="w-6 h-6 rounded-full border border-border" />
              )}
            </SpringPressable>

            {/* Monthly plan */}
            <SpringPressable
              onPress={() => setSelectedPlan("monthly")}
              className={`bg-surface border p-four rounded-panel flex-row justify-between items-center ${
                selectedPlan === "monthly" ? "border-brand bg-brand-glow/5" : "border-border"
              }`}
            >
              <View className="flex-1 pr-four">
                <View className="flex-row items-center gap-two">
                  <Text className="text-body-bold text-white font-sans">Thuê theo tháng (Monthly)</Text>
                  <Badge label="Ưu đãi" status="warning" />
                </View>
                <Text className="text-caption text-text-secondary mt-one">
                  Dành riêng cho nhu cầu lưu trữ lâu dài của sinh viên.
                </Text>
                <Text className="text-body-bold text-brand mt-two">
                  {formatCurrency(getPrice(selectedSize, "monthly"))}
                </Text>
              </View>
              {selectedPlan === "monthly" ? (
                <View className="w-6 h-6 rounded-full bg-brand items-center justify-center">
                  <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                </View>
              ) : (
                <View className="w-6 h-6 rounded-full border border-border" />
              )}
            </SpringPressable>

            <View className="flex-row gap-three mt-five">
              <View className="flex-1">
                <Button title="Quay lại" variant="secondary" onPress={handlePrevStep} />
              </View>
              <View className="flex-1">
                <Button title="Tiếp tục" disabled={!selectedPlan} onPress={handleNextStep} />
              </View>
            </View>
          </View>
        )}

        {/* STEP 3: Payment & Summary */}
        {step === 3 && selectedSize && selectedPlan && (
          <View className="gap-four">
            <Text className="text-body-bold text-white mb-one">Xác nhận thông tin & Thanh toán:</Text>
            
            {/* Itemized Bill Receipt */}
            <View className="bg-surface border border-border rounded-panel p-four gap-three">
              <View className="flex-row justify-between items-center border-b border-border/40 pb-three">
                <Text className="text-small text-text-secondary">Địa điểm tủ</Text>
                <Text className="text-small-bold text-white">{locationName}</Text>
              </View>

              <View className="flex-row justify-between items-center border-b border-border/40 pb-three">
                <Text className="text-small text-text-secondary">Kích thước</Text>
                <Text className="text-small-bold text-white">
                  {selectedSize === "SMALL" ? "Tủ Nhỏ" : "Tủ Lớn"}
                </Text>
              </View>

              <View className="flex-row justify-between items-center border-b border-border/40 pb-three">
                <Text className="text-small text-text-secondary">Gói thuê</Text>
                <Text className="text-small-bold text-white">
                  {selectedPlan === "once" ? "Thuê một lần" : selectedPlan === "daily" ? "Thuê theo ngày" : "Thuê theo tháng"}
                </Text>
              </View>

              <View className="flex-row justify-between items-center pt-one">
                <Text className="text-body-bold text-white">Tổng tiền thanh toán</Text>
                <Text className="text-h3 text-brand font-bold">
                  {formatCurrency(getPrice(selectedSize, selectedPlan))}
                </Text>
              </View>
            </View>

            {/* Payment Method Selector */}
            <Text className="text-body-bold text-white mt-two mb-one">Chọn phương thức thanh toán:</Text>
            <View className="bg-surface border border-border rounded-panel overflow-hidden">
              {/* VietQR */}
              <Pressable
                onPress={() => setPaymentMethod("vietqr")}
                className={`flex-row justify-between items-center p-four border-b border-border/40 active:bg-surface-elevated ${
                  paymentMethod === "vietqr" ? "bg-brand-glow/5" : ""
                }`}
              >
                <View className="flex-row items-center gap-three">
                  <MaterialCommunityIcons name="qrcode-scan" size={20} color="#FF6600" />
                  <Text className="text-body text-white font-sans">Chuyển khoản VietQR</Text>
                </View>
                <View className={`w-5 h-5 rounded-full border items-center justify-center ${paymentMethod === "vietqr" ? "border-brand" : "border-border"}`}>
                  {paymentMethod === "vietqr" && <View className="w-3 h-3 rounded-full bg-brand" />}
                </View>
              </Pressable>

              {/* MoMo */}
              <Pressable
                onPress={() => setPaymentMethod("momo")}
                className={`flex-row justify-between items-center p-four border-b border-border/40 active:bg-surface-elevated ${
                  paymentMethod === "momo" ? "bg-brand-glow/5" : ""
                }`}
              >
                <View className="flex-row items-center gap-three">
                  <Ionicons name="wallet-outline" size={20} color="#FF6600" />
                  <Text className="text-body text-white font-sans">Ví điện tử MoMo</Text>
                </View>
                <View className={`w-5 h-5 rounded-full border items-center justify-center ${paymentMethod === "momo" ? "border-brand" : "border-border"}`}>
                  {paymentMethod === "momo" && <View className="w-3 h-3 rounded-full bg-brand" />}
                </View>
              </Pressable>

              {/* ZaloPay */}
              <Pressable
                onPress={() => setPaymentMethod("zalopay")}
                className={`flex-row justify-between items-center p-four active:bg-surface-elevated ${
                  paymentMethod === "zalopay" ? "bg-brand-glow/5" : ""
                }`}
              >
                <View className="flex-row items-center gap-three">
                  <Ionicons name="cash-outline" size={20} color="#FF6600" />
                  <Text className="text-body text-white font-sans">Ví điện tử ZaloPay</Text>
                </View>
                <View className={`w-5 h-5 rounded-full border items-center justify-center ${paymentMethod === "zalopay" ? "border-brand" : "border-border"}`}>
                  {paymentMethod === "zalopay" && <View className="w-3 h-3 rounded-full bg-brand" />}
                </View>
              </Pressable>
            </View>

            <View className="flex-row gap-three mt-five">
              <View className="flex-1">
                <Button title="Quay lại" variant="secondary" onPress={handlePrevStep} />
              </View>
              <View className="flex-1">
                <Button title="Thanh toán" onPress={handlePayment} />
              </View>
            </View>
          </View>
        )}

        {/* STEP 4: Success Screen (Receipt) */}
        {step === 4 && selectedSize && selectedPlan && (
          <View className="gap-five items-center pt-four">
            <View className="w-16 h-16 rounded-full bg-success-bg border border-success items-center justify-center mb-two">
              <Ionicons name="checkmark-circle" size={40} color="#00C853" />
            </View>
            
            <View className="items-center">
              <Text className="text-h2 text-white font-bold text-center">Thuê tủ thành công!</Text>
              <Text className="text-body text-text-secondary text-center mt-one px-four">
                Vui lòng đến trạm tủ để thực hiện nhận và mở tủ lưu trữ.
              </Text>
            </View>

            {/* Generated QR Code Simulation card */}
            <View className="bg-white p-five rounded-panel border-4 border-black shadow-lg items-center my-two">
              <Ionicons name="qr-code" size={200} color="#000000" />
              <View className="bg-black/5 px-four py-one.5 rounded-badge border border-black/10 mt-three">
                <Text className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Mã QR truy cập tủ</Text>
              </View>
            </View>

            {/* OTP Access Box */}
            <View className="items-center bg-surface border border-border rounded-panel px-six py-four w-full">
              <Text className="text-small-bold text-text-secondary uppercase tracking-widest">
                MÃ PIN TRUY CẬP TỦ (OTP)
              </Text>
              <Text className="text-otp-large text-brand font-bold mt-two font-mono">
                987 654
              </Text>
              <Text className="text-caption text-text-muted mt-two text-center">
                Mã này được sử dụng trực tiếp tại màn hình tủ Kiosk.
              </Text>
            </View>

            {/* Receipt Summary Grid */}
            <View className="bg-surface border border-border rounded-panel p-four w-full gap-two mt-two">
              <View className="flex-row justify-between items-center">
                <Text className="text-small text-text-secondary">Địa điểm:</Text>
                <Text className="text-small-bold text-white">{locationName}</Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-small text-text-secondary">Tủ:</Text>
                <Text className="text-small-bold text-white">
                  Tủ #{Math.floor(Math.random() * 90) + 10} ({selectedSize === "SMALL" ? "Cỡ Nhỏ" : "Cỡ Lớn"})
                </Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-small text-text-secondary">Gói thuê:</Text>
                <Text className="text-small-bold text-white">
                  {selectedPlan === "once" ? "Một lần" : selectedPlan === "daily" ? "Theo ngày" : "Theo tháng"}
                </Text>
              </View>
            </View>

            <View className="w-full mt-five mb-four">
              <Button title="Về trang chủ" onPress={() => router.replace("/home")} />
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
