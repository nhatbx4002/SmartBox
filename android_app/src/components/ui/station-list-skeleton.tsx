import React from "react";
import { View, StyleSheet } from "react-native";
import { Skeleton } from "./skeleton";

export function StationListSkeleton() {
  return (
    <View style={styles.container}>
      {[1, 2, 3].map((i) => (
        <View key={i} style={styles.row}>
          <View style={{ flex: 1 }}>
            <Skeleton width="55%" height={14} borderRadius={4} />
            <View style={{ height: 6 }} />
            <Skeleton width="75%" height={10} borderRadius={4} />
            <View style={{ height: 8 }} />
            <View style={styles.subRow}>
              <Skeleton width={50} height={10} borderRadius={4} />
              <Skeleton width={90} height={10} borderRadius={4} />
            </View>
          </View>
          <Skeleton width={60} height={22} borderRadius={6} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    backgroundColor: "#0A0A0A",
    borderWidth: 1,
    borderColor: "#252525",
    borderRadius: 12,
    padding: 12,
  },
  subRow: {
    flexDirection: "row",
    gap: 12,
  },
});
