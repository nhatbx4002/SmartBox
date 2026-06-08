import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Modal,
  Platform,
  Clipboard,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";

import Badge from "../../../src/components/ui/badge";

interface RentalDetail {
  id: string;
  cabinet: string;
  location: string;
  status: "active" | "completed" | "expired";
  timeLeft: number; // in seconds
  otp: string;
  planName: string;
  openCount: number;
  maxOpens: number; // -1 for unlimited, or positive integer
  logs: { time: string; action: string }[];
}

const SAMPLE_RENTALS: Record<string, RentalDetail> = {
  "42": {
    id: "42",
    cabinet: "Tủ A1 • Size Vừa",
    location: "Kiosk Nhà A3 - Campus A",
    status: "active",
    timeLeft: 9000, // 2h 30m
    otp: "123 456",
    planName: "Gói theo ngày (Daily)",
    openCount: 1,
    maxOpens: 3,
    logs: [
      { time: "10:05", action: "Đóng tủ thành công tại Kiosk" },
      { time: "09:30", action: "Thanh toán & nhận tủ" },
    ],
  },
  "43": {
    id: "43",
    cabinet: "Tủ B3 • Size Nhỏ",
    location: "Cổng Ký Túc Xá B10",
    status: "completed",
    timeLeft: 0,
    otp: "234 567",
    planName: "Gói một lượt mở (Single)",
    openCount: 1,
    maxOpens: 1,
    logs: [
      { time: "15:30", action: "Hoàn tất thuê tủ" },
      { time: "12:00", action: "Mở tủ cất đồ" },
      { time: "08:00", action: "Thanh toán & nhận tủ" },
    ],
  },
  "44": {
    id: "44",
    cabinet: "Tủ C2 • Size Lớn",
    location: "Thư viện Tạ Quang Bửu",
    status: "expired",
    timeLeft: 0,
    otp: "345 678",
    planName: "Gói theo tháng (Monthly)",
    openCount: 18,
    maxOpens: -1, // Unlimited
    logs: [
      { time: "10:00", action: "Gói thuê hết hạn" },
      { time: "09:00", action: "Mở tủ lấy đồ tại Kiosk" },
      { time: "09:00 - 31/05", action: "Thanh toán & nhận tủ" },
    ],
  },
};

export default function RentalDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams();

  const rentalData = SAMPLE_RENTALS[id as string] || SAMPLE_RENTALS["42"];

  const [timeLeft, setTimeLeft] = useState(rentalData.timeLeft);
  const [isQRModalVisible, setIsQRModalVisible] = useState(false);

  // Real-time countdown
  useEffect(() => {
    if (rentalData.status !== "active" || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [rentalData.status]);

  const formatCountdown = (seconds: number) => {
    if (seconds <= 0) return "Đã hết hạn";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    
    const hStr = h > 0 ? `${h} giờ ` : "";
    const mStr = `${m} phút `;
    const sStr = `${s} giây`;
    
    return `${hStr}${mStr}${sStr}`;
  };

  // Get timer text color based on remaining duration
  const getTimerColor = () => {
    if (timeLeft <= 0) return "text-error";
    if (timeLeft < 600) return "text-error"; // < 10 minutes
    if (timeLeft < 3600) return "text-warning"; // < 1 hour
    return "text-brand";
  };

  const handleCopyOTP = () => {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    Clipboard.setString(rentalData.otp);
    alert("Đã sao chép mã PIN truy cập tủ.");
  };

  const renderOpensInfo = () => {
    if (rentalData.maxOpens === -1) {
      return "Không giới hạn";
    }
    const remaining = rentalData.maxOpens - rentalData.openCount;
    return `Còn ${remaining > 0 ? remaining : 0}/${rentalData.maxOpens} lượt`;
  };

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="flex-row items-center px-four py-three border-b border-border/40 bg-surface/50">
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full items-center justify-center bg-surface border border-border"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
        </Pressable>
        <Text className="text-h3 text-white font-bold ml-three">Chi tiết tủ thuê</Text>
      </View>

      <ScrollView
        className="flex-1 px-four"
        contentContainerStyle={{ paddingBottom: insets.bottom + 24, paddingTop: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Status Dashboard */}
        <View className="bg-surface border border-border rounded-panel p-five items-center mb-four">
          <Badge
            label={
              rentalData.status === "active"
                ? "Đang sử dụng"
                : rentalData.status === "completed"
                ? "Đã trả tủ"
                : "Đã hết hạn"
            }
            status={
              rentalData.status === "active"
                ? "active"
                : rentalData.status === "completed"
                ? "completed"
                : "expired"
            }
          />
          <Text className="text-h2 text-white font-bold mt-three">{rentalData.cabinet}</Text>
          <Text className="text-caption text-text-secondary mt-one">{rentalData.location}</Text>

          {/* Plan & Opens summary info */}
          <View className="w-full flex-row justify-around border-t border-b border-border/40 py-three mt-four gap-two">
            <View className="items-center">
              <Text className="text-small text-text-secondary">Gói thuê</Text>
              <Text className="text-body-bold text-white mt-one">{rentalData.planName}</Text>
            </View>
            <View className="w-[1px] bg-border/40 h-8 self-center" />
            <View className="items-center">
              <Text className="text-small text-text-secondary">Lượt mở tủ</Text>
              <Text className="text-body-bold text-brand mt-one">{renderOpensInfo()}</Text>
            </View>
          </View>

          {rentalData.status === "active" && (
            <View className="items-center mt-four">
              <Text className="text-small text-text-secondary">Thời gian còn lại:</Text>
              <Text className={`text-h2 font-bold font-sans mt-one ${getTimerColor()}`}>
                {formatCountdown(timeLeft)}
              </Text>
            </View>
          )}
        </View>

        {rentalData.status === "active" && (
          <>
            {/* Quick QR & OTP access card */}
            <View className="flex-row gap-three mb-four">
              {/* Mini QR Card */}
              <Pressable
                onPress={() => setIsQRModalVisible(true)}
                className="flex-1 bg-surface border border-border rounded-panel p-four items-center justify-center active:bg-surface-elevated"
              >
                <Ionicons name="qr-code" size={32} color="#FF6600" />
                <Text className="text-small-bold text-white mt-two">Xem mã QR</Text>
                <Text className="text-[10px] text-text-secondary mt-half">Quét nhanh tại tủ</Text>
              </Pressable>

              {/* OTP Access Box */}
              <View className="flex-1 bg-surface border border-border rounded-panel p-four items-center justify-center relative">
                <Text className="text-small-bold text-text-secondary uppercase tracking-wider">MÃ OTP</Text>
                <Text className="text-h3 text-white font-bold font-mono mt-one">{rentalData.otp}</Text>
                
                <Pressable
                  onPress={handleCopyOTP}
                  className="absolute top-two right-two w-7 h-7 bg-surface-elevated border border-border rounded-full items-center justify-center"
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <MaterialCommunityIcons name="content-copy" size={12} color="#FF6600" />
                </Pressable>
              </View>
            </View>
          </>
        )}

        {/* Activity Timeline */}
        <View className="bg-surface border border-border rounded-panel p-five mb-four">
          <Text className="text-body-bold text-white mb-four">Lịch sử hoạt động</Text>
          
          <View className="gap-four">
            {rentalData.logs.map((log, index) => {
              const isLast = index === rentalData.logs.length - 1;
              return (
                <View key={index} className="flex-row relative">
                  {/* Vertical line connector */}
                  {!isLast && (
                    <View className="absolute left-[5px] top-[14px] bottom-[-20px] w-[2px] bg-border/40" />
                  )}

                  {/* Bullet Dot */}
                  <View className="w-3.5 h-3.5 rounded-full bg-brand items-center justify-center z-10 mr-three mt-[3px]">
                    <View className="w-1.5 h-1.5 rounded-full bg-white" />
                  </View>

                  <View className="flex-1">
                    <Text className="text-small-bold text-white">{log.action}</Text>
                    <Text className="text-[11px] text-text-secondary mt-half">{log.time}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* QR Fullscreen Modal */}
      <Modal
        visible={isQRModalVisible}
        transparent={false}
        animationType="fade"
        onRequestClose={() => setIsQRModalVisible(false)}
      >
        <Pressable
          className="flex-1 bg-white items-center justify-center p-six"
          onPress={() => setIsQRModalVisible(false)}
        >
          <View className="items-center gap-five">
            <View className="items-center">
              <Text className="text-h2 text-black font-bold text-center">{rentalData.cabinet}</Text>
              <Text className="text-body text-gray-500 text-center mt-one">{rentalData.location}</Text>
            </View>

            <View className="p-four border-4 border-black rounded-panel bg-white shadow-lg">
              <Ionicons name="qr-code" size={220} color="#000000" />
            </View>

            <View className="items-center">
              <Text className="text-small-bold text-gray-400 uppercase tracking-widest">MÃ TRUY CẬP TỦ</Text>
              <Text className="text-otp-large text-black font-bold mt-two font-mono">{rentalData.otp}</Text>
            </View>

            <Text className="text-caption text-gray-400 text-center px-four mt-two">
              Quét mã QR tại trạm hoặc nhập mã truy cập ở trên để mở tủ. Chạm vào màn hình để quay lại.
            </Text>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
