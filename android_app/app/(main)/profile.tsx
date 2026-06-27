import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, Platform, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import Button from "../../src/components/ui/button";
import Input from "../../src/components/ui/input";
import { useAuthStore } from "../../src/store/authStore";

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const updateProfile = useAuthStore((state) => state.updateProfile);

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [profileLoading, setProfileLoading] = useState(false);



  const handleLogout = async () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    await logout();
    router.replace("/login");
  };

  const handleSaveProfile = async () => {
    setProfileLoading(true);
    try {
      await updateProfile(name.trim() || undefined, email.trim() || undefined);
      Alert.alert("Thành công", "Đã cập nhật hồ sơ.");
    } catch (err: any) {
      Alert.alert("Lỗi", err.message || "Không thể cập nhật hồ sơ.");
    } finally {
      setProfileLoading(false);
    }
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
        <Text className="text-h3 text-white font-bold ml-three">Tài khoản</Text>
      </View>

      <ScrollView
        className="flex-1 px-four"
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar card */}
        <View className="items-center bg-surface border border-border rounded-panel p-five my-four">
          <View className="w-20 h-20 rounded-full bg-brand-glow border-2 border-brand items-center justify-center mb-three">
            <Text className="text-h1 text-brand font-bold">
              {(user?.name || user?.phone || "U").slice(0, 1).toUpperCase()}
            </Text>
          </View>
          <Text className="text-h3 text-white font-bold">{user?.name || "Chưa cập nhật tên"}</Text>
          <Text className="text-body text-text-secondary mt-half">{user?.phone || "--"}</Text>
          <Text className="text-caption text-text-muted mt-half">{user?.email || "Chưa cập nhật email"}</Text>
        </View>

        {/* Edit profile */}
        <View className="bg-surface border border-border rounded-panel p-four mb-four">
          <View className="flex-row items-center gap-two mb-four">
            <Ionicons name="person-outline" size={18} color="#FF6600" />
            <Text className="text-body-bold text-white">Chỉnh sửa hồ sơ</Text>
          </View>
          <View className="gap-three">
            <Input
              label="Họ tên"
              leftIcon="person-outline"
              value={name}
              onChangeText={setName}
              placeholder="Nhập họ tên"
            />
            <Input
              label="Email"
              leftIcon="mail-outline"
              value={email}
              onChangeText={setEmail}
              placeholder="Nhập email"
              keyboardType="email-address"
            />
            <Button title="Lưu thay đổi" onPress={handleSaveProfile} loading={profileLoading} />
          </View>
        </View>

        {/* Other settings */}
        <View className="bg-surface border border-border rounded-panel overflow-hidden mb-five">
          <Pressable
            onPress={() => router.push("/change-password" as any)}
            className="flex-row items-center justify-between px-four py-four border-b border-border/40"
          >
            <View className="flex-row items-center gap-three">
              <Ionicons name="lock-closed-outline" size={20} color="#FF6600" />
              <Text className="text-body text-white">Đổi mật khẩu</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color="#A1A1A0" />
          </Pressable>

          <Pressable
            onPress={() => router.push("/notifications")}
            className="flex-row items-center justify-between px-four py-four border-b border-border/40"
          >
            <View className="flex-row items-center gap-three">
              <Ionicons name="notifications-outline" size={20} color="#FF6600" />
              <Text className="text-body text-white">Thông báo</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color="#A1A1A0" />
          </Pressable>

          <View className="flex-row items-center justify-between px-four py-four">
            <View className="flex-row items-center gap-three">
              <Ionicons name="shield-checkmark-outline" size={20} color="#FF6600" />
              <Text className="text-body text-white">Trạng thái tài khoản</Text>
            </View>
            <Text className="text-small-bold text-success">{user?.status || "--"}</Text>
          </View>
        </View>

        <View className="mb-six">
          <Button title="Đăng xuất" variant="danger" onPress={handleLogout} />
        </View>
      </ScrollView>
    </View>
  );
}
