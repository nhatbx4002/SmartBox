import React from "react";
import { View, Text, StyleSheet } from "react-native";
import QRCode from "react-native-qrcode-svg";

interface QrCodeDisplayProps {
  value: string;
  code: string;
  size?: number;
  label?: string;
}

export default function QrCodeDisplay({ value, code, size = 200, label = "Quét QR để mở tủ" }: QrCodeDisplayProps) {
  return (
    <View className="items-center">
      <View style={styles.qrWrapper}>
        <QRCode
          value={value}
          size={size}
          backgroundColor="#FFFFFF"
          color="#000000"
        />
      </View>
      <Text className="text-small text-text-secondary mt-three">{label}</Text>
      <Text className="text-small-bold text-white mt-one font-mono">{code}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  qrWrapper: {
    padding: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
  },
});
