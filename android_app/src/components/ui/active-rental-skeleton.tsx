import React from "react";
import { View, StyleSheet } from "react-native";
import { Skeleton } from "./skeleton";

export function ActiveRentalSkeleton() {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Skeleton width="60%" height={14} borderRadius={4} />
          <View style={{ height: 6 }} />
          <Skeleton width="35%" height={12} borderRadius={4} />
        </View>
        <Skeleton width={50} height={22} borderRadius={6} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#0A0A0A",
    borderWidth: 1,
    borderColor: "#252525",
    borderRadius: 12,
    padding: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
});
