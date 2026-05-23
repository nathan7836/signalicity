import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import type { Signalement } from "@signalicity/shared";
import StatusBadge from "./StatusBadge";
import { colors } from "../theme/colors";
import { radius } from "../theme/spacing";

function timeAgo(date: string): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  return `${Math.floor(seconds / 86400)}j`;
}

export default function SignalementCard({
  signalement,
}: {
  signalement: Signalement;
}) {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => router.push(`/signalement/${signalement.id}`)}
      activeOpacity={0.7}
      style={styles.card}
    >
      <Image source={{ uri: signalement.photo_url }} style={styles.photo} />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {signalement.title}
        </Text>
        {signalement.address && (
          <View style={styles.row}>
            <Ionicons
              name="location-outline"
              size={12}
              color={colors.textTertiary}
            />
            <Text style={styles.subtitle} numberOfLines={1}>
              {signalement.address}
            </Text>
          </View>
        )}
        <View style={styles.footer}>
          <StatusBadge status={signalement.status} />
          <Text style={styles.time}>{timeAgo(signalement.created_at)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    overflow: "hidden",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  photo: {
    width: "100%",
    height: 160,
    backgroundColor: colors.gray[100],
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 6,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textTertiary,
    flex: 1,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  time: {
    fontSize: 12,
    color: colors.textTertiary,
  },
});
