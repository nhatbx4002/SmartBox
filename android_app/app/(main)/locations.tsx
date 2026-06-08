import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  View,
  Text,
  Pressable,
  Platform,
  Dimensions,
  Linking,
  Modal,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import * as Location from "expo-location";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";

import Input from "../../src/components/ui/input";
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
    "elementType": "geometry",
    "stylers": [{ "color": "#121212" }]
  },
  {
    "elementType": "labels.icon",
    "stylers": [{ "visibility": "off" }]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#757575" }]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [{ "color": "#121212" }]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry",
    "stylers": [{ "color": "#757575" }]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#757575" }]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [{ "color": "#181818" }]
  },
  {
    "featureType": "road",
    "elementType": "geometry.fill",
    "stylers": [{ "color": "#2c2c2c" }]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#8a8a8a" }]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [{ "color": "#000000" }]
  }
];

interface LocationData {
  id: string;
  name: string;
  address: string;
  distance: string;
  smallAvailable: number;
  largeAvailable: number;
  isOnline: boolean;
  latitude: number;
  longitude: number;
}

const SAMPLE_LOCATIONS: LocationData[] = [
  {
    id: "a3-campus-a",
    name: "Kiosk Nh? A3 - Campus A",
    address: "???ng ??i C? Vi?t, B?ch Khoa, Hai B? Tr?ng, H? N?i",
    distance: "0.2 km",
    smallAvailable: 5,
    largeAvailable: 3,
    isOnline: true,
    latitude: 21.0068,
    longitude: 105.8431,
  },
  {
    id: "ktx-b10",
    name: "C?ng K? T?c X? B10",
    address: "T? Quang B?u, B?ch Khoa, Hai B? Tr?ng, H? N?i",
    distance: "0.5 km",
    smallAvailable: 2,
    largeAvailable: 0,
    isOnline: true,
    latitude: 21.0053,
    longitude: 105.8454,
  },
  {
    id: "lib-tqb",
    name: "Th? vi?n T? Quang B?u",
    address: "Ph? T? Quang B?u, B?ch Khoa, Hai B? Tr?ng, H? N?i",
    distance: "0.8 km",
    smallAvailable: 0,
    largeAvailable: 4,
    isOnline: true,
    latitude: 21.0049,
    longitude: 105.8428,
  },
  {
    id: "parking-d3",
    name: "Nh? xe D3 - Campus B",
    address: "Khu?n vi?n D3, B?ch Khoa, Hai B? Tr?ng, H? N?i",
    distance: "1.2 km",
    smallAvailable: 0,
    largeAvailable: 0,
    isOnline: false,
    latitude: 21.0075,
    longitude: 105.8423,
  },
  {
    id: "sports-outdoor",
    name: "Khu Th? thao Ngo?i tr?i",
    address: "???ng Tr?n ??i Ngh?a, B?ch Khoa, Hai B? Tr?ng, H? N?i",
    distance: "1.5 km",
    smallAvailable: 3,
    largeAvailable: 2,
    isOnline: true,
    latitude: 21.0039,
    longitude: 105.8475,
  },
];

export default function LocationsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState("");
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  



  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          let location = await Location.getCurrentPositionAsync({});
          setUserLocation(location);
        }
      } catch (err) {
        console.log("Error getting location:", err);
      }
    })();
  }, []);

  const filteredLocations = SAMPLE_LOCATIONS.filter((loc) => {
    const query = searchQuery.toLowerCase();
    return (
      loc.name.toLowerCase().includes(query) ||
      loc.address.toLowerCase().includes(query)
    );
  });

  const handleSelectLocation = (item: LocationData) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push(`/station/${item.id}` as any);
  };

  const openDirections = (latitude: number, longitude: number, label: string) => {
    const url = Platform.select({
      ios: `maps://app?daddr=${latitude},${longitude}&label=${encodeURIComponent(label)}`,
      android: `geo:0,0?q=${latitude},${longitude}(${encodeURIComponent(label)})`,
      default: `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`,
    });

    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        const webUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
        Linking.openURL(webUrl);
      }
    }).catch(() => {
      const webUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
      Linking.openURL(webUrl);
    });
  };

  // gorhom BottomSheet Configuration
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["35%", "60%", "95%"], []);

  // Center coordinate of map (defaults to user's location or Kiosk Nh? A3)
  const defaultLatitude = userLocation?.coords.latitude ?? 21.0068;
  const defaultLongitude = userLocation?.coords.longitude ?? 105.8431;

  // Render station list item (shared between mobile and web list)
  const renderStationItem = (item: LocationData) => (
    <SpringPressable
      onPress={() => handleSelectLocation(item)}
      className="bg-surface border border-border rounded-panel p-four mb-three shadow-md relative overflow-hidden"
      glowOnPress
    >
      <View className="flex-row gap-three items-center">
        {/* Icon */}
        <View className="w-10 h-10 rounded-full bg-brand-glow items-center justify-center border border-brand/30">
          <MaterialCommunityIcons name="cube-outline" size={20} color="#FF6600" />
        </View>

        {/* Title & Info */}
        <View className="flex-1">
          <View className="flex-row justify-between items-start">
            <Text className="text-body-bold text-white pr-six flex-1" numberOfLines={1}>
              {item.name}
            </Text>
            {/* Distance */}
            <Text className="text-caption text-text-secondary font-medium">{item.distance}</Text>
          </View>

          <Text className="text-caption text-text-secondary mt-one" numberOfLines={1}>
            {item.address}
          </Text>

          {/* Available slots */}
          <View className="flex-row items-center gap-three mt-two">
            <Text className="text-small text-text-secondary">
              T? Nh?: <Text className="text-white font-bold">{item.smallAvailable}</Text>
            </Text>
            <Text className="text-small text-text-secondary">
              T? L?n: <Text className="text-white font-bold">{item.largeAvailable}</Text>
            </Text>
            <View className="flex-1" />
            <View className={`w-2 h-2 rounded-full ${item.isOnline ? "bg-success" : "bg-error"}`} />
            <Text className="text-[10px] text-text-secondary font-medium ml-one">
              {item.isOnline ? "Online" : "Offline"}
            </Text>
          </View>
        </View>
      </View>
    </SpringPressable>
  );

  const renderEmptyState = () => (
    <View className="items-center justify-center py-six mt-six gap-four">
      <View className="w-20 h-20 rounded-avatar bg-surface-glass border border-border items-center justify-center">
        <MaterialCommunityIcons name="map-marker-off" size={40} color="#6B6B6A" />
      </View>
      <View className="items-center gap-one">
        <Text className="text-body-bold text-white">Ch?a c? ??a ?i?m n?o</Text>
        <Text className="text-caption text-text-secondary text-center px-six">
          Kh?ng t?m th?y ??a ?i?m t? ph? h?p v?i t? kh?a c?a b?n.
        </Text>
      </View>
    </View>
  );

  return (
    <GestureHandlerRootView className="flex-1">
      <View className="flex-1 bg-background">
        {/* 1. Base Layer (B?n ??) */}
        <View className="flex-1">
          {Platform.OS === "web" ? (
            <View className="absolute inset-0 bg-[#121212] items-center justify-center">
              <Text className="text-text-secondary">B?n ?? kh?ng h? tr? tr?n Web</Text>
            </View>
          ) : (
            <MapView
              style={{ width: "100%", height: "100%" }}
              region={{
                latitude: defaultLatitude,
                longitude: defaultLongitude,
                latitudeDelta: 0.02,
                longitudeDelta: 0.02,
              }}
              customMapStyle={mapDarkStyle}
              scrollEnabled={true}
              zoomEnabled={true}
              pitchEnabled={true}
              rotateEnabled={true}
            >
              {/* User Location Marker */}
              {userLocation && (
                <Marker
                  coordinate={{
                    latitude: userLocation.coords.latitude,
                    longitude: userLocation.coords.longitude,
                  }}
                  title="V? tr? c?a b?n"
                >
                  <View className="w-4 h-4 items-center justify-center">
                    <View className="absolute w-8 h-8 rounded-full bg-brand/30" />
                    <View className="w-3.5 h-3.5 rounded-full bg-brand border-2 border-white" />
                  </View>
                </Marker>
              )}

              {/* Station Markers */}
              {filteredLocations.map((item) => (
                <Marker
                  key={item.id}
                  coordinate={{
                    latitude: item.latitude,
                    longitude: item.longitude,
                  }}
                  title={item.name}
                  description={item.address}
                  onPress={(e: any) => {
                    e.stopPropagation();
                    handleSelectLocation(item);
                  }}
                >
                  <View className="bg-brand border border-white p-two rounded-full shadow-md items-center justify-center">
                    <MaterialCommunityIcons name="cube" size={16} color="#FFFFFF" />
                  </View>
                </Marker>
              ))}
            </MapView>
          )}
        </View>

        {/* 2. Floating Top Layer (Header) */}
        <View
          style={{
            position: "absolute",
            top: insets.top + 16,
            left: 16,
            right: 16,
            zIndex: 10,
          }}
          className="flex-row items-center gap-three"
        >
          <Pressable
            onPress={() => router.back()}
            className="w-12 h-12 rounded-full items-center justify-center bg-surface-glass shadow-lg border border-border active:bg-surface-elevated"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
          </Pressable>
          
          <View className="bg-surface-glass border border-border px-four py-two.5 rounded-full shadow-lg">
            <Text className="text-body-bold text-white font-sans">V? tr? t?</Text>
          </View>
        </View>

        {/* 3. Sliding Layer (Bottom Sheet) */}
        {Platform.OS === "web" ? (
          /* Web Fallback */
          <View
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: "40%",
              backgroundColor: "#1C1C1B",
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              borderLeftWidth: 1,
              borderRightWidth: 1,
              borderTopWidth: 1,
              borderColor: "#252525",
              shadowColor: "#000000",
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: 0.1,
              shadowRadius: 10,
              elevation: 10,
              zIndex: 20,
            }}
          >
            <View className="px-four pt-three pb-three bg-surface border-b border-border/60 rounded-t-panel">
              <View className="w-12 h-1 bg-text-muted rounded-full self-center mb-three" />
              <View className="mb-one">
                <Input
                  placeholder="T?m ki?m tr?m t?..."
                  leftIcon="search"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
            </View>

            <View className="flex-1 px-four pt-three bg-surface">
              <FlatList
                data={filteredLocations}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 60 }}
                renderItem={({ item }) => renderStationItem(item)}
                ListEmptyComponent={renderEmptyState}
              />
            </View>
          </View>
        ) : (
          /* Mobile Platform: gorhom BottomSheet */
          <BottomSheet
            ref={bottomSheetRef}
            snapPoints={snapPoints}
            index={0}
            backgroundStyle={{ 
              backgroundColor: "#1C1C1B", 
              borderTopLeftRadius: 24, 
              borderTopRightRadius: 24,
              borderLeftWidth: 1,
              borderRightWidth: 1,
              borderTopWidth: 1,
              borderColor: "#252525"
            }}
            handleIndicatorStyle={{ backgroundColor: "#6B6B6A", width: 48, height: 4 }}
          >
            {/* Search Input fixed at top of sheet */}
            <View className="px-four pt-two pb-three bg-surface border-b border-border/60">
              <View className="mb-one">
                <Input
                  placeholder="T?m ki?m tr?m t?..."
                  leftIcon="search"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
            </View>

            {/* Scrolling list wrapping BottomSheetFlatList */}
            <BottomSheetFlatList
              data={filteredLocations}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 60 }}
              style={{ backgroundColor: "#1C1C1B" }}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => renderStationItem(item)}
              ListEmptyComponent={renderEmptyState}
            />
          </BottomSheet>
        )}

  
      </View>
    </GestureHandlerRootView>
  );
}
