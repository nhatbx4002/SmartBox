import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type StationMarkerProps = {
    availableCount?: number;
    status?: "online" | "offline";
    selected?: boolean;
};

export default function StationMarker({
                                          availableCount = 0,
                                          status = "online",
                                          selected = false,
                                      }: StationMarkerProps) {
    const isOnline = status === "online";
    const color = selected ? "#2563EB" : isOnline ? "#FF6600" : "#6B6B6A";

    return (
        <View style={styles.wrapper}>
            <View style={[styles.pinBody, { backgroundColor: color }]}>
                <MaterialCommunityIcons name="locker" size={12} color="#FFFFFF" />

                {availableCount > 0 ? (
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>
                            {availableCount > 99 ? "99+" : availableCount}
                        </Text>
                    </View>
                ) : null}
            </View>

            <View style={[styles.pinTip, { backgroundColor: color }]} />
            <View style={styles.shadow} />
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        width: 40,
        height: 50,
        alignItems: "center",
        overflow: "visible",
    },

    pinBody: {
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 2,
        borderColor: "#FFFFFF",
        zIndex: 2,
        elevation: 4,
    },

    pinTip: {
        width: 12,
        height: 12,
        marginTop: -8,
        transform: [{ rotate: "45deg" }],
        borderRightWidth: 2,
        borderBottomWidth: 2,
        borderColor: "#FFFFFF",
        zIndex: 1,
    },

    badge: {
        position: "absolute",
        top: -5,
        right: -6,
        minWidth: 14,
        height: 14,
        paddingHorizontal: 3,
        borderRadius: 7,
        backgroundColor: "#111111",
        borderWidth: 1,
        borderColor: "#FFFFFF",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 5,
        elevation: 5,
    },

    badgeText: {
        color: "#FFFFFF",
        fontSize: 7,
        fontWeight: "800",
    },

    shadow: {
        marginTop: 2,
        width: 18,
        height: 5,
        borderRadius: 9,
        backgroundColor: "rgba(0,0,0,0.35)",
    },
});