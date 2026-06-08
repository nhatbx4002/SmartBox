import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Modal,
  Linking,
  Platform,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import * as Location from "expo-location";
import Badge from "../../src/components/ui/badge";
import SpringPressable from "../../src/components/ui/spring-pressable";

let MapView: any = null;
let Marker: any = null;
if (Platform.OS !== "web") {
  try {
    const Maps = require("react-native-maps");
    MapView = Maps.default;
    Marker = Maps.Marker;
  } catch (e) {
    console.warn("Failed to load react-native-maps:", e);
  }
}

const mapDarkStyle = [
  {
    elementType: "geometry",
    stylers: [{ color: "#121212" }],
  },
  {
    elementType: "labels.icon",
    stylers: [{ visibility: "off" }],
  },
  {
    elementType: "labels.text.fill",
    stylers: [{ color: "#757575" }],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [{ color: "#121212" }],
  },
  {
    featureType: "administrative",
    elementType: "geometry",
    stylers: [{ color: "#757575" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#757575" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#181818" }],
  },
  {
    featureType: "road",
    elementType: "geometry.fill",
    stylers: [{ color: "#2c2c2c" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#8a8a8a" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#000000" }],
  },
];
export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  // User's location coordinates state
  const [userLocation, setUserLocation] =
    useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  // Locker stations fetched from API
  const [locations, setLocations] = useState<any[]>([]);
  // Active rentals list state
  const [activeRentals, setActiveRentals] = useState<any[]>([
    {
      id: "42",
      cabinet: "Tủ số A1 (Cỡ Vừa)",
      location: "Kiosk Nhà A3 - Campus A",
      timeLeft: 9000, // 2h 30m in seconds
      openCount: 1,
      maxOpens: 3,
    },
    {
      id: "45",
      cabinet: "Tủ số B3 (Cỡ Nhỏ)",
      location: "Cổng Ký Túc Xá B10",
      timeLeft: 1800, // 30m in seconds
      openCount: 0,
      maxOpens: 1,
    },
  ]);
  // Request location permission and fetch locations on mount

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          setErrorMsg("Quy?n truy c?p v? trí b? t? ch?i.");
        } else {
          let location = await Location.getCurrentPositionAsync({});

          setUserLocation(location);
        }
      } catch (err) {
        setErrorMsg("Không th? l?y v? trí hi?n t?i.");
      }
    })();

    // Fetch locations from backend API

    const fetchLocations = async () => {
      try {
        const apiUrl =
          Platform.OS === "android"
            ? "http://10.0.2.2:3000"
            : "http://localhost:3000";

        const response = await fetch(`${apiUrl}/api/locations`);

        const json = await response.json();

        if (json && json.data) {
          setLocations(json.data);
        }
      } catch (error) {
        console.log("Error fetching locker locations from API:", error);
      }
    };

    fetchLocations();
  }, []);

  // Real-time countdown timer for all active rentals

  useEffect(() => {
    if (activeRentals.length === 0) return;

    const interval = setInterval(() => {
      setActiveRentals((prevRentals) =>
        prevRentals.map((rental) => {
          if (rental.timeLeft <= 0) {
            return { ...rental, timeLeft: 0 };
          }

          return { ...rental, timeLeft: rental.timeLeft - 1 };
        }),
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [activeRentals.length > 0]);

  // Reanimated values for pulse location dot inside the small map preview

  const pulseScale = useSharedValue(1);

  const pulseOpacity = useSharedValue(0.6);

  useEffect(() => {
    pulseScale.value = withRepeat(
      withTiming(2, { duration: 1800 }),

      -1,

      false,
    );

    pulseOpacity.value = withRepeat(
      withTiming(0, { duration: 1800 }),

      -1,

      false,
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulseScale.value }],

      opacity: pulseOpacity.value,
    };
  });

  // Helper to format remaining time

  const formatCountdown = (seconds: number) => {
    if (seconds <= 0) return "Ð? h?t h?n";

    const h = Math.floor(seconds / 3600);

    const m = Math.floor((seconds % 3600) / 60);

    if (h > 0) {
      return `Còn ${h}h ${m}p`;
    }

    return `Còn ${m}p`;
  };

  // Helper to get active rental badge status

  const getRentalBadgeStatus = (seconds: number) => {
    if (seconds <= 0) return "expired";

    if (seconds < 600) return "expired";

    if (seconds < 3600) return "warning";

    return "active";
  };

  const handleCallHotline = () => {
    Linking.openURL("tel:1900123456").catch(() => {
      alert("Thiết bị không hỗ trựo cuộc gọi.");
    });
  };

  // 3 popular questions for home screen

  const popularFaqs = [
    {
      id: "open-locker",

      question: "Làm thế nào để nhận tủ và mở cửa tủ",
    },

    {
      id: "what-is-open-limit",

      question: "Gói 'Một lần' và 'Theo ngày' khác nhau thế nào?",
    },

    {
      id: "forget-otp",

      question: "Tôi phải làm gì nếu quên mã PIN hoặc gặp sự cô",
    },
  ];

  // Dynamic stations to display on map preview card

  const displayStations =
    locations.length > 0
      ? locations.slice(0, 2).map((loc, idx) => ({
          id: loc.id,
          name: loc.name
            .replace("Kiosk ", "")
            .replace("Cổnng ", "")
            .replace("Thư viện ", "Trạm "),
          isOnline: loc.status === "ACTIVE",
          top: idx === 0 ? "25%" : "65%",
          left: idx === 0 ? "28%" : "70%",
          latitude: Number(loc.latitude),
          longitude: Number(loc.longitude),
        }))
      : [
          {
            id: "1",
            name: "Trạm A3",
            isOnline: true,
            top: "25%",
            left: "28%",
            latitude: 10.7805,
            longitude: 106.6979,
          },
          {
            id: "2",
            name: "Trạm C1",
            isOnline: false,
            top: "65%",
            left: "70%",
            latitude: 10.7785,
            longitude: 106.6999,
          },
        ];

  // Nearby suggested locker stations

  const suggestedStations =
    locations.length > 0
      ? locations.slice(0, 3).map((loc) => ({
          id: loc.id,

          name: loc.name.replace("Kiosk ", "").replace("Cổng ", ""),

          distance: loc.distance ? `${loc.distance} km` : "0.3 km",

          availableCount:
            loc.availableCount !== undefined ? loc.availableCount : 8,
        }))
      : [
          {
            id: "a3-campus-a",
            name: "Nhà A3",
            distance: "0.2 km",
            availableCount: 8,
          },

          {
            id: "ktx-b10",
            name: "KTX B10",
            distance: "0.5 km",
            availableCount: 2,
          },

          {
            id: "lib-tqb",
            name: "Thư viện TQB",
            distance: "0.8 km",
            availableCount: 4,
          },
        ];

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      {/* 1. Welcoming Header */}

      <View className="flex-row justify-between items-center px-four py-two bg-surface/50 border-b border-border/40">
        <View className="flex-row items-center gap-two">
          <Pressable
            onPress={() => router.push("/profile")}
            className="w-9 h-9 rounded-full bg-brand-glow border border-brand items-center justify-center overflow-hidden"
          >
            <Text className="text-[14px] font-bold text-brand">A</Text>
          </Pressable>

          <View>
            <Text className="text-[13px] text-text-secondary">
              Xin chào, <Text className="text-white font-bold">Nguyễn Văn A</Text>
            </Text>
          </View>
        </View>

        <View className="flex-row items-center gap-two">
          {/* Notifications */}
          <Pressable
            onPress={() => router.push("/notifications")}
            className="w-9 h-9 rounded-full bg-surface items-center justify-center border border-border relative"
          >
            <MaterialCommunityIcons name="bell" size={18} color="#FFFFFF" />
            <View className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border border-surface" />
          </Pressable>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-four pt-four">
          <View className="bg-glass border border-border rounded-panel p-four mb-four shadow-md relative overflow-hidden">
            {/* Left Content Column */}
            <View style={{ paddingRight: 64 }}>
              <Text className="text-white font-bold mb-one" style={{ fontSize: 18, lineHeight: 24 }}>
                Chào mừng tới OmniBox
              </Text>

              <Text className="text-text-secondary" style={{ fontSize: 12.5, lineHeight: 18 }}>
                Dịch vụ cho thuê tủ thông minh lưu trữ đồ 24/7
              </Text>
            </View>

            {/* Abstract Graphic */}
            <View style={{ position: "absolute", right: 16, top: 0, bottom: 0, justifyContent: "center", alignItems: "center" }}>
              <View style={{ position: "absolute", width: 64, height: 64, borderRadius: 32, borderWidth: 1.5, borderColor: '#FF6600', opacity: 0.08 }} />
              <View style={{ position: "absolute", width: 48, height: 48, borderRadius: 24, borderWidth: 1, borderColor: '#FF6600', opacity: 0.12, transform: [{ rotate: '45deg' }] }} />
              <MaterialCommunityIcons name="cube-outline" size={28} color="#FF6600" style={{ opacity: 0.4 }} />
            </View>
          </View>

          {/* Combined Map & Nearby Locker Stations Card */}
          <View className="mb-five">
            <View className="flex-row justify-between items-center mb-three">
              <Text className="text-body-bold text-white">Vị trí tủ</Text>
            </View>

            <View className="bg-surface border border-border rounded-panel overflow-hidden shadow-md">

            {/* Map Preview */}
            <View className="relative w-full h-48 bg-surface overflow-hidden" style={{ borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
              {Platform.OS === "web" ? (
                <>
                  {/* Show real map image if available, otherwise show simulated gridlines */}
                  {locations[0]?.mapImageUrl ? (
                    <>
                      <Image
                        source={{ uri: locations[0].mapImageUrl }}
                        className="absolute inset-0 w-full h-full opacity-60"
                        style={{ borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
                        resizeMode="cover"
                      />
                      <View className="absolute inset-0 bg-black/35" />
                    </>
                  ) : (
                    <>
                      <View className="absolute inset-0 bg-[#121212] opacity-80" />
                      {/* Simulated Grid Gridlines */}
                      <View className="absolute inset-0 flex-row justify-between opacity-10">
                        <View className="w-[1px] h-full bg-white" />
                        <View className="w-[1px] h-full bg-white" />
                        <View className="w-[1px] h-full bg-white" />
                        <View className="w-[1px] h-full bg-white" />
                      </View>
                      <View className="absolute inset-0 flex-col justify-between opacity-10">
                        <View className="h-[1px] w-full bg-white" />
                        <View className="h-[1px] w-full bg-white" />
                        <View className="h-[1px] w-full bg-white" />
                      </View>
                      {/* Stylized Campus Building Blocks */}
                      <View className="absolute top-four left-four w-20 h-10 bg-surface rounded-panel border border-border/40 opacity-40 items-center justify-center">
                        <Text className="text-[9px] text-text-muted">
                          Nhà A3
                        </Text>
                      </View>
                      <View className="absolute top-twenty left-[55%] w-24 h-12 bg-surface rounded-panel border border-border/40 opacity-40 items-center justify-center">
                        <Text className="text-[9px] text-text-muted">
                          Thư viện TQB
                        </Text>
                      </View>
                      <View className="absolute bottom-four left-[20%] w-16 h-8 bg-surface rounded-panel border border-border/40 opacity-40 items-center justify-center">
                        <Text className="text-[9px] text-text-muted">
                          Nhà B10
                        </Text>
                      </View>
                    </>
                  )}

                  {/* Pulsing Active User Marker dot */}
                  <View className="absolute top-[45%] left-[35%] w-4 h-4 items-center justify-center">
                    <Animated.View
                      style={pulseStyle}
                      className="absolute w-8 h-8 rounded-full bg-brand"
                    />
                    <View className="w-3.5 h-3.5 rounded-full bg-brand border-2 border-white" />
                  </View>

                  {/* Dynamic Nearby Locker Pins */}
                  {displayStations.map((station) => (
                    <View
                      key={station.id}
                      className="absolute bg-surface border p-one rounded-card flex-row items-center gap-one"
                      style={{
                        top: station.top as any,
                        left: station.left as any,
                        borderColor: station.isOnline ? "#FF6600" : "#252525",
                      }}
                    >
                      <Ionicons
                        name="cube"
                        size={12}
                        color={station.isOnline ? "#FF6600" : "#A1A1A0"}
                      />
                      <Text className="text-[10px] text-white font-bold">
                        {station.name}
                      </Text>
                    </View>
                  ))}
                </>
              ) : (
                <MapView
                  style={{ width: "100%", height: "100%", borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
                  region={{
                    latitude:
                      userLocation?.coords.latitude ??
                      locations[0]?.latitude ??
                      10.7795,
                    longitude:
                      userLocation?.coords.longitude ??
                      locations[0]?.longitude ??
                      106.6989,
                    latitudeDelta: 0.015,
                    longitudeDelta: 0.015,
                  }}
                  customMapStyle={mapDarkStyle}
                  scrollEnabled={false}
                  zoomEnabled={false}
                  pitchEnabled={false}
                  rotateEnabled={false}
                >
                  {/* User Location Marker */}
                  {userLocation && (
                    <Marker
                      coordinate={{
                        latitude: userLocation.coords.latitude,
                        longitude: userLocation.coords.longitude,
                      }}
                    >
                      <View className="w-4 h-4 items-center justify-center">
                        <Animated.View
                          style={pulseStyle}
                          className="absolute w-8 h-8 rounded-full bg-brand"
                        />
                        <View className="w-3.5 h-3.5 rounded-full bg-brand border-2 border-white" />
                      </View>
                    </Marker>
                  )}

                  {/* Dynamic Locker Stations Map Markers */}
                  {displayStations.map((station) => (
                    <Marker
                      key={station.id}
                      coordinate={{
                        latitude: station.latitude,
                        longitude: station.longitude,
                      }}
                    >
                      <View
                        className="bg-surface border p-one rounded-card flex-row items-center gap-one"
                        style={{
                          borderColor: station.isOnline ? "#FF6600" : "#252525",
                        }}
                      >
                        <Ionicons
                          name="cube"
                          size={12}
                          color={station.isOnline ? "#FF6600" : "#A1A1A0"}
                        />
                        <Text className="text-[10px] text-white font-bold">
                          {station.name}
                        </Text>
                      </View>
                    </Marker>
                  ))}
                </MapView>
              )}
              <View className="absolute bottom-three right-three z-20">
                <Pressable
                  onPress={() => {
                    if (Platform.OS !== "web") {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    }

                    router.push("/locations");
                  }}
                  style={{
                    shadowColor: "#00C853",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 6,
                    elevation: 6,
                  }}
                  className="bg-[#00C853] active:bg-[#00A844] px-four py-two.5 rounded-full flex-row items-center gap-one.5"
                >
                  <Ionicons name="map-outline" size={14} color="white" />
                  <Text className="text-[12px] font-bold text-white">
                    Tìm tủ
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* G?i ? tr?m t? g?n b?n */}
            <View className="p-four border-t border-border/40">
              <View className="flex-row justify-between items-center mb-three">
                <Text className="text-body-bold text-white">
                  Gợi ý trạm tủ gần bạn
                </Text>

                <Pressable
                  onPress={() => router.push("/locations")}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Text className="text-small-bold text-text-secondary">Xem tất cả</Text>
                </Pressable>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="flex-row"
              >
                {suggestedStations.map((station) => (
                  <SpringPressable
                    key={station.id}
                    onPress={() => router.push(`/rent/${station.id}`)}
                    className="w-44 h-32 mr-three bg-surface border border-border rounded-panel p-three justify-between"
                    glowOnPress
                  >
                    <View>
                      <View className="flex-row justify-between items-start">
                        <Text
                          className="text-small-bold text-white flex-1 pr-two"
                          numberOfLines={1}
                        >
                          {station.name}
                        </Text>

                        <Text className="text-[10px] text-text-secondary font-mono">
                          {station.distance}
                        </Text>
                      </View>

                      <Text
                        className="text-[11px] text-text-muted mt-one"
                        numberOfLines={1}
                      >
                        Kiosk SmartBox
                      </Text>
                    </View>

                    <Badge
                      label={`Còn ${station.availableCount} ngãn tr?ng`}
                      status={station.availableCount > 0 ? "active" : "expired"}
                    />
                  </SpringPressable>
                ))}
              </ScrollView>
            </View>
          </View>
          </View>

          {/* 4. Active Rentals Section (Combined into a single Card) */}

          {activeRentals.length > 0 && (
            <View className="mb-five">
              <View className="flex-row justify-between items-center mb-three">
                <Text className="text-body-bold text-white">
                  Tủ đang sử dụng
                </Text>

                {/* "Xem tất cả" link if there are multiple active rentals */}

                {activeRentals.length > 1 && (
                  <Pressable
                    onPress={() => {
                      if (Platform.OS !== "web") {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      }

                      router.push("/my-rentals");
                    }}
                    className="flex-row items-center"
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Text className="text-small-bold text-text-secondary mr-one">
                      Xem tất cả
                    </Text>

                    <MaterialCommunityIcons
                      name="chevron-right"
                      size={16}
                      color="#A1A1A0"
                    />
                  </Pressable>
                )}
              </View>

              {/* Unified Card Container */}

              <View className="bg-surface border border-border rounded-panel p-four shadow-md">
                {activeRentals.slice(0, 2).map((rental, index) => {
                  const isLast =
                    index === Math.min(activeRentals.length, 2) - 1;

                  return (
                    <View key={rental.id}>
                      <Pressable
                        onPress={() => {
                          if (Platform.OS !== "web") {
                            Haptics.impactAsync(
                              Haptics.ImpactFeedbackStyle.Light,
                            );
                          }

                          router.push(`/rental/${rental.id}`);
                        }}
                        className="active:opacity-70"
                      >
                        <View className="flex-row justify-between items-start">
                          <View className="flex-row items-center gap-two">
                            <MaterialCommunityIcons
                              name="cube-outline"
                              size={22}
                              color="#FF6600"
                            />

                            <Text className="text-body-bold text-white font-sans">
                              {rental.cabinet}
                            </Text>
                          </View>

                          <Badge
                            label={formatCountdown(rental.timeLeft)}
                            status={getRentalBadgeStatus(rental.timeLeft)}
                          />
                        </View>

                        <View className="flex-row items-center gap-two mt-two">
                          <MaterialCommunityIcons
                            name="map-marker-outline"
                            size={16}
                            color="#A1A1A0"
                          />

                          <Text className="text-small text-text-secondary">
                            {rental.location}
                          </Text>
                        </View>
                      </Pressable>

                      {/* Divider between items */}

                      {!isLast && (
                        <View className="h-[1px] bg-border/40 my-four" />
                      )}
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {/* 6. Có th? b?n mu?n bi?t (FAQ Section) */}

          <View className="mb-five">
            <Text className="text-body-bold text-white mb-three">
              Có thể bạn muốn biết
            </Text>

            <View className="bg-surface border border-border rounded-panel overflow-hidden">
              {popularFaqs.map((faq) => {
                return (
                  <Pressable
                    key={faq.id}
                    onPress={() => {
                      if (Platform.OS !== "web") {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      }

                      // Navigate specifically to the individual detail page

                      router.push(`/faq/${faq.id}`);
                    }}
                    className="flex-row items-center justify-between px-four py-four active:bg-surface-elevated border-b border-border/40"
                  >
                    <Text
                      className="text-small-bold text-white flex-1 pr-four"
                      numberOfLines={1}
                    >
                      {faq.question}
                    </Text>

                    <MaterialCommunityIcons
                      name="chevron-right"
                      size={20}
                      color="#A1A1A0"
                    />
                  </Pressable>
                );
              })}

              {/* Xem thêm button row at the bottom of the list */}

              <Pressable
                onPress={() => {
                  if (Platform.OS !== "web") {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }

                  // Navigate to the list of all questions

                  router.push("/faq");
                }}
                className="flex-row items-center justify-center py-three bg-surface active:bg-surface-elevated"
              >
                <Text className="text-small-bold text-text-secondary mr-one">
                  Xem thêm câu hỏi
                </Text>

                <MaterialCommunityIcons
                  name="chevron-double-right"
                  size={16}
                  color="#A1A1A0"
                />
              </Pressable>
            </View>
          </View>

          {/* 7. Hotline Footer Strip */}

          <View className="flex-row justify-between items-center border-t border-border/80 pt-four pb-five">
            <View>
              <Text className="text-small text-text-secondary">
                Hotline hỗ trợ 24/7
              </Text>

              <Text className="text-body-bold text-brand">1900 1234 56</Text>
            </View>

            <Pressable
              onPress={handleCallHotline}
              className="w-11 h-11 bg-surface-glass border border-border rounded-full items-center justify-center"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <MaterialCommunityIcons name="phone" size={20} color="#FF6600" />
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
