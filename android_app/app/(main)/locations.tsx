import React, { useEffect, useMemo, useState } from "react";
import { View, Text, Pressable, ActivityIndicator, Linking, Platform, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as ExpoLocation from "expo-location";
import BottomSheet from "../../src/components/ui/bottom-sheet";
import Input from "../../src/components/ui/input";
import SpringPressable from "../../src/components/ui/spring-pressable";
import { useLocationStore } from "../../src/store/locationStore";

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

function distanceLabel(distance: number | null) {
  return distance === null ? "--" : `${distance.toFixed(1)} km`;
}

export default function LocationsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState("");
  const [userCoords, setUserCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const locations = useLocationStore((state) => state.locations);
  const fetchLocations = useLocationStore((state) => state.fetchLocations);
  const isLoading = useLocationStore((state) => state.isLoading);

  useEffect(() => {
    const load = async () => {
      try {
        const permission = await ExpoLocation.requestForegroundPermissionsAsync();
        if (permission.status === "granted") {
          const current = await ExpoLocation.getCurrentPositionAsync({});
          setUserCoords({
            latitude: current.coords.latitude,
            longitude: current.coords.longitude,
          });
          await fetchLocations(current.coords.latitude, current.coords.longitude);
          return;
        }
      } catch {}

      await fetchLocations();
    };

    load();
  }, [fetchLocations]);

  const filteredLocations = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return locations;
    return locations.filter(
      (item) => item.name.toLowerCase().includes(query) || item.address.toLowerCase().includes(query),
    );
  }, [locations, searchQuery]);

  const mapRegion = useMemo(() => {
    const first = filteredLocations[0];
    return {
      latitude: userCoords?.latitude ?? first?.latitude ?? 10.7795,
      longitude: userCoords?.longitude ?? first?.longitude ?? 106.699,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02,
    };
  }, [filteredLocations, userCoords]);

  const openDirections = (latitude: number | null, longitude: number | null, label: string) => {
    if (latitude === null || longitude === null) return;
    const url = Platform.select({
      ios: `maps://app?daddr=${latitude},${longitude}&label=${encodeURIComponent(label)}`,
      android: `geo:0,0?q=${latitude},${longitude}(${encodeURIComponent(label)})`,
      default: `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`,
    });

    Linking.openURL(url as string).catch(() => {
      Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`);
    });
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace("/home");
  };

  return (
    <View className="flex-1 bg-background">
      {Platform.OS === "web" || !MapView ? (
        <View className="flex-1 items-center justify-center px-four">
          <Text className="text-caption text-text-secondary text-center">
            Bản đồ chỉ hiển thị trên app mobile.
          </Text>
        </View>
      ) : (
        <View className="flex-1">
          <MapView
            style={{ width: "100%", height: "100%" }}
            region={mapRegion}
            customMapStyle={mapDarkStyle}
            showsUserLocation={false}
            showsMyLocationButton={false}
          >
            {userCoords ? (
              <Marker coordinate={userCoords}>
                <View className="w-3.5 h-3.5 rounded-full bg-brand border-2 border-white" />
              </Marker>
            ) : null}

            {filteredLocations.map((item) =>
              item.latitude !== null && item.longitude !== null ? (
                <Marker
                  key={item.id}
                  coordinate={{ latitude: item.latitude, longitude: item.longitude }}
                  onPress={() => router.push(`/station/${item.id}` as any)}
                >
                  <View className="bg-brand border border-white px-two py-one rounded-full">
                    <Text className="text-[10px] text-white font-bold">{item.availableCount}</Text>
                  </View>
                </Marker>
              ) : null,
            )}
          </MapView>

          <BottomSheet initialSnap="half">
            <ScrollView
              className="flex-1"
              nestedScrollEnabled
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
            >
              <View className="pt-one pb-three">
                <Input
                  placeholder="Tìm kiếm trạm tủ..."
                  leftIcon="search"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>

              <View className="flex-row items-center justify-between mb-three">
                <Text className="text-body-bold text-white">Trạm gần bạn</Text>
                <Text className="text-small text-text-secondary">{filteredLocations.length} kết quả</Text>
              </View>

              {isLoading ? (
                <ActivityIndicator color="#FF6600" />
              ) : filteredLocations.length > 0 ? (
                <View className="gap-three">
                  {filteredLocations.map((item) => (
                    <SpringPressable
                      key={item.id}
                      onPress={() => router.push(`/station/${item.id}` as any)}
                      className="bg-background border border-border rounded-panel p-four"
                      glowOnPress
                    >
                      <View className="flex-row justify-between items-start">
                        <View className="flex-1 pr-three">
                          <Text className="text-body-bold text-white">{item.name}</Text>
                          <Text className="text-caption text-text-secondary mt-one">{item.address}</Text>
                        </View>
                        <Text className="text-caption text-text-secondary">{distanceLabel(item.distance)}</Text>
                      </View>

                      <View className="flex-row items-center justify-between mt-three">
                        <Text className="text-small text-text-secondary">
                          Còn {item.availableSmall} tủ nhỏ • {item.availableLarge} tủ lớn
                        </Text>
                        <Text className={`text-small-bold ${item.status === "online" ? "text-success" : "text-error"}`}>
                          {item.status === "online" ? "Online" : "Offline"}
                        </Text>
                      </View>

                      <View className="flex-row gap-three mt-three">
                        <Pressable
                          onPress={() => router.push(`/station/${item.id}` as any)}
                          className="flex-1 h-10 bg-brand rounded-input items-center justify-center"
                        >
                          <Text className="text-small-bold text-white">Thuê ngay</Text>
                        </Pressable>
                        <Pressable
                          onPress={() => openDirections(item.latitude, item.longitude, item.name)}
                          className="flex-1 h-10 bg-surface border border-border rounded-input items-center justify-center"
                        >
                          <Text className="text-small-bold text-white">Chỉ đường</Text>
                        </Pressable>
                      </View>
                    </SpringPressable>
                  ))}
                </View>
              ) : (
                <View className="items-center justify-center py-six gap-four">
                  <MaterialCommunityIcons name="map-marker-off" size={40} color="#6B6B6A" />
                  <Text className="text-caption text-text-secondary text-center">
                    Không tìm thấy trạm tủ phù hợp.
                  </Text>
                </View>
              )}
            </ScrollView>
          </BottomSheet>

          <View
            className="absolute top-0 left-0 right-0 px-four"
            style={{ paddingTop: insets.top + 12, zIndex: 50, elevation: 50 }}
            pointerEvents="box-none"
          >
            <View className="flex-row items-center gap-three">
              <Pressable
                onPress={handleBack}
                className="w-10 h-10 rounded-full items-center justify-center bg-surface border border-border"
                style={{ elevation: 60 }}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
              </Pressable>
              <View className="flex-1">
                <Text className="text-small text-text-secondary">OmniBox Station</Text>
                <Text className="text-h3 text-white font-bold">Vị trí tủ</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
