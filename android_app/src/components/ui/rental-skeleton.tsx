import React from "react";
import { View, StyleSheet } from "react-native";
import { Skeleton, SkeletonLine } from "./skeleton";

export function RentalDetailSkeleton() {
  return (
    <View style={styles.container}>
      {/* Main card — matches rental/[id].tsx card layout */}
      <View style={styles.card}>
        {/* Status badge placeholder */}
        <View style={styles.badgeRow}>
          <Skeleton width={80} height={22} borderRadius={6} />
        </View>

        {/* Location name */}
        <SkeletonLine width="60%" height={22} />
        <View style={{ height: 8 }} />
        <SkeletonLine width="35%" height={14} />

        {/* Access code label + code */}
        <View style={{ height: 20 }} />
        <SkeletonLine width="25%" height={12} />
        <View style={{ height: 8 }} />
        <Skeleton width="50%" height={56} borderRadius={8} />

        {/* Countdown */}
        <View style={{ height: 8 }} />
        <SkeletonLine width="40%" height={12} />
      </View>

      {/* Info card */}
      <View style={styles.card}>
        {/* Row 1 */}
        <View style={styles.row}>
          <SkeletonLine width="30%" height={12} />
          <SkeletonLine width="20%" height={12} />
        </View>
        {/* Row 2 */}
        <View style={styles.row}>
          <SkeletonLine width="30%" height={12} />
          <SkeletonLine width="25%" height={12} />
        </View>
        {/* Row 3 */}
        <View style={styles.row}>
          <SkeletonLine width="30%" height={12} />
          <SkeletonLine width="40%" height={12} />
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.buttons}>
        <Skeleton width="100%" height={48} borderRadius={8} />
        <View style={{ height: 12 }} />
        <Skeleton width="100%" height={48} borderRadius={8} />
      </View>

      {/* History card */}
      <View style={styles.card}>
        <SkeletonLine width="40%" height={14} />
        <View style={{ height: 16 }} />
        {[1, 2, 3].map((i) => (
          <View key={i} style={styles.historyRow}>
            <View style={styles.dot} />
            <View style={{ flex: 1 }}>
              <SkeletonLine width="50%" height={12} />
              <View style={{ height: 6 }} />
              <SkeletonLine width="30%" height={10} />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 16,
  },
  card: {
    backgroundColor: "#1C1C1B",
    borderWidth: 1,
    borderColor: "#252525",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  badgeRow: {
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  buttons: {
    marginBottom: 4,
  },
  historyRow: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "flex-start",
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#2A2A29",
    marginRight: 12,
    marginTop: 2,
  },
});
