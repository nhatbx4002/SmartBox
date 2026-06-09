import React from "react";
import { View, StyleSheet } from "react-native";
import { Skeleton } from "./skeleton";

export function HomeSkeleton() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Skeleton width={100} height={10} borderRadius={4} />
          <View style={{ height: 8 }} />
          <Skeleton width="70%" height={28} borderRadius={6} />
        </View>
        <View style={styles.avatarRow}>
          <Skeleton width={40} height={40} borderRadius={20} />
          <Skeleton width={40} height={40} borderRadius={20} />
        </View>
      </View>

      {/* Map + station list card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Skeleton width={120} height={14} borderRadius={4} />
          <Skeleton width={60} height={12} borderRadius={4} />
        </View>
        <Skeleton width="100%" height={200} borderRadius={8} style={{ marginBottom: 16 }} />
        <View style={{ gap: 12 }}>
          {[1, 2, 3].map((i) => (
            <View key={i} style={styles.stationRow}>
              <View style={{ flex: 1 }}>
                <Skeleton width="60%" height={14} borderRadius={4} />
                <View style={{ height: 6 }} />
                <Skeleton width="80%" height={10} borderRadius={4} />
              </View>
              <Skeleton width={60} height={22} borderRadius={6} />
            </View>
          ))}
        </View>
      </View>

      {/* Active rentals card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Skeleton width={120} height={14} borderRadius={4} />
          <Skeleton width={60} height={12} borderRadius={4} />
        </View>
        <Skeleton width="100%" height={60} borderRadius={8} />
      </View>

      {/* FAQ card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Skeleton width={100} height={14} borderRadius={4} />
          <Skeleton width={60} height={12} borderRadius={4} />
        </View>
        {[1, 2, 3].map((i) => (
          <View key={i} style={styles.faqRow}>
            <Skeleton width="85%" height={12} borderRadius={4} />
            <Skeleton width={18} height={18} borderRadius={4} />
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
    gap: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  avatarRow: {
    flexDirection: "row",
    gap: 8,
  },
  card: {
    backgroundColor: "#1C1C1B",
    borderWidth: 1,
    borderColor: "#252525",
    borderRadius: 12,
    padding: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  stationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  faqRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(37, 37, 37, 0.5)",
  },
});
