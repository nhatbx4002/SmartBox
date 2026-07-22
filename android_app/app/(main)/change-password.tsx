import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Button from "../../src/components/ui/button";
import Input from "../../src/components/ui/input";
import { useAuthStore } from "../../src/store/authStore";

export default function ChangePasswordScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const updateProfile = useAuthStore((state) => state.updateProfile);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    if (newPassword.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }
    setLoading(true);
    try {
      await updateProfile(undefined, undefined, newPassword);
      Alert.alert("Thành công", "Đã đổi mật khẩu.", [{ text: "OK", onPress: () => router.back() }]);
    } catch (err: any) {
      setError(err.message || "Không thể đổi mật khẩu.");
    } finally {
      setLoading(false);
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
        <Text className="text-h3 text-white font-bold ml-three">Đổi mật khẩu</Text>
      </View>

      <ScrollView
        className="flex-1 px-four"
        contentContainerStyle={{ paddingTop: 24, paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className="bg-surface border border-border rounded-panel p-four gap-three">
          <Input
            label="Mật khẩu mới"
            leftIcon="lock-closed-outline"
            value={newPassword}
            onChangeText={(v) => { setNewPassword(v); setError(""); }}
            placeholder="Ít nhất 6 ký tự"
            secureTextEntry
          />
          <Input
            label="Xác nhận mật khẩu"
            leftIcon="lock-closed-outline"
            value={confirmPassword}
            onChangeText={(v) => { setConfirmPassword(v); setError(""); }}
            placeholder="Nhập lại mật khẩu mới"
            secureTextEntry
            error={error}
          />
          <Button title="Đổi mật khẩu" onPress={handleSubmit} loading={loading} />
        </View>
      </ScrollView>
    </View>
  );
}
