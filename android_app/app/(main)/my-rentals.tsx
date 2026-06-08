import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Modal,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";

import Button from "../../src/components/ui/button";
import Badge from "../../src/components/ui/badge";
import SpringPressable from "../../src/components/ui/spring-pressable";

interface RentalData {
  id: string;
  cabinet: string;
  location: string;
  status: "active" | "completed" | "expired";
  timeLeft?: number; // active countdown in seconds
  timestamp?: string; // completed/expired formatted date
  planName: string;
  openCount: number;
  maxOpens: number; // -1 for unlimited, or positive integer
  otp: string;
}

const INITIAL_RENTALS: RentalData[] = [
  {
    id: "42",
    cabinet: "Tủ A1 • Size Vừa",
    location: "Kiosk Nhà A3 - Campus A",
    status: "active",
    timeLeft: 9000, // 2h 30m
    planName: "Gói theo ngày (Daily)",
    openCount: 1,
    maxOpens: 3,
    otp: "123 456",
  },
  {
    id: "45",
    cabinet: "Tủ B3 • Size Nhỏ",
    location: "Cổng Ký Túc Xá B10",
    status: "active",
    timeLeft: 1800, // 30m
    planName: "Gói một lượt (Single)",
    openCount: 0,
    maxOpens: 1,
    otp: "234 567",
  },
  {
    id: "44",
    cabinet: "Tủ C2 • Size Lớn",
    location: "Thư viện Tạ Quang Bửu",
    status: "expired",
    timestamp: "10:00 - 01/06/2026",
    planName: "Gói theo tháng (Monthly)",
    openCount: 18,
    maxOpens: -1,
    otp: "345 678",
  },
];

export default function MyRentalsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [rentals, setRentals] = useState<RentalData[]>(INITIAL_RENTALS);
  const [selectedRentalForQR, setSelectedRentalForQR] = useState<RentalData | null>(null);

  // Active rental countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setRentals((prevRentals) =>
        prevRentals.map((rental) => {
          if (rental.status === "active" && rental.timeLeft && rental.timeLeft > 0) {
            return { ...rental, timeLeft: rental.timeLeft - 1 };
          } else if (rental.status === "active" && rental.timeLeft === 0) {
            return { ...rental, status: "expired", timeLeft: undefined, timestamp: "Hết hạn vừa xong" };
          }
          return rental;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Format countdown timer
  const formatCountdown = (seconds?: number) => {
    if (seconds === undefined || seconds <= 0) return "Đã hết hạn";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) {
      return `Còn ${h}h ${m}p`;
    }
    return `Còn ${m}p`;
  };

  // Only display active rentals
  const activeRentals = rentals.filter((rental) => rental.status === "active");

  const renderOpensInfo = (rental: RentalData) => {
    if (rental.maxOpens === -1) {
      return "Không giới hạn lượt";
    }
    const remaining = rental.maxOpens - rental.openCount;
    return `Còn lại ${remaining > 0 ? remaining : 0}/${rental.maxOpens} lượt mở`;
  };

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="flex-row justify-between items-center px-four py-three border-b border-border/40 bg-surface/50">
        <View className="flex-row items-center">
          <Pressable
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full items-center justify-center bg-surface border border-border"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </Pressable>
          <Text className="text-h3 text-white font-bold ml-three">Tủ đang sử dụng</Text>
        </View>

        <Pressable
          onPress={() => router.push("/notifications" as any)}
          className="w-10 h-10 rounded-avatar bg-surface items-center justify-center border border-border"
        >
          <Ionicons name="notifications-outline" size={20} color="#FFFFFF" />
        </Pressable>
      </View>

      {/* Rentals List */}
      <ScrollView
        className="flex-1 px-four py-four"
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
      >
        {activeRentals.length > 0 ? (
          <View className="gap-three">
            {activeRentals.map((rental) => (
              <SpringPressable
                key={rental.id}
                onPress={() => router.push(`/rental/${rental.id}` as any)}
                className="bg-surface border border-border rounded-panel p-four"
                glowOnPress
              >
                {/* Header card info */}
                <View className="flex-row justify-between items-center mb-two">
                  <Text className="text-body-bold text-white">{rental.cabinet}</Text>
                  <Badge label="Đang thuê" status="active" />
                </View>

                {/* Location and time/date */}
                <View className="flex-row items-center gap-two mt-one">
                  <MaterialCommunityIcons name="map-marker-outline" size={16} color="#A1A1A0" />
                  <Text className="text-small text-text-secondary" numberOfLines={1}>
                    {rental.location}
                  </Text>
                </View>

                {/* Plan type & remaining opens info */}
                <View className="flex-row justify-between items-center mt-two">
                  <View className="flex-row items-center gap-one">
                    <MaterialCommunityIcons name="tag-outline" size={14} color="#A1A1A0" />
                    <Text className="text-[12px] text-text-secondary">
                      {rental.planName}
                    </Text>
                  </View>
                  <Text className="text-[12px] text-brand font-bold">
                    {renderOpensInfo(rental)}
                  </Text>
                </View>

                <View className="flex-row items-center gap-two mt-two">
                  <MaterialCommunityIcons name="clock-outline" size={16} color="#A1A1A0" />
                  <Text className="text-small text-text-secondary">
                    <Text className="text-brand font-bold">
                      {formatCountdown(rental.timeLeft)}
                    </Text>
                  </Text>
                </View>

                {/* Divider & Full-width QR Button */}
                <View className="h-[1px] bg-border/40 my-three" />
                <View className="w-full">
                  <Button
                    title="Hiện mã QR truy cập"
                    variant="secondary"
                    onPress={() => setSelectedRentalForQR(rental)}
                  />
                </View>
              </SpringPressable>
            ))}
          </View>
        ) : (
          /* Empty State */
          <View className="items-center justify-center py-six mt-six gap-four">
            <View className="w-20 h-20 rounded-avatar bg-surface-glass border border-border items-center justify-center">
              <MaterialCommunityIcons name="history" size={40} color="#6B6B6A" />
            </View>
            <View className="items-center gap-one">
              <Text className="text-body-bold text-white">Không có tủ nào đang sử dụng</Text>
              <Text className="text-caption text-text-secondary text-center px-six">
                Hiện tại bạn không có tủ nào đang hoạt động.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* QR Fullscreen Modal */}
      {selectedRentalForQR && (
        <Modal
          visible={selectedRentalForQR !== null}
          transparent={false}
          animationType="fade"
          onRequestClose={() => setSelectedRentalForQR(null)}
        >
          <Pressable
            className="flex-1 bg-white items-center justify-center p-six"
            onPress={() => setSelectedRentalForQR(null)}
          >
            <View className="items-center gap-five">
              <View className="items-center">
                <Text className="text-h2 text-black font-bold text-center">
                  {selectedRentalForQR.cabinet}
                </Text>
                <Text className="text-body text-gray-500 text-center mt-one">
                  {selectedRentalForQR.location}
                </Text>
              </View>

              <View className="p-four border-4 border-black rounded-panel bg-white shadow-lg">
                <Ionicons name="qr-code" size={220} color="#000000" />
              </View>

              <View className="items-center">
                <Text className="text-small-bold text-gray-400 uppercase tracking-widest">
                  MÃ TRUY CẬP TỦ
                </Text>
                <Text className="text-otp-large text-black font-bold mt-two font-mono">
                  {selectedRentalForQR.otp}
                </Text>
              </View>

              <Text className="text-caption text-gray-400 text-center px-four mt-two">
                Quét mã QR tại trạm hoặc nhập mã truy cập ở trên để mở tủ. Chạm vào màn hình để quay lại.
              </Text>
            </View>
          </Pressable>
        </Modal>
      )}
    </View>
  );
}
