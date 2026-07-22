import React, { useEffect, useMemo, useState } from "react";
import { View, Text, ScrollView, Pressable, Platform, ActivityIndicator, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { Notification } from "../../src/types";
import { userService } from "../../src/services/user";

type FilterType = "all" | "unread";

export default function NotificationsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [isLoading, setIsLoading] = useState(true);

  const loadNotifications = async () => {
    try {
      setIsLoading(true);
      const response = await userService.getNotifications();
      setNotifications(response.data);
    } catch (error: any) {
      Alert.alert("Không thể tải thông báo", error?.message || "Có lỗi xảy ra.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    try {
      await userService.markAllNotificationsRead();
      setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
      setFilter("all");
    } catch (error: any) {
      Alert.alert("Không thể cập nhật", error?.message || "Có lỗi xảy ra.");
    }
  };

  const handleToggleRead = async (id: string) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    try {
      await userService.markNotificationRead(id);
      setNotifications((prev) => prev.map((item) => (item.id === id ? { ...item, isRead: true } : item)));
    } catch (error: any) {
      Alert.alert("Không thể cập nhật", error?.message || "Có lỗi xảy ra.");
    }
  };

  const filteredNotifs = useMemo(
    () => notifications.filter((item) => (filter === "unread" ? !item.isRead : true)),
    [filter, notifications],
  );

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
          <Text className="text-h3 text-white font-bold ml-three">Thông báo</Text>
        </View>

        <Pressable
          onPress={handleMarkAllRead}
          className="px-three py-one.5 bg-surface-glass border border-border rounded-badge"
        >
          <Text className="text-small-bold text-brand">Đọc hết</Text>
        </Pressable>
      </View>

      <View className="flex-row px-four py-three gap-two">
        <Pressable
          onPress={() => setFilter("all")}
          className={`px-three py-two rounded-badge border ${filter === "all" ? "bg-brand/20 border-brand" : "bg-surface border-border"}`}
        >
          <Text className={`text-small-bold ${filter === "all" ? "text-brand" : "text-text-secondary"}`}>Tất cả</Text>
        </Pressable>
        <Pressable
          onPress={() => setFilter("unread")}
          className={`px-three py-two rounded-badge border ${filter === "unread" ? "bg-brand/20 border-brand" : "bg-surface border-border"}`}
        >
          <Text className={`text-small-bold ${filter === "unread" ? "text-brand" : "text-text-secondary"}`}>Chưa đọc</Text>
        </Pressable>
      </View>

      <ScrollView
        className="flex-1 px-four"
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <ActivityIndicator color="#FF6600" />
        ) : filteredNotifs.length > 0 ? (
          <View className="gap-three">
            {filteredNotifs.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => handleToggleRead(item.id)}
                className={`bg-surface border rounded-panel p-four relative overflow-hidden ${item.isRead ? "border-border opacity-60" : "border-border/80 border-l-4 border-l-brand"}`}
              >
                {!item.isRead ? <View className="absolute top-four right-four w-2.5 h-2.5 rounded-full bg-brand" /> : null}
                <Text className="text-body-bold text-white">{item.title}</Text>
                <Text className="text-caption text-text-secondary mt-one">{item.body}</Text>
                <View className="flex-row items-center gap-one mt-two">
                  <MaterialCommunityIcons name="clock-outline" size={12} color="#A1A1A0" />
                  <Text className="text-[11px] text-text-secondary">
                    {new Date(item.sentAt).toLocaleString("vi-VN")}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        ) : (
          <View className="items-center justify-center py-six mt-six gap-four">
            <MaterialCommunityIcons name="bell-off-outline" size={40} color="#6B6B6A" />
            <Text className="text-caption text-text-secondary text-center px-six">
              Không có thông báo mới.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
