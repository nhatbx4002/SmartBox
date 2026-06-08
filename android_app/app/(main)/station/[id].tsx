import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  Platform,
  Dimensions,
  Image,
  ScrollView,
  Linking,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import * as Location from "expo-location";

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
  imageUrl?: string;
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
    imageUrl: "https://images.unsplash.com/photo-1571171637578-41bc2dd4d6f0?w=800&auto=format&fit=crop&q=80",
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
    imageUrl: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&auto=format&fit=crop&q=80",
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
    imageUrl: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&auto=format&fit=crop&q=80",
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
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80",
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
    imageUrl: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&auto=format&fit=crop&q=80",
  },
];

export default function StationDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const screenHeight = Dimensions.get("window").height;

  const station = SAMPLE_LOCATIONS.find((loc) => loc.id === id);

  const handleBack = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  const handleOpenDirections = () => {
    if (!station) return;
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    const url = Platform.select({
      ios: `maps://app?daddr=${station.latitude},${station.longitude}&label=${encodeURIComponent(station.name)}`,
      android: `geo:0,0?q=${station.latitude},${station.longitude}(${encodeURIComponent(station.name)})`,
      default: `https://www.google.com/maps/dir/?api=1&destination=${station.latitude},${station.longitude}`,
    });

    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        const webUrl = `https://www.google.com/maps/dir/?api=1&destination=${station.latitude},${station.longitude}`;
        Linking.openURL(webUrl);
      }
    }).catch(() => {
      const webUrl = `https://www.google.com/maps/dir/?api=1&destination=${station.latitude},${station.longitude}`;
      Linking.openURL(webUrl);
    });
  };

  const handleRent = () => {
    if (!station) return;
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    router.push(`/rent/${station.id}` as any);
  };

  if (!station) {
    return (
      <View className="flex-1 bg-background items-center justify-center p-four">
        <Text className="text-body-bold text-white">Kh?ng t?m th?y tr?m t? n?y</Text>
        <Pressable onPress={handleBack} className="mt-four bg-brand px-four py-two rounded-input">
          <Text className="text-white font-bold">Quay l?i</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      {/* 1. Header */}
      <View 
        className="flex-row items-center justify-between px-four pb-three border-b border-border/40 bg-surface/50 z-20"
        style={{ paddingTop: insets.top + 12 }}
      >
        <Pressable
          onPress={handleBack}
          className="w-10 h-10 rounded-full items-center justify-center bg-surface-glass border border-border"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
        </Pressable>
        <Text className="text-h3 text-white font-bold">Chi ti?t t?</Text>
        <View className="w-10 h-10" />
      </View>

      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
      >
        {/* 2. Top Section (Map Preview - 35% height) */}
        <View style={{ height: screenHeight * 0.35 }} className="w-full">
          {Platform.OS === "web" ? (
            <View className="w-full h-full bg-[#121212] items-center justify-center">
              <Text className="text-text-secondary">B?n ?? kh?ng h? tr? tr?n Web</Text>
            </View>
          ) : (
            <MapView
              style={{ width: "100%", height: "100%" }}
              initialRegion={{
                latitude: station.latitude,
                longitude: station.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              }}
              customMapStyle={mapDarkStyle}
              scrollEnabled={false}
              zoomEnabled={false}
              pitchEnabled={false}
              rotateEnabled={false}
            >
              <Marker
                coordinate={{
                  latitude: station.latitude,
                  longitude: station.longitude,
                }}
                title={station.name}
              >
                <View className="bg-brand border border-white p-two rounded-full shadow-md items-center justify-center">
                  <MaterialCommunityIcons name="cube" size={16} color="#FFFFFF" />
                </View>
              </Marker>
            </MapView>
          )}
        </View>

        {/* 3. Content Container (Scrollable Card - overlapping Map) */}
        <View 
          className="bg-surface rounded-t-[32px] p-five border-t border-l border-r border-border min-h-[400px]"
          style={{ marginTop: -32 }}
        >
          {/* Real-life image */}
          <Image
            source={{ uri: station.imageUrl }}
            className="w-full h-48 rounded-panel mb-four border border-border/60"
            resizeMode="cover"
          />

          {/* Title & Address */}
          <Text className="text-h2 text-white font-bold font-sans" numberOfLines={2}>
            {station.name}
          </Text>
          <Text className="text-body text-text-secondary mt-two font-sans">
            {station.address}
          </Text>

          {/* Divider */}
          <View className="h-[1px] bg-border/40 my-four" />

          {/* Sub-parameters Row */}
          <View className="flex-row justify-between items-center bg-background/50 border border-border/60 rounded-panel px-four py-three mb-four">
            <View className="flex-row items-center gap-two">
              <MaterialCommunityIcons name="barcode-scan" size={18} color="#FF6600" />
              <Text className="text-small text-text-secondary font-sans">
                M? t?: <Text className="text-white font-mono font-bold">{station.id.toUpperCase()}</Text>
              </Text>
            </View>
            <View className="flex-row items-center gap-one">
              <MaterialCommunityIcons name="navigation" size={14} color="#FF6600" />
              <Text className="text-small-bold text-brand font-mono">{station.distance}</Text>
            </View>
          </View>

          {/* Availability details cards */}
          <View className="flex-row gap-three mb-four">
            <View className="flex-1 bg-surface-elevated/40 border border-border rounded-panel p-three items-center">
              <Text className="text-caption text-text-secondary font-sans">T? c? nh?</Text>
              <Text className="text-h2 text-white font-bold mt-one font-sans">
                {station.smallAvailable} <Text className="text-caption text-text-secondary font-normal">tr?ng</Text>
              </Text>
            </View>
            <View className="flex-1 bg-surface-elevated/40 border border-border rounded-panel p-three items-center">
              <Text className="text-caption text-text-secondary font-sans">T? c? l?n</Text>
              <Text className="text-h2 text-white font-bold mt-one font-sans">
                {station.largeAvailable} <Text className="text-caption text-text-secondary font-normal">tr?ng</Text>
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* 4. Bottom Action Bar (Fixed Layout) */}
      <View 
        style={{ paddingBottom: insets.bottom + 16 }}
        className="absolute bottom-0 left-0 right-0 bg-surface border-t border-border px-four pt-three flex-row items-center gap-three z-30 shadow-2xl"
      >
        {/* Directions button */}
        <Pressable
          onPress={handleOpenDirections}
          className="w-[40%] h-12 bg-surface-elevated border border-border rounded-input flex-row items-center justify-center gap-two active:opacity-80"
        >
          <MaterialCommunityIcons name="directions" size={18} color="#FFFFFF" />
          <Text className="text-button text-white font-semibold font-sans">Ch? ???ng</Text>
        </Pressable>

        {/* Rent button (CTA) */}
        <Pressable
          onPress={handleRent}
          className="w-[60%] h-12 bg-brand rounded-input flex-row items-center justify-center gap-two active:bg-brand-light shadow-lg"
          style={{
            shadowColor: "#FF6600",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <MaterialCommunityIcons name="cube-outline" size={18} color="#FFFFFF" />
          <Text className="text-button text-white font-bold font-sans">Ch?n t?</Text>
        </Pressable>
      </View>
    </View>
  );
}
