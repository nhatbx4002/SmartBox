import React, { useEffect, useMemo } from "react";
import { View, Text, Pressable, ScrollView, Linking, Platform, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocationStore } from "../../../src/store/locationStore";

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

export default function StationDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const selectedLocation = useLocationStore((state) => state.selectedLocation);
  const fetchLocationDetail = useLocationStore((state) => state.fetchLocationDetail);
  const isLoading = useLocationStore((state) => state.isLoading);

  useEffect(() => {
    if (id) {
      fetchLocationDetail(String(id));
    }
  }, [fetchLocationDetail, id]);

  const availability = useMemo(() => {
    const result = { small: 0, large: 0 };
    if (!selectedLocation) return result;

    for (const cabinet of selectedLocation.cabinets) {
      for (const compartment of cabinet.compartments) {
        if (compartment.status !== "AVAILABLE") continue;
        if (compartment.size === "SMALL") result.small += 1;
        if (compartment.size === "LARGE") result.large += 1;
      }
    }

    return result;
  }, [selectedLocation]);

  const handleDirections = () => {
    if (!selectedLocation?.latitude || !selectedLocation?.longitude) return;
    const url = Platform.select({
      ios: `maps://app?daddr=${selectedLocation.latitude},${selectedLocation.longitude}&label=${encodeURIComponent(selectedLocation.name)}`,
      android: `geo:0,0?q=${selectedLocation.latitude},${selectedLocation.longitude}(${encodeURIComponent(selectedLocation.name)})`,
      default: `https://www.google.com/maps/dir/?api=1&destination=${selectedLocation.latitude},${selectedLocation.longitude}`,
    });
    Linking.openURL(url as string).catch(() => undefined);
  };

  const region = {
    latitude: selectedLocation?.latitude ?? 10.7795,
    longitude: selectedLocation?.longitude ?? 106.699,
    latitudeDelta: 0.008,
    longitudeDelta: 0.008,
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
        <Text className="text-h3 text-white font-bold ml-three">Chi tiết trạm</Text>
      </View>

      <ScrollView
        className="flex-1 px-four py-four"
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
      >
        {isLoading || !selectedLocation ? (
          <ActivityIndicator color="#FF6600" />
        ) : (
          <>
            <View className="h-56 overflow-hidden rounded-panel border border-border bg-surface mb-four">
              {Platform.OS === "web" || !MapView ? (
                <View className="flex-1 items-center justify-center">
                  <Text className="text-caption text-text-secondary">Bản đồ chỉ hiển thị trên app mobile.</Text>
                </View>
              ) : (
                <MapView
                  style={{ width: "100%", height: "100%" }}
                  region={region}
                  customMapStyle={mapDarkStyle}
                  scrollEnabled={false}
                  zoomEnabled={false}
                  pitchEnabled={false}
                  rotateEnabled={false}
                >
                  {selectedLocation.latitude !== null && selectedLocation.longitude !== null ? (
                    <Marker coordinate={{ latitude: selectedLocation.latitude, longitude: selectedLocation.longitude }}>
                      <View className="bg-brand border border-white px-two py-one rounded-full">
                        <Text className="text-[10px] text-white font-bold">Tủ</Text>
                      </View>
                    </Marker>
                  ) : null}
                </MapView>
              )}
            </View>

            <View className="bg-surface border border-border rounded-panel p-four mb-four">
              <Text className="text-h2 text-white font-bold">{selectedLocation.name}</Text>
              <Text className="text-caption text-text-secondary mt-two">{selectedLocation.address}</Text>
            </View>

            <View className="flex-row gap-three mb-four">
              <View className="flex-1 bg-surface border border-border rounded-panel p-four items-center">
                <Text className="text-caption text-text-secondary">Tủ nhỏ trống</Text>
                <Text className="text-h2 text-white font-bold mt-two">{availability.small}</Text>
              </View>
              <View className="flex-1 bg-surface border border-border rounded-panel p-four items-center">
                <Text className="text-caption text-text-secondary">Tủ lớn trống</Text>
                <Text className="text-h2 text-white font-bold mt-two">{availability.large}</Text>
              </View>
            </View>

            <View className="bg-surface border border-border rounded-panel p-four mb-four">
              <Text className="text-body-bold text-white mb-three">Danh sách cabinet</Text>
              <View className="gap-three">
                {selectedLocation.cabinets.map((cabinet) => (
                  <View key={cabinet.id} className="bg-background border border-border rounded-panel p-three">
                    <View className="flex-row justify-between items-center">
                      <Text className="text-body-bold text-white">{cabinet.name}</Text>
                      <Text className={`text-small-bold ${cabinet.isOnline ? "text-success" : "text-error"}`}>
                        {cabinet.isOnline ? "Online" : "Offline"}
                      </Text>
                    </View>
                    <Text className="text-caption text-text-secondary mt-two">
                      {cabinet.compartments.filter((item) => item.status === "AVAILABLE").length}/{cabinet.compartments.length} ngăn đang trống
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            <View className="flex-row gap-three">
              <Pressable
                onPress={handleDirections}
                className="flex-1 h-12 bg-background border border-border rounded-input items-center justify-center"
              >
                <Text className="text-button text-white">Chỉ đường</Text>
              </Pressable>
              <Pressable
                onPress={() => router.push(`/rent/${id}` as any)}
                className="flex-1 h-12 bg-brand rounded-input items-center justify-center"
              >
                <Text className="text-button text-white">Thuê tủ</Text>
              </Pressable>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}
