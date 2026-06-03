import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Pressable,
  ScrollView,
  Modal,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Mock data for locker locations
const MOCK_LOCATIONS = [
  { id: '1', name: 'Đại học Bách Khoa - A1', address: '268 Lý Thường Kiệt, Quận 10', distance: '0.4 km', available: 12, total: 24, coords: { x: 120, y: 180 } },
  { id: '2', name: 'Ký túc xá Bách Khoa', address: '497 Hòa Hảo, Quận 10', distance: '1.2 km', available: 8, total: 16, coords: { x: 280, y: 220 } },
  { id: '3', name: 'SmartBox Zone 3', address: 'Thành Thái, Quận 10', distance: '2.5 km', available: 3, total: 8, coords: { x: 160, y: 340 } },
  { id: '4', name: 'BK Tech Park', address: 'Đường D1, TP. Thủ Đức', distance: '12.0 km', available: 0, total: 12, coords: { x: 300, y: 100 } },
];

// Mock data for active and past rentals
const MOCK_RENTALS = [
  { id: 'r1', cabinetName: 'A1', locationName: 'Đại học Bách Khoa', status: 'active', code: '123456', expiresAt: '2026-06-04T10:00:00Z', openCount: 1, maxOpens: 2, durationStr: 'Còn 2h 30p' },
  { id: 'r2', cabinetName: 'B2', locationName: 'Đại học Bách Khoa', status: 'completed', code: '654321', expiresAt: '2026-06-02T14:30:00Z', openCount: 2, maxOpens: 2, durationStr: 'Trả lúc 14:30 • 02/06' },
  { id: 'r3', cabinetName: 'A3', locationName: 'Ký túc xá Bách Khoa', status: 'expired', code: '987654', expiresAt: '2026-06-01T10:00:00Z', openCount: 0, maxOpens: 2, durationStr: 'Hết hạn 10:00 • 01/06' },
];

// Snap points for the Bottom Sheet: Collapsed (88), Half (360), Full (Full Height)
const snapPoints = [88, 360, SCREEN_HEIGHT - 120];

export default function HomeScreen() {
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [bottomSheetSnapIndex, setBottomSheetSnapIndex] = useState(0); // 0 = Collapsed, 1 = Half, 2 = Full
  const [bottomSheetTab, setBottomSheetTab] = useState<'rentals' | 'locations'>('rentals');

  // Modals visibility state
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [fabModalVisible, setFabModalVisible] = useState(false);
  const [notificationEnabled, setNotificationEnabled] = useState(true);

  // Manual PIN verification state inside FAB quick action
  const [manualPin, setManualPin] = useState('');
  const [pinError, setPinError] = useState('');

  // Auto close location tooltip if clicking on map background
  const handleMapPress = () => {
    setSelectedLocation(null);
  };

  const handleMarkerPress = (loc: any, e: any) => {
    e.stopPropagation();
    setSelectedLocation(loc);
    setBottomSheetSnapIndex(0); // Collapse bottom sheet to see map card clearly
  };

  const handleVerifyManualPin = () => {
    if (!manualPin) {
      setPinError('Vui lòng nhập mã pin');
      return;
    }
    if (manualPin.replace(/\s/g, '').length !== 6) {
      setPinError('Mã pin gồm 6 chữ số');
      return;
    }
    setPinError('');
    setFabModalVisible(false);
    // Directly navigate to rental-detail r1 for mockup
    router.push('/rental-detail?id=r1');
    setManualPin('');
  };

  return (
    <ThemedView style={styles.container}>
      
      {/* 1. Immersive Interactive Mock Dark Map */}
      <Pressable style={styles.mapContainer} onPress={handleMapPress}>
        {/* Mock Map Background Grid and Parks */}
        <View style={styles.mockMapBg}>
          {/* Roads */}
          <View style={[styles.road, { top: 150, left: 0, width: SCREEN_WIDTH, height: 28, transform: [{ rotate: '-10deg' }] }]} />
          <View style={[styles.road, { top: 280, left: 0, width: SCREEN_WIDTH, height: 32, transform: [{ rotate: '5deg' }] }]} />
          <View style={[styles.road, { top: 0, left: 180, width: 36, height: SCREEN_HEIGHT }]} />
          
          {/* Park Green Areas */}
          <View style={styles.parkArea} />
          <View style={[styles.parkArea, { top: 400, left: 30, width: 140, height: 100, borderRadius: 12, backgroundColor: '#0B2214' }]} />

          {/* User Current Location Pulse Dot */}
          <View style={[styles.userPulseRing, { top: 240, left: 160 }]}>
            <View style={styles.userPulseInner} />
          </View>

          {/* Interactive Markers */}
          {MOCK_LOCATIONS.map((loc) => {
            const isSelected = selectedLocation?.id === loc.id;
            return (
              <Pressable
                key={loc.id}
                style={[
                  styles.markerWrapper,
                  { top: loc.coords.y, left: loc.coords.x }
                ]}
                onPress={(e) => handleMarkerPress(loc, e)}
              >
                <View style={[
                  styles.markerPin,
                  { backgroundColor: isSelected ? '#FFFFFF' : '#FF6600' }
                ]}>
                  <Ionicons name="cube" size={16} color={isSelected ? '#FF6600' : '#FFFFFF'} />
                  {loc.available > 0 && (
                    <View style={styles.markerBadge}>
                      <ThemedText style={styles.markerBadgeText}>{loc.available}</ThemedText>
                    </View>
                  )}
                </View>
                <View style={[styles.markerTriangle, { borderTopColor: isSelected ? '#FFFFFF' : '#FF6600' }]} />
              </Pressable>
            );
          })}
        </View>
      </Pressable>

      {/* 2. Top Header Overlays */}
      <View style={styles.topHeader}>
        <View style={styles.logoWrapper}>
          <Ionicons name="cube" size={24} color="#FF6600" style={styles.logoIcon} />
          <ThemedText type="h3" style={styles.logoText}>SmartBox</ThemedText>
        </View>
        <View style={styles.headerActions}>
          {/* Notifications Button */}
          <Pressable style={styles.iconButton} onPress={() => router.push('/notifications')}>
            <Ionicons name="notifications-outline" size={24} color="#FFFFFF" />
            <View style={styles.unreadBadge}>
              <ThemedText style={styles.unreadText}>3</ThemedText>
            </View>
          </Pressable>

          {/* Profile Avatar Button */}
          <Pressable style={styles.avatarButton} onPress={() => setProfileModalVisible(true)}>
            <View style={styles.avatarInner}>
              <Ionicons name="person" size={18} color="#A1A1A0" />
            </View>
          </Pressable>
        </View>
      </View>

      {/* 3. Tapped Marker Tooltip Info Card (above bottom sheet) */}
      {selectedLocation && (
        <View style={[styles.locationCard, { bottom: snapPoints[bottomSheetSnapIndex] + 20 }]}>
          <View style={styles.locationCardHeader}>
            <ThemedText type="bodyBold">{selectedLocation.name}</ThemedText>
            <Pressable onPress={() => setSelectedLocation(null)}>
              <Ionicons name="close" size={20} color="#6B6B6A" />
            </Pressable>
          </View>
          <ThemedText type="caption" themeColor="textSecondary" style={styles.locationCardAddress}>
            {selectedLocation.address}
          </ThemedText>
          <View style={styles.locationStatsRow}>
            <ThemedText type="small" themeColor={selectedLocation.available > 0 ? 'success' : 'error'}>
              ● {selectedLocation.available > 0 ? `${selectedLocation.available} tủ trống` : 'Hết tủ trống'}
            </ThemedText>
            <ThemedText type="small" themeColor="textMuted">
              Khoảng cách: {selectedLocation.distance}
            </ThemedText>
          </View>
          <Button
            title="THUÊ TỦ TẠI ĐÂY"
            variant="primary"
            size="md"
            onPress={() => {
              setSelectedLocation(null);
              router.push(`/rent?locationId=${selectedLocation.id}`);
            }}
            style={styles.cardBtn}
          />
        </View>
      )}

      {/* 4. Floating Action Button (FAB) for scanning QR / input code */}
      <Pressable
        style={[
          styles.fab,
          { bottom: snapPoints[bottomSheetSnapIndex] + 16 }
        ]}
        onPress={() => setFabModalVisible(true)}
      >
        <Ionicons name="qr-code-outline" size={24} color="#FFFFFF" />
      </Pressable>

      {/* 5. Draggable Bottom Sheet */}
      <BottomSheet
        snapPoints={snapPoints}
        activeSnapIndex={bottomSheetSnapIndex}
        onChangeSnap={(index) => setBottomSheetSnapIndex(index)}
      >
        {/* Custom Segmented Control Tab Header */}
        <View style={styles.tabHeader}>
          <Pressable
            style={[styles.tabButton, bottomSheetTab === 'rentals' && styles.tabButtonActive]}
            onPress={() => setBottomSheetTab('rentals')}
          >
            <ThemedText
              type="bodyBold"
              themeColor={bottomSheetTab === 'rentals' ? 'text' : 'textMuted'}
            >
              Tủ của tôi ({MOCK_RENTALS.filter((r) => r.status === 'active').length})
            </ThemedText>
          </Pressable>
          <Pressable
            style={[styles.tabButton, bottomSheetTab === 'locations' && styles.tabButtonActive]}
            onPress={() => setBottomSheetTab('locations')}
          >
            <ThemedText
              type="bodyBold"
              themeColor={bottomSheetTab === 'locations' ? 'text' : 'textMuted'}
            >
              Vị trí tủ
            </ThemedText>
          </Pressable>
        </View>

        {/* Tab Content Panels */}
        <ScrollView style={styles.sheetScroll} contentContainerStyle={styles.sheetScrollContent}>
          {bottomSheetTab === 'rentals' ? (
            // rentals tab
            <View style={styles.tabContent}>
              {MOCK_RENTALS.map((rental) => {
                const isActive = rental.status === 'active';
                const isExpired = rental.status === 'expired';
                
                let statusLabel = 'Đang thuê';
                let statusType: 'active' | 'completed' | 'expired' = 'active';
                
                if (rental.status === 'completed') {
                  statusLabel = 'Hoàn thành';
                  statusType = 'completed';
                } else if (isExpired) {
                  statusLabel = 'Đã hết hạn';
                  statusType = 'expired';
                }

                return (
                  <Pressable
                    key={rental.id}
                    style={[
                      styles.rentalCard,
                      {
                        borderLeftColor:
                          statusType === 'active'
                            ? '#00C853'
                            : statusType === 'expired'
                            ? '#FF3D00'
                            : '#6B6B6A',
                      },
                    ]}
                    onPress={() => router.push(`/rental-detail?id=${rental.id}`)}
                  >
                    <View style={styles.rentalCardHeader}>
                      <View>
                        <ThemedText type="bodyBold">Tủ {rental.cabinetName}</ThemedText>
                        <ThemedText type="caption" themeColor="textSecondary">
                          {rental.locationName}
                        </ThemedText>
                      </View>
                      <Badge label={statusLabel} status={statusType} />
                    </View>

                    <View style={styles.rentalCardBody}>
                      <ThemedText type="small" themeColor="textSecondary">
                        ⏳ {rental.durationStr}
                      </ThemedText>
                      {isActive && (
                        <ThemedText type="small" themeColor="textSecondary">
                          🔓 Đã mở: {rental.openCount}/{rental.maxOpens} lần
                        </ThemedText>
                      )}
                    </View>

                    {isActive && (
                      <View style={styles.rentalCardActions}>
                        <Button
                          title="Hiện QR"
                          variant="secondary"
                          size="sm"
                          onPress={(e) => {
                            e.stopPropagation();
                            router.push(`/rental-detail?id=${rental.id}&showQR=true`);
                          }}
                          style={styles.cardActionBtn}
                          fullWidth={false}
                        />
                        <Button
                          title="Mở tủ"
                          variant="primary"
                          size="sm"
                          onPress={(e) => {
                            e.stopPropagation();
                            router.push(`/rental-detail?id=${rental.id}&unlock=true`);
                          }}
                          style={styles.cardActionBtn}
                          fullWidth={false}
                        />
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </View>
          ) : (
            // locations list tab
            <View style={styles.tabContent}>
              {MOCK_LOCATIONS.map((loc) => (
                <Pressable
                  key={loc.id}
                  style={styles.locationListItem}
                  onPress={() => router.push(`/rent?locationId=${loc.id}`)}
                >
                  <View style={styles.locItemMain}>
                    <View style={styles.locItemHeader}>
                      <ThemedText type="bodyBold">{loc.name}</ThemedText>
                      <ThemedText type="caption" themeColor="brand" style={styles.locItemDistance}>
                        {loc.distance}
                      </ThemedText>
                    </View>
                    <ThemedText type="caption" themeColor="textSecondary" numberOfLines={1}>
                      {loc.address}
                    </ThemedText>
                    <View style={styles.locItemFooter}>
                      <ThemedText type="small" themeColor={loc.available > 0 ? 'success' : 'error'}>
                        ● {loc.available > 0 ? `${loc.available} tủ trống` : 'Hết tủ trống'}
                      </ThemedText>
                      <ThemedText type="small" themeColor="textMuted">
                        Tổng số: {loc.total} ngăn
                      </ThemedText>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#A1A1A0" style={styles.locItemArrow} />
                </Pressable>
              ))}
            </View>
          )}
        </ScrollView>
      </BottomSheet>

      {/* 6. Profile Settings Overlay Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={profileModalVisible}
        onRequestClose={() => setProfileModalVisible(false)}
      >
        <ThemedView style={styles.profileContainer}>
          {/* Header */}
          <View style={styles.profileHeader}>
            <Pressable style={styles.profileCloseBtn} onPress={() => setProfileModalVisible(false)}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </Pressable>
            <ThemedText type="h2">Cài đặt tài khoản</ThemedText>
            <View style={{ width: 40 }} />
          </View>

          {/* User Profile Card */}
          <View style={styles.profileCard}>
            <View style={styles.profileAvatarLarge}>
              <Ionicons name="person" size={36} color="#A1A1A0" />
            </View>
            <ThemedText type="h3">Nguyễn Văn A</ThemedText>
            <ThemedText type="caption" themeColor="textSecondary" style={styles.profileSubtitleText}>
              +84 912 345 678
            </ThemedText>
            <ThemedText type="caption" themeColor="textMuted">
              nguyenvana@gmail.com
            </ThemedText>
          </View>

          {/* Settings Menu List */}
          <ScrollView style={styles.profileMenu} contentContainerStyle={styles.profileMenuContent}>
            <Pressable style={styles.menuItem}>
              <Ionicons name="person-outline" size={22} color="#A1A1A0" style={styles.menuIcon} />
              <ThemedText style={styles.menuLabel}>Chỉnh sửa profile</ThemedText>
              <Ionicons name="chevron-forward" size={18} color="#6B6B6A" />
            </Pressable>

            <View style={styles.menuItem}>
              <Ionicons name="notifications-outline" size={22} color="#A1A1A0" style={styles.menuIcon} />
              <ThemedText style={styles.menuLabel}>Thông báo đẩy</ThemedText>
              <Switch
                value={notificationEnabled}
                onValueChange={setNotificationEnabled}
                trackColor={{ false: '#333332', true: '#FF6600' }}
                thumbColor="#FFFFFF"
              />
            </View>

            <Pressable style={styles.menuItem}>
              <Ionicons name="lock-closed-outline" size={22} color="#A1A1A0" style={styles.menuIcon} />
              <ThemedText style={styles.menuLabel}>Đổi mật khẩu</ThemedText>
              <Ionicons name="chevron-forward" size={18} color="#6B6B6A" />
            </Pressable>

            <Pressable style={styles.menuItem}>
              <Ionicons name="help-circle-outline" size={22} color="#A1A1A0" style={styles.menuIcon} />
              <ThemedText style={styles.menuLabel}>Trợ giúp & Hỗ trợ</ThemedText>
              <Ionicons name="chevron-forward" size={18} color="#6B6B6A" />
            </Pressable>

            <Pressable style={styles.menuItem}>
              <Ionicons name="document-text-outline" size={22} color="#A1A1A0" style={styles.menuIcon} />
              <ThemedText style={styles.menuLabel}>Điều khoản dịch vụ</ThemedText>
              <Ionicons name="chevron-forward" size={18} color="#6B6B6A" />
            </Pressable>

            <View style={[styles.menuItem, { borderBottomWidth: 0 }]}>
              <Ionicons name="information-circle-outline" size={22} color="#A1A1A0" style={styles.menuIcon} />
              <ThemedText style={styles.menuLabel}>Về ứng dụng</ThemedText>
              <ThemedText type="small" themeColor="textMuted">Phiên bản 1.0.0</ThemedText>
            </View>

            <Button
              title="ĐĂNG XUẤT"
              variant="danger"
              size="md"
              onPress={() => {
                setProfileModalVisible(false);
                router.replace('/login');
              }}
              style={styles.logoutBtn}
            />
          </ScrollView>
        </ThemedView>
      </Modal>

      {/* 7. FAB Quick Action Modal (QR Scan / OTP Input) */}
      <Modal
        animationType="slide"
        transparent
        visible={fabModalVisible}
        onRequestClose={() => setFabModalVisible(false)}
      >
        <View style={styles.fabModalBackdrop}>
          <View style={styles.fabModalContent}>
            {/* Modal Drag Header */}
            <View style={styles.fabModalHeader}>
              <ThemedText type="h3">Hành động nhanh</ThemedText>
              <Pressable style={styles.fabCloseIcon} onPress={() => setFabModalVisible(false)}>
                <Ionicons name="close" size={24} color="#A1A1A0" />
              </Pressable>
            </View>

            {/* Mock Camera QR Scanner Layout */}
            <View style={styles.qrMockScanner}>
              <View style={styles.scannerOutline}>
                <View style={styles.scannerCornerTL} />
                <View style={styles.scannerCornerTR} />
                <View style={styles.scannerCornerBL} />
                <View style={styles.scannerCornerBR} />
              </View>
              <ThemedText type="small" themeColor="textSecondary" style={styles.scannerHint}>
                Căn chỉnh mã QR trên màn hình tủ vào khung hình để quét
              </ThemedText>
            </View>

            {/* Separator line */}
            <View style={styles.separatorContainer}>
              <View style={styles.separatorLine} />
              <ThemedText type="small" themeColor="textMuted" style={styles.separatorText}>Hoặc nhập mã PIN</ThemedText>
              <View style={styles.separatorLine} />
            </View>

            {/* Manual Pin input */}
            <Input
              placeholder="Nhập mã OTP 6 chữ số"
              value={manualPin}
              onChangeText={(val) => {
                setManualPin(val.replace(/\D/g, ''));
                setPinError('');
              }}
              keyboardType="numeric"
              maxLength={6}
              iconName="key-outline"
              error={pinError}
            />

            <Button
              title="XÁC NHẬN MÃ"
              variant="primary"
              size="md"
              onPress={handleVerifyManualPin}
              disabled={manualPin.length !== 6}
            />
          </View>
        </View>
      </Modal>

    </ThemedView>
  );
}

// Snap points for the Bottom Sheet: Collapsed (80), Half (380), Full (720)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  mockMapBg: {
    flex: 1,
    backgroundColor: '#0A0A0A',
    position: 'relative',
  },
  road: {
    position: 'absolute',
    backgroundColor: '#1E1E1E',
  },
  parkArea: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 80,
    height: 70,
    borderRadius: 8,
    backgroundColor: '#0F2519',
  },
  userPulseRing: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(33, 150, 243, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userPulseInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2196F3',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  markerWrapper: {
    position: 'absolute',
    alignItems: 'center',
  },
  markerPin: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  markerTriangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginTop: -2,
  },
  markerBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#00C853',
    borderRadius: 8,
    width: 14,
    height: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  markerBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  topHeader: {
    position: 'absolute',
    top: 48,
    left: 16,
    right: 16,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  logoWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(28, 28, 27, 0.85)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333332',
  },
  logoIcon: {
    marginRight: 6,
  },
  logoText: {
    fontSize: 16,
    fontWeight: '700',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: 'rgba(28, 28, 27, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#333332',
  },
  unreadBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FF3D00',
    width: 14,
    height: 14,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
  avatarButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: 'rgba(28, 28, 27, 0.85)',
    padding: 2,
    borderWidth: 1,
    borderColor: '#333332',
  },
  avatarInner: {
    flex: 1,
    backgroundColor: '#2A2A29',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationCard: {
    position: 'absolute',
    left: 16,
    right: 16,
    backgroundColor: '#1C1C1B',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#333332',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    zIndex: 90,
  },
  locationCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationCardAddress: {
    marginBottom: 12,
  },
  locationStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cardBtn: {
    marginTop: 4,
  },
  fab: {
    position: 'absolute',
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FF6600',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
    zIndex: 90,
  },
  tabHeader: {
    flexDirection: 'row',
    marginHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333332',
    height: 48,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 4,
  },
  tabButtonActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#FF6600',
  },
  sheetScroll: {
    flex: 1,
  },
  sheetScrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 240, // Space to scroll past sheet contents
  },
  tabContent: {
    width: '100%',
  },
  rentalCard: {
    backgroundColor: '#1C1C1B',
    borderRadius: 12,
    borderLeftWidth: 4,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333332',
  },
  rentalCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  rentalCardBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  rentalCardActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cardActionBtn: {
    flex: 1,
  },
  locationListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1B',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333332',
  },
  locItemMain: {
    flex: 1,
  },
  locItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  locItemDistance: {
    fontSize: 12,
    fontWeight: '600',
  },
  locItemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  locItemArrow: {
    marginLeft: 12,
  },
  profileContainer: {
    flex: 1,
    backgroundColor: '#0A0A0A',
    paddingTop: 48,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: '#333332',
  },
  profileCloseBtn: {
    padding: 4,
  },
  profileCard: {
    alignItems: 'center',
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#333332',
  },
  profileAvatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1C1C1B',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333332',
  },
  profileSubtitleText: {
    marginVertical: 4,
  },
  profileMenu: {
    flex: 1,
  },
  profileMenuContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 48,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: '#1C1C1B',
  },
  menuIcon: {
    marginRight: 16,
  },
  menuLabel: {
    flex: 1,
  },
  logoutBtn: {
    marginTop: 32,
  },
  fabModalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  fabModalContent: {
    backgroundColor: '#1C1C1B',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
    borderWidth: 1,
    borderColor: '#333332',
  },
  fabModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  fabCloseIcon: {
    padding: 4,
  },
  qrMockScanner: {
    width: '100%',
    height: 200,
    backgroundColor: '#0A0A0A',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 20,
  },
  scannerOutline: {
    width: 140,
    height: 140,
    position: 'relative',
  },
  scannerCornerTL: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 20,
    height: 20,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#FF6600',
  },
  scannerCornerTR: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 20,
    height: 20,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: '#FF6600',
  },
  scannerCornerBL: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 20,
    height: 20,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#FF6600',
  },
  scannerCornerBR: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: '#FF6600',
  },
  scannerHint: {
    position: 'absolute',
    bottom: 12,
    fontSize: 11,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#333332',
  },
  separatorText: {
    marginHorizontal: 12,
  },
});
