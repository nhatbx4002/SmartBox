import React from "react";
import { View, StyleSheet } from "react-native";
import { Skeleton } from "./skeleton";

export function RentalListSkeleton() {
  return (
    <View style={styles.container}>
      {[1, 2, 3].map((i) => (
        <View key={i} style={styles.card}>
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Skeleton width="70%" height={14} borderRadius={4} />
            </View>
            <Skeleton width={60} height={22} borderRadius={6} />
          </View>
          <Skeleton width="50%" height={12} borderRadius={4} />
          <Skeleton width="40%" height={12} borderRadius={4} />
          <View style={styles.row}>
            <Skeleton width="30%" height={10} borderRadius={4} />
            <Skeleton width="20%" height={12} borderRadius={4} />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  card: {
    backgroundColor: "#1C1C1B",
    borderWidth: 1,
    borderColor: "#252525",
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
