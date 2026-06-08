import React from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";

import Button from "../../src/components/ui/button";

interface SettingItem {
  icon: keyof typeof Ionicons.glyphMap | keyof typeof MaterialCommunityIcons.glyphMap;
  isMaterial?: boolean;
  label: string;
  route?: string;
  isStub?: boolean;
}

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const settingsItems: SettingItem[] = [
    {
      icon: "account-edit-outline",
      isMaterial: true,
      label: "Chỉnh sửa profile",
      isStub: true,
    },
    {
      icon: "lock-open-outline",
      isMaterial: true,
      label: "Đổi mật khẩu",
      isStub: true,
    },
    {
      icon: "notifications-outline",
      label: "Thông báo",
      route: "/notifications",
    },
    {
      icon: "help-circle-outline",
      label: "Trợ giúp & Hỗ trợ",
      isStub: true,
    },
    {
      icon: "document-text-outline",
      label: "Điều khoản sử dụng",
      isStub: true,
    },
  ];

  const handleLogout = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    // Perform redirection to login
    router.replace("/login");
  };

  const handleItemPress = (item: SettingItem) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    if (item.route) {
      router.push(item.route);
    } else if (item.isStub) {
      alert(`Tính năng "${item.label}" sẽ sớm được phát triển.`);
    }
  };

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="flex-row items-center px-four py-three border-b border-border/40 bg-surface/50">
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full items-center justify-center bg-surface border border-border"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
        </Pressable>
        <Text className="text-h3 text-white font-bold ml-three">Tài khoản</Text>
      </View>

      <ScrollView
        className="flex-1 px-four"
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header Card */}
        <View className="items-center bg-surface border border-border rounded-panel p-five my-four">
          <View className="w-20 h-20 rounded-full bg-brand-glow border-2 border-brand items-center justify-center relative overflow-hidden mb-three">
            <Text className="text-h1 text-brand font-bold">A</Text>
          </View>
          <Text className="text-h3 text-white font-bold">Nguyễn Văn A</Text>
          <Text className="text-body text-text-secondary mt-half">0987 654 321</Text>
          <Text className="text-caption text-text-muted mt-half">nguyenvana@gmail.com</Text>
        </View>

        {/* Settings List */}
        <View className="bg-surface border border-border rounded-panel overflow-hidden mb-five">
          {settingsItems.map((item, index) => {
            const isLast = index === settingsItems.length - 1;
            return (
              <Pressable
                key={item.label}
                onPress={() => handleItemPress(item)}
                className={`flex-row items-center justify-between px-four py-four active:bg-surface-elevated ${
                  !isLast ? "border-b border-border/40" : ""
                }`}
              >
                <View className="flex-row items-center gap-three">
                  {item.isMaterial ? (
                    <MaterialCommunityIcons
                      name={item.icon as any}
                      size={20}
                      color="#FF6600"
                    />
                  ) : (
                    <Ionicons name={item.icon as any} size={20} color="#FF6600" />
                  )}
                  <Text className="text-body text-white font-sans">{item.label}</Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={20} color="#A1A1A0" />
              </Pressable>
            );
          })}
        </View>

        {/* Logout Button */}
        <View className="mb-six">
          <Button title="Đăng xuất" variant="danger" onPress={handleLogout} />
        </View>

        {/* App Version */}
        <View className="items-center mt-two">
          <Text className="text-small text-text-muted">Phiên bản v1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
}
