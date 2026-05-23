import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { STATUS_LABELS, STATUS_COLORS } from "@signalicity/shared";
import type { SignalementStatus } from "@signalicity/shared";

export default function StatusBadge({ status }: { status: SignalementStatus }) {
  const color = STATUS_COLORS[status] ?? "#6B7280";
  const label = STATUS_LABELS[status] ?? status;

  return (
    <View style={[styles.badge, { backgroundColor: `${color}20` }]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.text, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  text: {
    fontSize: 12,
    fontWeight: "600",
  },
});
