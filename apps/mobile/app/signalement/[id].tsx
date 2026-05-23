import React from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import StatusBadge from "../../src/components/StatusBadge";
import { colors } from "../../src/theme/colors";
import { spacing, radius, fontSize } from "../../src/theme/spacing";
import { STATUS_LABELS, STATUS_COLORS } from "@signalicity/shared";
import type { SignalementStatus } from "@signalicity/shared";

const MOCK_DETAIL = {
  id: "sig-001",
  title: "Nid de poule rue de Paris",
  description: "Important nid de poule sur la chaussee, dangereux pour les velos.",
  ai_description: "Degradation de chaussee : nid de poule de taille moyenne.",
  photo_url: "https://placehold.co/800x600/6366F1/white?text=Voirie",
  address: "15 Rue de Paris, 78290 Croissy-sur-Seine",
  status: "received" as SignalementStatus,
  severity: "high",
  category: "Voirie",
  categoryColor: "#6366F1",
  created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
  timeline: [
    {
      status: "received",
      date: new Date(Date.now() - 2 * 3600000).toISOString(),
      note: "Signalement recu et enregistre",
    },
  ],
};

export default function SignalementDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const detail = MOCK_DETAIL;

  const formatDate = (d: string) =>
    new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(d));

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detail</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Photo */}
        <Image source={{ uri: detail.photo_url }} style={styles.photo} />

        {/* Info */}
        <View style={styles.infoSection}>
          <Text style={styles.title}>{detail.title}</Text>
          <View style={styles.badges}>
            <StatusBadge status={detail.status} />
            <View
              style={[
                styles.catBadge,
                { backgroundColor: `${detail.categoryColor}15` },
              ]}
            >
              <Text
                style={[styles.catBadgeText, { color: detail.categoryColor }]}
              >
                {detail.category}
              </Text>
            </View>
          </View>
        </View>

        {/* Address */}
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <Ionicons name="location" size={18} color={colors.accent} />
            <Text style={styles.cardText}>{detail.address}</Text>
          </View>
          <View style={styles.mapPlaceholder}>
            <Ionicons name="map-outline" size={24} color={colors.gray[300]} />
            <Text style={styles.mapText}>Carte</Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Description</Text>
          <Text style={styles.description}>{detail.description}</Text>
          {detail.ai_description && (
            <View style={styles.aiBox}>
              <View style={styles.aiHeader}>
                <Ionicons name="sparkles" size={14} color={colors.accent} />
                <Text style={styles.aiLabel}>Analyse IA</Text>
              </View>
              <Text style={styles.aiText}>{detail.ai_description}</Text>
            </View>
          )}
        </View>

        {/* Timeline */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Suivi</Text>
          {detail.timeline.map((entry, i) => {
            const statusColor =
              STATUS_COLORS[entry.status] ?? colors.gray[400];
            return (
              <View key={i} style={styles.timelineItem}>
                <View
                  style={[styles.timelineDot, { backgroundColor: statusColor }]}
                />
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineStatus}>
                    {STATUS_LABELS[entry.status] ?? entry.status}
                  </Text>
                  <Text style={styles.timelineNote}>{entry.note}</Text>
                  <Text style={styles.timelineDate}>
                    {formatDate(entry.date)}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Reference */}
        <Text style={styles.ref}>Ref: {id}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: fontSize.body,
    fontWeight: "600",
    color: colors.text,
  },

  content: {
    paddingBottom: spacing.xxl,
  },

  photo: {
    width: "100%",
    height: 260,
    backgroundColor: colors.gray[100],
  },

  infoSection: {
    padding: spacing.lg,
  },
  title: {
    fontSize: fontSize.heading,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.sm,
  },
  badges: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  catBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  catBadgeText: {
    fontSize: 12,
    fontWeight: "600",
  },

  card: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  cardText: {
    fontSize: 15,
    color: colors.text,
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.sm,
  },

  mapPlaceholder: {
    height: 120,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  mapText: {
    fontSize: fontSize.caption,
    color: colors.textTertiary,
  },

  description: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: spacing.sm,
  },

  aiBox: {
    backgroundColor: colors.accentLight,
    borderRadius: radius.md,
    padding: spacing.sm,
  },
  aiHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 4,
  },
  aiLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.accent,
  },
  aiText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },

  timelineItem: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 4,
  },
  timelineContent: { flex: 1 },
  timelineStatus: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
  },
  timelineNote: {
    fontSize: fontSize.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  timelineDate: {
    fontSize: 11,
    color: colors.textTertiary,
    marginTop: 4,
  },

  ref: {
    fontSize: 11,
    color: colors.textTertiary,
    textAlign: "center",
    marginTop: spacing.lg,
    fontFamily: "monospace",
  },
});
