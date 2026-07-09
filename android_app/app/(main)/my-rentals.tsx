import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Pressable, RefreshControl } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Badge from "../../src/components/ui/badge";
import SpringPressable from "../../src/components/ui/spring-pressable";
import Button from "../../src/components/ui/button";
import { RentalListSkeleton } from "../../src/components/ui/rental-list-skeleton";
import { useRentalStore } from "../../src/store/rentalStore";

function formatCountdown(expiresAt: string, nowMs: number) {
  const seconds = Math.max(0, Math.floor((new Date(expiresAt).getTime() - nowMs) / 1000));
  if (seconds <= 0) return "Đã hết hạn";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return h > 0 ? `Còn ${h}h ${m}p` : `Còn ${m}p`;
}

export default function MyRentalsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const rentals = useRentalStore((state) => state.rentals);
  const fetchRentals = useRentalStore((state) => state.fetchRentals);
  const isLoading = useRentalStore((state) => state.isLoading);
  const [now, setNow] = useState(Date.now());
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchRentals({ limit: 50 });
  }, [fetchRentals]);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const activeRentals = rentals.filter((item) => item.status === "ACTIVE");

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <View className="flex-row justify-between items-center px-four py-three border-b border-border/40 bg-surface/50">
        <View className="flex-row items-center">
          <Pressable
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full items-center justify-center bg-surface border border-border"
          >
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </Pressable>
          <Text className="text-h3 text-white font-bold ml-three">Tủ của tôi</Text>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-four py-four"
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={async () => { setRefreshing(true); await fetchRentals({ limit: 50 }); setRefreshing(false); }}
            tintColor="#FF6600"
            colors={["#FF6600"]}
          />
        }
      >
        {isLoading ? (
          <RentalListSkeleton />
        ) : activeRentals.length > 0 ? (
          <View className="gap-three">
            {activeRentals.map((rental) => (
              <SpringPressable
                key={rental.id}
                onPress={() => router.push(`/rental/${rental.id}` as any)}
                className="bg-surface border border-border rounded-panel p-four"
                glowOnPress
              >
                <View className="flex-row justify-between items-center mb-two">
                  <Text className="text-body-bold text-white">
                    {rental.compartment?.cabinet?.name ?? "--"} - {rental.compartment?.name ?? "--"}
                  </Text>
                  <Badge label="Đang thuê" status="active" />
                </View>
                <Text className="text-caption text-text-secondary">
                  Mã truy cập: {rental.code}
                </Text>
                <Text className="text-caption text-text-secondary mt-one">
                  Gói: {rental.pricePlan?.name}
                </Text>
                <View className="flex-row justify-between items-center mt-three">
                  <Text className="text-small text-text-secondary">
                    {rental.openCount}/{rental.maxOpens} lượt mở
                  </Text>
                  <Text className="text-small-bold text-brand">{formatCountdown(rental.expiresAt, now)}</Text>
                </View>
              </SpringPressable>
            ))}
          </View>
        ) : (
          <View className="items-center justify-center py-six mt-six gap-four">
            <MaterialCommunityIcons name="history" size={40} color="#6B6B6A" />
            <View className="items-center gap-one">
              <Text className="text-body-bold text-white">Không có tủ nào đang sử dụng</Text>
              <Text className="text-caption text-text-secondary text-center px-six">
                Hãy thuê một tủ mới để bắt đầu.
              </Text>
            </View>
            <Button title="Thuê tủ mới" onPress={() => router.push("/locations")} />
          </View>
        )}
      </ScrollView>
    </View>
  );
}
