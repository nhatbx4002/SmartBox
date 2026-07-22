import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Platform,
  Linking,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import * as ExpoLocation from "expo-location";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withSequence,
  withTiming,
  FadeIn,
  SlideInDown,
} from "react-native-reanimated";

import OmniBoxIcon from "../../assets/Logos/omnibox-icon-small.svg";
import Badge from "../../src/components/ui/badge";
import SpringPressable from "../../src/components/ui/spring-pressable";
import { StationListSkeleton } from "../../src/components/ui/station-list-skeleton";
import { ActiveRentalSkeleton } from "../../src/components/ui/active-rental-skeleton";
import { HomeSkeleton } from "../../src/components/ui/home-skeleton";
import { userService } from "../../src/services/user";
import { useAuthStore } from "../../src/store/authStore";
import { useLocationStore } from "../../src/store/locationStore";
import { useRentalStore } from "../../src/store/rentalStore";

const SPRING = { damping: 14, stiffness: 100, mass: 1 };
const STAGGER = 120;

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
  if (distance == null) return "--";
  return `${distance.toFixed(1)} km`;
}

function formatCountdown(expiresAt: string, nowMs: number) {
  const seconds = Math.max(0, Math.floor((new Date(expiresAt).getTime() - nowMs) / 1000));
  if (seconds <= 0) return "Hết hạn";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return hours > 0 ? `Còn ${hours}giờ ${minutes}phút` : `Còn ${minutes}phút`;
}

const homeFaqs = [
  { id: "open-locker", question: "Làm thế nào để thuê tủ và mở tủ?" },
  { id: "what-is-open-limit", question: "Lượt mở tủ là gì và hoạt động như thế nào?" },
  { id: "forget-otp", question: "Tôi phải làm gì nếu quên mã OTP?" },
];

// -- Staggered reveal wrapper --
function Staggered({ index, children }: { index: number; children: React.ReactNode }) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(24);

  useEffect(() => {
    opacity.value = withDelay(index * STAGGER, withSpring(1, { ...SPRING, stiffness: 80 }));
    translateY.value = withDelay(index * STAGGER, withSpring(0, SPRING));
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return <Animated.View style={style}>{children}</Animated.View>;
}

// -- Section header --
function SectionHeader({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <View className="flex-row justify-between items-center mb-3">
      <Text className="text-body-bold text-white tracking-tight">{title}</Text>
      {action && onAction && (
        <Pressable onPress={onAction} hitSlop={8}>
          <Text className="text-small-bold text-brand">{action}</Text>
        </Pressable>
      )}
    </View>
  );
}

// -- Glass card wrapper --
function GlassCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <View
      className={`overflow-hidden rounded-2xl border border-white/10 ${className ?? ""}`}
      style={{ backgroundColor: "rgba(28, 28, 27, 0.85)" }}
    >
      <View className="p-4">
        {children}
      </View>
    </View>
  );
}

// -- Live status dot --
function StatusDot({ online }: { online: boolean }) {
  const pulse = useSharedValue(1);

  useEffect(() => {
    if (!online) return;
    pulse.value = withSequence(
      withTiming(0.4, { duration: 1200 }),
      withTiming(1, { duration: 1200 }),
    );
    const interval = setInterval(() => {
      pulse.value = withSequence(
        withTiming(0.4, { duration: 1200 }),
        withTiming(1, { duration: 1200 }),
      );
    }, 2400);
    return () => clearInterval(interval);
  }, [online]);

  const dotStyle = useAnimatedStyle(() => ({
    opacity: online ? pulse.value : 0.5,
  }));

  return (
    <Animated.View
      style={dotStyle}
      className={`w-2 h-2 rounded-full ${online ? "bg-success" : "bg-text-muted"}`}
    />
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const user = useAuthStore((state) => state.user);
  const locations = useLocationStore((state) => state.locations);
  const fetchLocations = useLocationStore((state) => state.fetchLocations);
  const locationsLoading = useLocationStore((state) => state.isLoading);
  const locationsHydrated = useLocationStore((state) => state._hasHydrated);
  const rentals = useRentalStore((state) => state.rentals);
  const fetchRentals = useRentalStore((state) => state.fetchRentals);
  const rentalsLoading = useRentalStore((state) => state.isLoading);
  const rentalsHydrated = useRentalStore((state) => state._hasHydrated);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [now, setNow] = useState(Date.now());
  const [userCoords, setUserCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadLocations = useCallback(async (mountedRef?: { current: boolean }) => {
    const mounted = mountedRef?.current ?? true;
    try {
      const permission = await ExpoLocation.requestForegroundPermissionsAsync();
      if (permission.status === "granted") {
        const current = await ExpoLocation.getCurrentPositionAsync({});
        if (mounted) {
          setUserCoords({ latitude: current.coords.latitude, longitude: current.coords.longitude });
          await fetchLocations(current.coords.latitude, current.coords.longitude);
        }
      } else {
        await fetchLocations();
      }
    } catch {
      if (mounted) {
        setLocationError("Không thể lấy vị trí người dùng hiện tại.");
        await fetchLocations();
      }
    }
  }, [fetchLocations]);

  const loadNotifications = useCallback(async (mountedRef?: { current: boolean }) => {
    const mounted = mountedRef?.current ?? true;
    try {
      const result = await userService.getNotifications();
      if (mounted) setUnreadCount(result.data.filter((item) => !item.isRead).length);
    } catch {}
  }, []);

  const loadRentals = useCallback(() => fetchRentals({ status: "ACTIVE", limit: 20 }), [fetchRentals]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([loadLocations(), loadNotifications(), loadRentals()]);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setRefreshing(false);
  }, [loadLocations, loadNotifications, loadRentals]);

  useEffect(() => {
    const mountedRef = { current: true };
    Promise.all([loadLocations(mountedRef), loadNotifications(mountedRef), loadRentals()]);
    return () => { mountedRef.current = false; };
  }, [loadLocations, loadNotifications, loadRentals]);

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
    Linking.openURL("tel:1900123456").catch(() => {});
  };

  const userInitial = (user?.name || user?.phone || "U").trim().charAt(0).toUpperCase();

  if (!locationsHydrated || !rentalsHydrated) {
    return (
      <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <HomeSkeleton />
        </ScrollView>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>

      <Animated.ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#FF6600" colors={["#FF6600"]} />
        }
        entering={FadeIn.duration(500)}
      >
        <View className="px-4 pt-4 pb-6">
          {/* ===== HEADER ===== */}
          <Staggered index={0}>
            <View className="flex-row justify-between items-start mb-6">
              <View className="flex-row items-center gap-3">
                <View className="w-10 h-10 rounded-xl bg-brand items-center justify-center shadow-brand-glow">
                  <OmniBoxIcon width={22} height={22} />
                </View>
                <View>
                  <Text className="text-caption text-text-muted tracking-wider uppercase">
                    OmniBox
                  </Text>
                  <Text className="text-h2 text-white font-bold tracking-tight mt-0.5">
                    {user?.name || user?.phone || "ban"}
                  </Text>
                </View>
              </View>

              <View className="flex-row gap-2">
                <Pressable
                  onPress={() => router.push("/notifications")}
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 items-center justify-center"
                >
                  <Ionicons name="notifications-outline" size={20} color="#FFFFFF" />
                  {unreadCount > 0 && (
                    <View className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-error rounded-full items-center justify-center px-1">
                      <Text className="text-[10px] text-white font-bold">{unreadCount > 99 ? "99+" : unreadCount}</Text>
                    </View>
                  )}
                </Pressable>
                <Pressable
                  onPress={() => router.push("/profile")}
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 items-center justify-center"
                >
                  <Text className="text-small-bold text-white">{userInitial}</Text>
                </Pressable>
              </View>
            </View>
          </Staggered>

          {/* ===== MAP + STATIONS ===== */}
          <Staggered index={1}>
            <GlassCard className="mb-5">
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-body-bold text-white tracking-tight">Vị trí tủ gần bạn</Text>
                <Pressable onPress={() => router.push("/locations")} hitSlop={8}>
                  <Text className="text-small-bold text-brand">Xem bản đồ</Text>
                </Pressable>
              </View>

              {/* Mini map */}
              <View className="h-48 rounded-xl overflow-hidden bg-background border border-white/5 mb-3">
                {Platform.OS === "web" || !MapView ? (
                  <View className="flex-1 items-center justify-center">
                    <Text className="text-caption text-text-muted">Bản đồ chỉ hiển trị trên app mobile.</Text>
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
                    {userCoords && (
                      <Marker coordinate={userCoords}>
                        <View className="w-3.5 h-3.5 rounded-full bg-brand border-2 border-white" />
                      </Marker>
                    )}
                    {nearbyStations.map((station) =>
                      station.latitude != null && station.longitude != null ? (
                        <Marker
                          key={station.id}
                          coordinate={{ latitude: station.latitude, longitude: station.longitude }}
                          onPress={() => router.push(`/station/${station.id}` as any)}
                        >
                          <View className={`border border-white px-2 py-0.5 rounded-full ${station.status === "online" ? "bg-brand" : "bg-surface"}`}>
                            <Text className="text-[10px] text-white font-bold">
                              {station.status === "online" ? station.availableCount : "—"}
                            </Text>
                          </View>
                        </Marker>
                      ) : null,
                    )}
                  </MapView>
                )}
              </View>

              {/* Station list */}
              <View className="gap-2">
                {locationsLoading ? (
                  <StationListSkeleton />
                ) : nearbyStations.length > 0 ? (
                  nearbyStations.map((station) => (
                    <SpringPressable
                      key={station.id}
                      onPress={() => router.push(`/station/${station.id}` as any)}
                      className="bg-white/5 border border-white/10 rounded-xl p-3"
                      glowOnPress
                    >
                      <View className="flex-row items-start justify-between">
                        <View className="flex-1 pr-3">
                          <View className="flex-row items-center gap-2 mb-1">
                            <StatusDot online={station.status === "online"} />
                            <Text className="text-body-bold text-white">{station.name}</Text>
                          </View>
                          <Text className="text-caption text-text-muted">{station.address}</Text>
                        </View>
                        <Badge
                          label={
                            station.status !== "online"
                              ? "Offline"
                              : station.availableCount > 0
                              ? `Còn ${station.availableCount}`
                              : "Hết chỗ"
                          }
                          status={
                            station.status !== "online"
                              ? "completed"
                              : station.availableCount > 0
                              ? "active"
                              : "expired"
                          }
                        />
                      </View>
                      <View className="flex-row items-center justify-between mt-2">
                        <Text className="text-small text-text-muted">{formatDistance(station.distance)}</Text>
                        <Text className="text-small text-text-muted">
                          Nhỏ:{station.availableSmall}/{station.totalSmall}  Lớn:{station.availableLarge}/{station.totalLarge}
                        </Text>
                      </View>
                    </SpringPressable>
                  ))
                ) : (
                  <Text className="text-caption text-text-muted">Chưa có dữ liệu trạm tủ ở gần. Đợi chút nhé.</Text>
                )}
                {locationError && <Text className="text-small text-warning mt-1">{locationError}</Text>}
              </View>
            </GlassCard>
          </Staggered>

          {/* ===== ACTIVE RENTALS ===== */}
          <Staggered index={2}>
            <View className="mb-5">
              <SectionHeader title="Đơn thuê đang hoạt động" action="Xem tất cả" onAction={() => router.push("/my-rentals")} />
              <GlassCard>
                {rentalsLoading ? (
                  <ActiveRentalSkeleton />
                ) : activeRentals.length > 0 ? (
                  <View className="gap-2">
                    {activeRentals.slice(0, 2).map((rental) => (
                      <SpringPressable
                        key={rental.id}
                        onPress={() => router.push(`/rental/${rental.id}` as any)}
                        className="bg-white/5 border border-white/10 rounded-xl p-3"
                        glowOnPress
                      >
                        <View className="flex-row justify-between items-start">
                          <View className="flex-1 pr-3">
                            <Text className="text-body-bold text-white">
                              {rental.compartment?.cabinet?.name ?? "--"} - Ngăn {rental.compartment?.name ?? "--"}
                            </Text>
                          </View>
                          <View className="items-end">
                            <Badge label={formatCountdown(rental.expiresAt, now)} status="active" />
                          </View>
                        </View>
                      </SpringPressable>
                    ))}
                  </View>
                ) : (
                  <View className="items-center py-4">
                    <View className="w-10 h-10 rounded-full bg-white/5 border border-white/10 items-center justify-center mb-2">
                      <Ionicons name="cube-outline" size={20} color="#999" />
                    </View>
                    <Text className="text-caption text-text-muted text-center">
                      Bạn chưa có đơn thuê nào. Hãy thuê ngay nào!
                    </Text>
                  </View>
                )}
              </GlassCard>
            </View>
          </Staggered>

          {/* ===== FAQ ===== */}
          <Staggered index={3}>
            <GlassCard className="mb-5">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-body-bold text-white tracking-tight">Câu hỏi thường gặp</Text>
                <Pressable onPress={() => router.push("/faq")} hitSlop={8}>
                  <Text className="text-small-bold text-brand">Xem tất cả</Text>
                </Pressable>
              </View>
              <View className="divide-y divide-white/5">
                {homeFaqs.map((faq, index) => (
                  <Pressable
                    key={faq.id}
                    onPress={() => router.push(`/faq/${faq.id}` as any)}
                    className={`flex-row items-center justify-between py-3 ${index > 0 ? "border-t border-white/5" : ""}`}
                  >
                    <Text className="text-small text-white flex-1 pr-3 leading-relaxed">{faq.question}</Text>
                    <Ionicons name="chevron-forward" size={16} color="#999" />
                  </Pressable>
                ))}
              </View>
            </GlassCard>
          </Staggered>

          {/* ===== HOTLINE ===== */}
          <Staggered index={4}>
            <View className="flex-row items-center justify-between bg-white/5 border border-white/10 rounded-xl p-4">
              <View>
                <Text className="text-caption text-text-muted">Hotline hỗ trợ 24/7</Text>
                <Text className="text-body-bold text-brand tracking-tight mt-0.5">1900 1234 56</Text>
              </View>
              <Pressable
                onPress={() => {
                  if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  handleCallHotline();
                }}
                className="w-11 h-11 rounded-xl bg-brand/10 border border-brand/20 items-center justify-center"
              >
                <Ionicons name="call" size={20} color="#FF6600" />
              </Pressable>
            </View>
          </Staggered>
        </View>
      </Animated.ScrollView>
    </View>
  );
}
