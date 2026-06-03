import React, { useState } from 'react';
import { StyleSheet, View, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

interface NotificationItem {
  id: string;
  title: string;
  body: string;
  time: string;
  dateGroup: 'Hôm nay' | 'Hôm qua' | 'Cũ hơn';
  isRead: boolean;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    title: 'Thuê tủ thành công!',
    body: 'Ngăn tủ A1 tại Đại học Bách Khoa đã sẵn sàng. Mã OTP của bạn là: 123456.',
    time: '10:00',
    dateGroup: 'Hôm nay',
    isRead: false,
  },
  {
    id: 'n2',
    title: 'Cảnh báo sắp hết hạn!',
    body: 'Ngăn tủ A1 sẽ hết hạn sau 1 giờ. Vui lòng lấy đồ hoặc tiến hành gia hạn để tránh phát sinh chi phí.',
    time: '09:00',
    dateGroup: 'Hôm nay',
    isRead: false,
  },
  {
    id: 'n3',
    title: 'Thanh toán thành công',
    body: 'Bạn đã thanh toán 15.000đ thành công qua VietQR cho mã thuê tủ #SB9831.',
    time: '08:45',
    dateGroup: 'Hôm nay',
    isRead: true,
  },
  {
    id: 'n4',
    title: 'Hoàn tất trả tủ',
    body: 'Bạn đã hoàn tất trả ngăn tủ B2 tại Đại học Bách Khoa lúc 14:30 ngày 02/06/2026.',
    time: '14:30',
    dateGroup: 'Hôm qua',
    isRead: true,
  },
  {
    id: 'n5',
    title: 'Thông báo hệ thống',
    body: 'SmartBox cập nhật phiên bản mới 1.0.0 nhằm nâng cao trải nghiệm bảo mật và cải thiện tính năng mở tủ từ xa.',
    time: '10:00',
    dateGroup: 'Cũ hơn',
    isRead: true,
  },
];

export default function NotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const handleNotificationPress = (id: string) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
    // Find target notification
    const clickedNotif = notifications.find((n) => n.id === id);
    if (clickedNotif && clickedNotif.title.includes('tủ')) {
      // Mock navigation to rental detail if notification relates to a locker
      router.push('/rental-detail?id=r1');
    }
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  const filteredNotifications = notifications.filter(
    (n) => filter === 'all' || !n.isRead
  );

  // Group notifications by dateGroup
  const groups: Record<'Hôm nay' | 'Hôm qua' | 'Cũ hơn', NotificationItem[]> = {
    'Hôm nay': [],
    'Hôm qua': [],
    'Cũ hơn': [],
  };

  filteredNotifications.forEach((n) => {
    groups[n.dateGroup].push(n);
  });

  const hasUnread = notifications.some((n) => !n.isRead);

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#A1A1A0" />
        </Pressable>
        <ThemedText type="h3">Thông báo</ThemedText>
        
        {hasUnread ? (
          <Pressable style={styles.markReadBtn} onPress={markAllAsRead}>
            <ThemedText type="small" themeColor="brand">Đọc hết</ThemedText>
          </Pressable>
        ) : (
          <View style={{ width: 40 }} />
        )}
      </View>

      {/* Segmented Filter Control */}
      <View style={styles.filterContainer}>
        <View style={styles.segmentedControl}>
          <Pressable
            style={[styles.segmentBtn, filter === 'all' && styles.segmentBtnActive]}
            onPress={() => setFilter('all')}
          >
            <ThemedText
              type="smallBold"
              themeColor={filter === 'all' ? 'text' : 'textSecondary'}
            >
              Tất cả ({notifications.length})
            </ThemedText>
          </Pressable>
          <Pressable
            style={[styles.segmentBtn, filter === 'unread' && styles.segmentBtnActive]}
            onPress={() => setFilter('unread')}
          >
            <ThemedText
              type="smallBold"
              themeColor={filter === 'unread' ? 'text' : 'textSecondary'}
            >
              Chưa đọc ({notifications.filter((n) => !n.isRead).length})
            </ThemedText>
          </Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {filteredNotifications.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="notifications-off-outline" size={64} color="#6B6B6A" />
            <ThemedText type="h3" style={styles.emptyTitle}>Không có thông báo</ThemedText>
            <ThemedText type="caption" themeColor="textSecondary">
              Bạn hiện không có thông báo nào {filter === 'unread' ? 'chưa đọc' : ''}
            </ThemedText>
          </View>
        ) : (
          (Object.keys(groups) as (keyof typeof groups)[]).map((dateGroup) => {
            const list = groups[dateGroup];
            if (list.length === 0) return null;

            return (
              <View key={dateGroup} style={styles.groupContainer}>
                {/* Date header */}
                <View style={styles.groupHeader}>
                  <ThemedText type="smallBold" themeColor="textMuted">{dateGroup}</ThemedText>
                </View>

                {/* Notifications list */}
                {list.map((notif) => (
                  <Pressable
                    key={notif.id}
                    style={[
                      styles.notificationCard,
                      notif.isRead ? styles.cardRead : styles.cardUnread,
                    ]}
                    onPress={() => handleNotificationPress(notif.id)}
                  >
                    {!notif.isRead && <View style={styles.unreadBorder} />}
                    
                    <View style={styles.cardContent}>
                      <View style={styles.cardHeader}>
                        <ThemedText
                          type={notif.isRead ? 'body' : 'bodyBold'}
                          style={styles.notifTitle}
                          numberOfLines={1}
                        >
                          {notif.title}
                        </ThemedText>
                        <ThemedText type="small" themeColor="textMuted">
                          {notif.time}
                        </ThemedText>
                      </View>
                      
                      <ThemedText
                        type="caption"
                        themeColor="textSecondary"
                        style={styles.notifBody}
                        numberOfLines={2}
                      >
                        {notif.body}
                      </ThemedText>
                    </View>

                    {!notif.isRead && (
                      <View style={styles.unreadDot} />
                    )}
                  </Pressable>
                ))}
              </View>
            );
          })
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: '#1C1C1B',
    marginTop: 48,
  },
  backBtn: {
    padding: 4,
  },
  markReadBtn: {
    paddingHorizontal: 8,
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1C1C1B',
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#1C1C1B',
    borderRadius: 8,
    padding: 2,
    height: 38,
  },
  segmentBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
  },
  segmentBtnActive: {
    backgroundColor: '#FF6600',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 32,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    marginTop: 16,
    marginBottom: 6,
  },
  groupContainer: {
    width: '100%',
  },
  groupHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#0A0A0A',
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1C1C1B',
    position: 'relative',
  },
  cardUnread: {
    backgroundColor: '#1C1C1B',
  },
  cardRead: {
    backgroundColor: '#0A0A0A',
  },
  unreadBorder: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: '#FF6600',
  },
  cardContent: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  notifTitle: {
    flex: 1,
    marginRight: 8,
  },
  notifBody: {
    lineHeight: 18,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF6600',
    marginLeft: 12,
  },
});
