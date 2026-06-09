import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Platform,
  Linking,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import * as ExpoLocation from "expo-location";
import OmniBoxIcon from "../../assets/Logos/omnibox-icon-small.svg";
import Badge from "../../src/components/ui/badge";
import SpringPressable from "../../src/components/ui/spring-pressable";
import { StationListSkeleton } from "../../src/components/ui/station-list-skeleton";
import { ActiveRentalSkeleton } from "../../src/components/ui/active-rental-skeleton";
import { userService } from "../../src/services/user";
import { useAuthStore } from "../../src/store/authStore";
import { useLocationStore } from "../../src/store/locationStore";
import { useRentalStore } from "../../src/store/rentalStore";

let MapView: any = null;
let Marker: any = null;
if (Platform.OS !== "web") {
  try {
    const Maps = require("react-native-maps");
    MapView = Maps.default;
    Marker = Maps.Marker;
  } catch {}
}

const mapDarkStyle = [
  { elementType: "geometry", stylers: [{ color: "#121212" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#121212" }] },
  { featureType: "road", elementType: "geometry.fill", stylers: [{ color: "#2c2c2c" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#000000" }] },
];

function formatDistance(distance: number | null) {
  if (distance === null) return "--";
  return `${distance.toFixed(1)} km`;
}

function formatCountdown(expiresAt: string, nowMs: number) {
  const seconds = Math.max(0, Math.floor((new Date(expiresAt).getTime() - nowMs) / 1000));
  if (seconds <= 0) return "Đã hết hạn";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return hours > 0 ? `Còn ${hours}h ${minutes}p` : `Còn ${minutes}p`;
}

const homeFaqs = [
  { id: "open-locker", question: "Làm thế nào để nhận tủ và mở cửa tủ?" },
  { id: "what-is-open-limit", question: "Lượt mở tủ là gì và hoạt động thế nào?" },
  { id: "forget-otp", question: "Tôi phải làm gì nếu gặp sự cố hoặc quên OTP?" },
];

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const user = useAuthStore((state) => state.user);
  const locations = useLocationStore((state) => state.locations);
  const fetchLocations = useLocationStore((state) => state.fetchLocations);
  const locationsLoading = useLocationStore((state) => state.isLoading);
  const rentals = useRentalStore((state) => state.rentals);
  const fetchRentals = useRentalStore((state) => state.fetchRentals);
  const rentalsLoading = useRentalStore((state) => state.isLoading);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const [now, setNow] = useState(Date.now());
  const [userCoords, setUserCoords] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    let mounted = true;

    // Chạy song song — skeleton biến mất từng phần khi load xong
    const loadLocations = async () => {
      try {
        const permission = await ExpoLocation.requestForegroundPermissionsAsync();
        if (permission.status === "granted") {
          const current = await ExpoLocation.getCurrentPositionAsync({});
          if (mounted) {
            setUserCoords({
              latitude: current.coords.latitude,
              longitude: current.coords.longitude,
            });
            await fetchLocations(current.coords.latitude, current.coords.longitude);
          }
        } else {
          await fetchLocations();
        }
      } catch {
        if (mounted) {
          setLocationError("Không thể lấy vị trí hiện tại.");
          await fetchLocations();
        }
      }
    };

    const loadNotifications = async () => {
      try {
        const notifications = await userService.getNotifications();
        if (mounted) {
          setHasUnreadNotifications(notifications.data.some((item) => !item.isRead));
        }
      } catch {}
    };

    const loadRentals = () => fetchRentals({ status: "ACTIVE", limit: 20 });

    // Chạy tất cả song song
    Promise.all([loadLocations(), loadNotifications(), loadRentals()]);

    return () => {
      mounted = false;
    };
  }, [fetchLocations, fetchRentals]);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const nearbyStations = useMemo(() => locations.slice(0, 3), [locations]);
  const activeRentals = useMemo(() => rentals.filter((item) => item.status === "ACTIVE"), [rentals]);

  const mapRegion = useMemo(() => {
    const first = nearbyStations[0];
    return {
      latitude: userCoords?.latitude ?? first?.latitude ?? 10.7795,
      longitude: userCoords?.longitude ?? first?.longitude ?? 106.699,
      latitudeDelta: 0.015,
      longitudeDelta: 0.015,
    };
  }, [nearbyStations, userCoords]);

  const handleCallHotline = () => {
    Linking.openURL("tel:1900123456").catch(() => {
      alert("Thiết bị không hỗ trợ cuộc gọi.");
    });
  };

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-four py-four">
          <View className="flex-row justify-between items-start mb-five">
            <View className="flex-1 pr-three">
              <View className="flex-row items-start">
                <View className="w-8 h-8 mr-two mt-one">
                  <OmniBoxIcon width={32} height={32} />
                </View>
                <View className="flex-1">
                  <Text className="text-[12px] leading-4 text-[#A0A0A0]">OmniBox Station</Text>
                  <Text className="text-[34px] leading-[38px] font-bold text-white mt-one">
                    Hello, {user?.name || user?.phone || "bạn"}
                  </Text>
                </View>
              </View>
            </View>

            <View className="flex-row gap-three">
              <Pressable
                onPress={() => router.push("/notifications")}
                className="w-10 h-10 rounded-full bg-surface items-center justify-center border border-border"
              >
                <MaterialCommunityIcons name="bell-outline" size={20} color="#FFFFFF" />
                {hasUnreadNotifications ? (
                  <View className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-error border border-background" />
                ) : null}
              </Pressable>
              <Pressable
                onPress={() => router.push("/profile")}
                className="w-10 h-10 rounded-full bg-surface items-center justify-center border border-border overflow-hidden"
              >
                <Text className="text-small-bold text-white">
                  {(user?.name || user?.phone || "U").trim().charAt(0).toUpperCase()}
                </Text>
              </Pressable>
            </View>
          </View>

          <View className="bg-surface border border-border rounded-panel overflow-hidden mb-five">
            <View className="flex-row justify-between items-center px-four pt-four pb-three">
              <Text className="text-body-bold text-white">Vị trí tủ gần bạn</Text>
              <Pressable onPress={() => router.push("/locations")}>
                <Text className="text-small-bold text-brand">Xem bản đồ</Text>
              </Pressable>
            </View>

            <View className="h-52 bg-background">
              {Platform.OS === "web" || !MapView ? (
                <View className="flex-1 items-center justify-center">
                  <Text className="text-caption text-text-secondary">Bản đồ chỉ hiển thị trên app mobile.</Text>
                </View>
              ) : (
                <MapView
                  style={{ width: "100%", height: "100%" }}
                  region={mapRegion}
                  customMapStyle={mapDarkStyle}
                  scrollEnabled={false}
                  zoomEnabled={false}
                  pitchEnabled={false}
                  rotateEnabled={false}
                >
                  {userCoords ? (
                    <Marker coordinate={userCoords}>
                      <View className="w-3.5 h-3.5 rounded-full bg-brand border-2 border-white" />
                    </Marker>
                  ) : null}

                  {nearbyStations.map((station) =>
                    station.latitude !== null && station.longitude !== null ? (
                      <Marker
                        key={station.id}
                        coordinate={{ latitude: station.latitude, longitude: station.longitude }}
                        onPress={() => router.push(`/station/${station.id}` as any)}
                      >
                        <View className="bg-brand border border-white px-two py-one rounded-full">
                          <Text className="text-[10px] text-white font-bold">{station.availableCount}</Text>
                        </View>
                      </Marker>
                    ) : null,
                  )}
                </MapView>
              )}
            </View>

            <View className="p-four gap-three">
              {locationsLoading ? (
                <StationListSkeleton />
              ) : nearbyStations.length > 0 ? (
                nearbyStations.map((station) => (
                  <SpringPressable
                    key={station.id}
                    onPress={() => router.push(`/station/${station.id}` as any)}
                    className="bg-background border border-border rounded-panel p-three"
                    glowOnPress
                  >
                    <View className="flex-row justify-between items-start">
                      <View className="flex-1 pr-three">
                        <Text className="text-body-bold text-white">{station.name}</Text>
                        <Text className="text-caption text-text-secondary mt-one">{station.address}</Text>
                      </View>
                      <Badge
                        label={station.availableCount > 0 ? `Còn ${station.availableCount}` : "Hết chỗ"}
                        status={station.availableCount > 0 ? "active" : "expired"}
                      />
                    </View>
                    <View className="flex-row items-center justify-between mt-three">
                      <Text className="text-small text-text-secondary">{formatDistance(station.distance)}</Text>
                      <Text className="text-small text-text-secondary">
                        S:{station.availableSmall}/{station.totalSmall} • L:{station.availableLarge}/{station.totalLarge}
                      </Text>
                    </View>
                  </SpringPressable>
                ))
              ) : (
                <Text className="text-caption text-text-secondary">Chưa có dữ liệu trạm tủ.</Text>
              )}

              {locationError ? <Text className="text-small text-warning">{locationError}</Text> : null}
            </View>
          </View>

          <View className="mb-five">
            <View className="flex-row justify-between items-center mb-three">
              <Text className="text-body-bold text-white">Tủ đang sử dụng</Text>
              <Pressable onPress={() => router.push("/my-rentals")}>
                <Text className="text-small-bold text-brand">Xem tất cả</Text>
              </Pressable>
            </View>

            <View className="bg-surface border border-border rounded-panel p-four">
              {rentalsLoading ? (
                <ActiveRentalSkeleton />
              ) : activeRentals.length > 0 ? (
                <View className="gap-three">
                  {activeRentals.slice(0, 2).map((rental) => (
                    <Pressable
                      key={rental.id}
                      onPress={() => router.push(`/rental/${rental.id}` as any)}
                      className="bg-background border border-border rounded-panel p-three"
                    >
                      <View className="flex-row justify-between items-start">
                        <View className="flex-1 pr-three">
                          <Text className="text-body-bold text-white">
                            {rental.compartment.cabinet.name} • {rental.compartment.name}
                          </Text>
                          <Text className="text-caption text-text-secondary mt-one">
                            Mã truy cập: {rental.code}
                          </Text>
                        </View>
                        <Badge label={formatCountdown(rental.expiresAt, now)} status="active" />
                      </View>
                    </Pressable>
                  ))}
                </View>
              ) : (
                <Text className="text-caption text-text-secondary">
                  Bạn chưa có tủ nào đang hoạt động.
                </Text>
              )}
            </View>
          </View>

          <View className="bg-surface border border-border rounded-panel overflow-hidden mb-five">
            <View className="flex-row justify-between items-center px-four pt-four pb-three">
              <Text className="text-body-bold text-white">Câu hỏi thường gặp</Text>
              <Pressable onPress={() => router.push("/faq")}>
                <Text className="text-small-bold text-brand">Xem tất cả</Text>
              </Pressable>
            </View>

            {homeFaqs.map((faq, index) => (
              <Pressable
                key={faq.id}
                onPress={() => router.push(`/faq/${faq.id}` as any)}
                className={`flex-row items-center justify-between px-four py-four ${index < homeFaqs.length - 1 ? "border-b border-border/40" : ""}`}
              >
                <Text className="text-small-bold text-white flex-1 pr-four">{faq.question}</Text>
                <Ionicons name="chevron-forward" size={18} color="#A1A1A0" />
              </Pressable>
            ))}
          </View>

          <View className="flex-row justify-between items-center border-t border-border/80 pt-four">
            <View>
              <Text className="text-small text-text-secondary">Hotline hỗ trợ 24/7</Text>
              <Text className="text-body-bold text-brand">1900 1234 56</Text>
            </View>
            <Pressable
              onPress={() => {
                if (Platform.OS !== "web") {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
                handleCallHotline();
              }}
              className="w-11 h-11 bg-surface-glass border border-border rounded-full items-center justify-center"
            >
              <MaterialCommunityIcons name="phone" size={20} color="#FF6600" />
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
