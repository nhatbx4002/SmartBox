import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Pressable, Alert, Modal } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Badge from "../../../src/components/ui/badge";
import Button from "../../../src/components/ui/button";
import { RentalDetailSkeleton } from "../../../src/components/ui/rental-skeleton";
import QrCodeDisplay from "../../../src/components/ui/qr-code-display";
import { useRentalStore } from "../../../src/store/rentalStore";
import { useIsOnline } from "../../../src/hooks/useIsOnline";

function formatCountdown(expiresAt: string, nowMs: number) {
  const seconds = Math.max(0, Math.floor((new Date(expiresAt).getTime() - nowMs) / 1000));
  if (seconds <= 0) return "Đã hết hạn";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h > 0 ? `${h} giờ ` : ""}${m} phút ${s} giây`;
}

export default function RentalDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const currentRental = useRentalStore((state) => state.currentRental);
  const fetchRentalDetail = useRentalStore((state) => state.fetchRentalDetail);
  const completeRental = useRentalStore((state) => state.completeRental);
  const isLoading = useRentalStore((state) => state.isLoading);
  const [now, setNow] = useState(Date.now());
  const [qrVisible, setQrVisible] = useState(false);
  const isOnline = useIsOnline();

  useEffect(() => {
    if (id) {
      fetchRentalDetail(String(id)).catch(() => undefined);
    }
  }, [fetchRentalDetail, id]);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleComplete = async () => {
    if (!id) return;
    try {
      await completeRental(String(id));
      Alert.alert("Hoàn tất", "Phiên thuê đã được kết thúc.");
    } catch (error: any) {
      Alert.alert("Không thể hoàn tất", error?.message || "Có lỗi xảy ra.");
    }
  };

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center px-four py-three border-b border-border/40 bg-surface/50">
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full items-center justify-center bg-surface border border-border"
        >
          <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
        </Pressable>
        <Text className="text-h3 text-white font-bold ml-three">Chi tiết phiên thuê</Text>
      </View>

      <ScrollView
        className="flex-1 px-four"
        contentContainerStyle={{ paddingBottom: insets.bottom + 24, paddingTop: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {isLoading || !currentRental ? (
          <RentalDetailSkeleton />
        ) : (
          <>
            <View className="bg-surface border border-border rounded-panel p-five items-center mb-four">
              <Badge
                label={currentRental.status === "ACTIVE" ? "Đang sử dụng" : currentRental.status}
                status={currentRental.status === "ACTIVE" ? "active" : "completed"}
              />
              <Text className="text-h2 text-white font-bold mt-three">
                {currentRental.compartment.cabinet.name} • {currentRental.compartment.name}
              </Text>
              <Text className="text-caption text-text-secondary mt-one">{currentRental.pricePlan.name}</Text>
              <Text className="text-small text-text-secondary mt-three">Mã truy cập</Text>
              <Text className="text-otp-large text-brand font-bold mt-one font-mono">{currentRental.code}</Text>
              {currentRental.status === "ACTIVE" ? (
                <Text className="text-caption text-text-secondary mt-two">
                  Còn lại: {formatCountdown(currentRental.expiresAt, now)}
                </Text>
              ) : null}
            </View>

            {currentRental.status === "ACTIVE" ? (
              <View className="bg-surface border border-border rounded-panel p-four items-center mb-four">
                <Text className="text-small-bold text-text-secondary mb-three">Quét QR để mở tủ</Text>
                <QrCodeDisplay
                  value={currentRental.qrToken}
                  code={currentRental.code}
                  size={160}
                  label=""
                />
                <Pressable onPress={() => setQrVisible(true)} className="mt-three">
                  <Text className="text-small-bold text-brand">Phóng to QR</Text>
                </Pressable>
              </View>
            ) : null}

            <Modal visible={qrVisible} animationType="fade" transparent onRequestClose={() => setQrVisible(false)}>
              <Pressable
                className="flex-1 bg-black/90 items-center justify-center"
                onPress={() => setQrVisible(false)}
              >
                <View className="bg-surface rounded-panel p-six items-center">
                  {currentRental && (
                    <QrCodeDisplay
                      value={currentRental.qrToken}
                      code={currentRental.code}
                      size={280}
                      label=""
                    />
                  )}
                  <Text className="text-caption text-text-secondary mt-four">Nhấn vào bất kỳ đâu để đóng</Text>
                </View>
              </Pressable>
            </Modal>

            <View className="bg-surface border border-border rounded-panel p-four mb-four gap-three">
              <View className="flex-row justify-between">
                <Text className="text-small text-text-secondary">Mở tủ</Text>
                <Text className="text-small-bold text-white">
                  {currentRental.openCount}/{currentRental.maxOpens}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-small text-text-secondary">Thanh toán</Text>
                <Text className="text-small-bold text-white">{currentRental.paymentStatus}</Text>
              </View>
            </View>

            {currentRental.status === "ACTIVE" ? (
              <View className="gap-three mb-four">
                <Button title="Hoàn tất phiên thuê" variant="secondary" onPress={handleComplete} disabled={!isOnline} />
              </View>
            ) : null}

            <View className="bg-surface border border-border rounded-panel p-five mb-four">
              <Text className="text-body-bold text-white mb-four">Lịch sử hoạt động</Text>
              <View className="gap-four">
                {currentRental.logs?.length ? (
                  currentRental.logs.map((log) => (
                    <View key={log.id} className="flex-row">
                      <View className="w-3.5 h-3.5 rounded-full bg-brand mr-three mt-one" />
                      <View className="flex-1">
                        <Text className="text-small-bold text-white">{log.action}</Text>
                        <Text className="text-[11px] text-text-secondary mt-half">
                          {new Date(log.createdAt).toLocaleString("vi-VN")}
                        </Text>
                      </View>
                    </View>
                  ))
                ) : (
                  <Text className="text-caption text-text-secondary">Chưa có log nào.</Text>
                )}
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}
