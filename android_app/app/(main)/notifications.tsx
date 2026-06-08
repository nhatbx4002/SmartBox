import React, { useState } from "react";
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

interface NotificationItem {
  id: string;
  title: string;
  body: string;
  time: string;
  group: "Hôm nay" | "Hôm qua" | "Cũ hơn";
  isRead: boolean;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "1",
    title: "Thanh toán thành công",
    body: "Bạn đã thuê thành công tủ A1 tại Kiosk Nhà A3 - Campus A. Hạn dùng đến 12:30 hôm nay.",
    time: "10:00",
    group: "Hôm nay",
    isRead: false,
  },
  {
    id: "2",
    title: "Cảnh báo hết hạn tủ",
    body: "Tủ C2 tại Thư viện Tạ Quang Bửu của bạn sắp hết hạn thuê trong 10 phút nữa. Vui lòng gia hạn hoặc trả tủ.",
    time: "09:50",
    group: "Hôm nay",
    isRead: false,
  },
  {
    id: "3",
    title: "Mở khóa cửa tủ thành công",
    body: "Bạn đã gửi lệnh mở khóa cửa tủ A1 thành công bằng ứng dụng.",
    time: "10:00",
    group: "Hôm qua",
    isRead: true,
  },
  {
    id: "4",
    title: "Trả tủ hoàn thành",
    body: "Cảm ơn bạn đã sử dụng dịch vụ tủ khóa thông minh SmartBox. Tủ B3 của bạn đã được trả thành công.",
    time: "15:30 - 05/06",
    group: "Cũ hơn",
    isRead: true,
  },
];

type FilterType = "all" | "unread";

export default function NotificationsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState<FilterType>("all");

  const handleMarkAllRead = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, isRead: true }))
    );
  };

  const handleToggleRead = (id: string) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setNotifications((prev) =>
      prev.map((notif) => {
        if (notif.id === id) {
          return { ...notif, isRead: true };
        }
        return notif;
      })
    );
  };

  // Filter items
  const filteredNotifs = notifications.filter((notif) => {
    if (filter === "unread") return !notif.isRead;
    return true;
  });

  // Group notifications
  const groups: { [key: string]: NotificationItem[] } = {
    "Hôm nay": [],
    "Hôm qua": [],
    "Cũ hơn": [],
  };

  filteredNotifs.forEach((n) => {
    groups[n.group].push(n);
  });

  const hasNotifications = filteredNotifs.length > 0;

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="flex-row justify-between items-center px-four py-three border-b border-border/40 bg-surface/50">
        <View className="flex-row items-center">
          <Pressable
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full items-center justify-center bg-surface border border-border"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </Pressable>
          <Text className="text-h3 text-white font-bold ml-three">Thông báo</Text>
        </View>

        <Pressable
          onPress={handleMarkAllRead}
          className="px-three py-one.5 bg-surface-glass border border-border rounded-badge active:bg-surface-elevated"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text className="text-small-bold text-brand">Đọc hết</Text>
        </Pressable>
      </View>

      {/* Filter Bar */}
      <View className="flex-row px-four py-three gap-two">
        <Pressable
          onPress={() => {
            if (Platform.OS !== "web") {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
            setFilter("all");
          }}
          className={`px-three py-two rounded-badge border ${
            filter === "all" ? "bg-brand/20 border-brand" : "bg-surface border-border"
          }`}
        >
          <Text className={`text-small-bold ${filter === "all" ? "text-brand" : "text-text-secondary"}`}>
            Tất cả
          </Text>
        </Pressable>

        <Pressable
          onPress={() => {
            if (Platform.OS !== "web") {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
            setFilter("unread");
          }}
          className={`px-three py-two rounded-badge border ${
            filter === "unread" ? "bg-brand/20 border-brand" : "bg-surface border-border"
          }`}
        >
          <Text className={`text-small-bold ${filter === "unread" ? "text-brand" : "text-text-secondary"}`}>
            Chưa đọc
          </Text>
        </Pressable>
      </View>

      {/* Notifications List */}
      <ScrollView
        className="flex-1 px-four"
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
      >
        {hasNotifications ? (
          (Object.keys(groups) as Array<keyof typeof groups>).map((groupName) => {
            const items = groups[groupName];
            if (items.length === 0) return null;

            return (
              <View key={groupName} className="mb-four">
                <Text className="text-small-bold text-text-secondary mb-three px-one">
                  {groupName}
                </Text>
                
                <View className="gap-three">
                  {items.map((item) => (
                    <Pressable
                      key={item.id}
                      onPress={() => handleToggleRead(item.id)}
                      className={`bg-surface border rounded-panel p-four flex-row relative overflow-hidden ${
                        item.isRead ? "border-border opacity-60" : "border-border/80 border-l-4 border-l-brand"
                      }`}
                    >
                      {/* Brand Dot indicator for unread */}
                      {!item.isRead && (
                        <View className="absolute top-four right-four w-2.5 h-2.5 rounded-full bg-brand" />
                      )}

                      <View className="flex-1 pr-four">
                        <View className="flex-row items-center gap-two">
                          <Text className={`text-body-bold text-white ${!item.isRead ? "" : "font-normal"}`}>
                            {item.title}
                          </Text>
                        </View>
                        
                        <Text className="text-caption text-text-secondary mt-one">
                          {item.body}
                        </Text>
                        
                        <View className="flex-row items-center gap-one mt-two">
                          <MaterialCommunityIcons name="clock-outline" size={12} color="#A1A1A0" />
                          <Text className="text-[11px] text-text-secondary">{item.time}</Text>
                        </View>
                      </View>
                    </Pressable>
                  ))}
                </View>
              </View>
            );
          })
        ) : (
          /* Empty State */
          <View className="items-center justify-center py-six mt-six gap-four">
            <View className="w-20 h-20 rounded-avatar bg-surface-glass border border-border items-center justify-center">
              <MaterialCommunityIcons name="bell-off-outline" size={40} color="#6B6B6A" />
            </View>
            <View className="items-center gap-one">
              <Text className="text-body-bold text-white">Không có thông báo mới</Text>
              <Text className="text-caption text-text-secondary text-center px-six">
                Hộp thư của bạn hiện tại không có thông báo nào.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
