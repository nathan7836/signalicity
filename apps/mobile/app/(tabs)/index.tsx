import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { colors } from "../../src/theme/colors";
import { spacing, radius, fontSize } from "../../src/theme/spacing";
import StatusBadge from "../../src/components/StatusBadge";
import type { Signalement } from "@signalicity/shared";

const MOCK_RECENT: Signalement[] = [
  {
    id: "sig-001", created_at: "2026-05-20T08:00:00.000Z", updated_at: "2026-05-20T08:00:00.000Z",
    user_id: null, guest_email: "jean@email.fr", category_id: "c1",
    title: "Nid de poule rue de Paris", description: "Nid de poule dangereux",
    ai_description: null, photo_url: "https://placehold.co/400x300/6366F1/white?text=Voirie",
    photo_after_url: null, latitude: 48.879, longitude: 2.1345,
    address: "15 Rue de Paris", status: "received", severity: "high",
    assigned_service_id: null, assigned_agent_id: null, duplicate_of: null,
    internal_notes: null, resolved_at: null,
  },
  {
    id: "sig-002", created_at: "2026-05-19T10:00:00.000Z", updated_at: "2026-05-19T14:00:00.000Z",
    user_id: null, guest_email: "marie@email.fr", category_id: "c2",
    title: "Poubelle renversee", description: "Avenue de Verdun",
    ai_description: null, photo_url: "https://placehold.co/400x300/F59E0B/white?text=Proprete",
    photo_after_url: null, latitude: 48.8775, longitude: 2.138,
    address: "8 Avenue de Verdun", status: "in_progress", severity: "medium",
    assigned_service_id: null, assigned_agent_id: null, duplicate_of: null,
    internal_notes: null, resolved_at: null,
  },
  {
    id: "sig-003", created_at: "2026-05-15T09:00:00.000Z", updated_at: "2026-05-17T11:00:00.000Z",
    user_id: null, guest_email: "pierre@email.fr", category_id: "c3",
    title: "Lampadaire en panne", description: "Eteint depuis 3 jours",
    ai_description: null, photo_url: "https://placehold.co/400x300/10B981/white?text=Resolu",
    photo_after_url: null, latitude: 48.88, longitude: 2.136,
    address: "22 Rue Jean Jaures", status: "resolved", severity: "medium",
    assigned_service_id: null, assigned_agent_id: null, duplicate_of: null,
    internal_notes: null, resolved_at: "2026-05-17T11:00:00.000Z",
  },
];

const QUICK_LINKS = [
  { href: "/alertes", icon: "warning-outline" as const, color: "#EF4444", bg: "#FEE2E2", label: "Alertes" },
  { href: "/agenda", icon: "calendar-outline" as const, color: "#7C3AED", bg: "#EDE9FE", label: "Agenda" },
  { href: "/annuaire", icon: "business-outline" as const, color: "#F59E0B", bg: "#FEF3C7", label: "Annuaire" },
  { href: "/participatif", icon: "hand-left-outline" as const, color: "#10B981", bg: "#D1FAE5", label: "Voter" },
  { href: "/assistant", icon: "chatbubble-ellipses-outline" as const, color: "#0891B2", bg: "#CFFAFE", label: "Assistant" },
  { href: "/signalement/sig-001", icon: "map-outline" as const, color: "#6366F1", bg: "#E0E7FF", label: "Carte" },
];

export default function HomeScreen() {
  const router = useRouter();

  const handleSignaler = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push("/signaler");
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Welcome */}
      <View style={styles.welcome}>
        <Text style={styles.welcomeTitle}>Bonjour !</Text>
        <Text style={styles.welcomeText}>
          Signalez un probleme dans votre commune en quelques secondes.
        </Text>
      </View>

      {/* CTA Button */}
      <TouchableOpacity
        onPress={handleSignaler}
        activeOpacity={0.85}
        style={styles.ctaButton}
      >
        <View style={styles.ctaIcon}>
          <Ionicons name="camera" size={28} color={colors.white} />
        </View>
        <View style={styles.ctaContent}>
          <Text style={styles.ctaTitle}>Signaler un probleme</Text>
          <Text style={styles.ctaSubtitle}>Photo, localisation, c'est envoye !</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color={colors.white} />
      </TouchableOpacity>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>47</Text>
          <Text style={styles.statLabel}>Signalements</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, { color: colors.status.in_progress }]}>14</Text>
          <Text style={styles.statLabel}>En cours</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, { color: colors.status.resolved }]}>18</Text>
          <Text style={styles.statLabel}>Resolus</Text>
        </View>
      </View>

      {/* Quick links grid */}
      <Text style={styles.sectionTitle}>Services</Text>
      <View style={styles.quickGrid}>
        {QUICK_LINKS.map((link) => (
          <TouchableOpacity
            key={link.href}
            onPress={() => {
              Haptics.selectionAsync();
              router.push(link.href as any);
            }}
            activeOpacity={0.7}
            style={styles.quickItem}
          >
            <View style={[styles.quickIcon, { backgroundColor: link.bg }]}>
              <Ionicons name={link.icon} size={22} color={link.color} />
            </View>
            <Text style={styles.quickLabel}>{link.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Recent */}
      <Text style={styles.sectionTitle}>Signalements recents</Text>
      {MOCK_RECENT.map((s) => (
        <TouchableOpacity
          key={s.id}
          onPress={() => router.push(`/signalement/${s.id}`)}
          activeOpacity={0.7}
          style={styles.recentCard}
        >
          <Image source={{ uri: s.photo_url }} style={styles.recentPhoto} />
          <View style={styles.recentContent}>
            <Text style={styles.recentTitle} numberOfLines={1}>{s.title}</Text>
            <Text style={styles.recentAddress} numberOfLines={1}>{s.address}</Text>
          </View>
          <StatusBadge status={s.status} />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  welcome: { marginBottom: spacing.lg },
  welcomeTitle: { fontSize: fontSize.largeTitle, fontWeight: "700", color: colors.text, marginBottom: spacing.xs },
  welcomeText: { fontSize: fontSize.body, color: colors.textSecondary, lineHeight: 24 },
  ctaButton: {
    backgroundColor: colors.accent, borderRadius: radius.xl, padding: spacing.lg,
    flexDirection: "row", alignItems: "center", gap: spacing.md, marginBottom: spacing.lg,
    shadowColor: colors.accent, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 8,
  },
  ctaIcon: { width: 52, height: 52, borderRadius: radius.lg, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" },
  ctaContent: { flex: 1 },
  ctaTitle: { fontSize: 18, fontWeight: "700", color: colors.white, marginBottom: 2 },
  ctaSubtitle: { fontSize: 14, color: "rgba(255,255,255,0.8)" },
  statsRow: { flexDirection: "row", gap: spacing.sm, marginBottom: spacing.xl },
  statCard: { flex: 1, backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.md, alignItems: "center" },
  statValue: { fontSize: 24, fontWeight: "700", color: colors.text, marginBottom: 2 },
  statLabel: { fontSize: fontSize.caption, color: colors.textTertiary },
  sectionTitle: { fontSize: fontSize.heading, fontWeight: "600", color: colors.text, marginBottom: spacing.md },
  quickGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginBottom: spacing.xl },
  quickItem: { width: "30%", alignItems: "center", backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.md, gap: spacing.sm },
  quickIcon: { width: 44, height: 44, borderRadius: radius.md, alignItems: "center", justifyContent: "center" },
  quickLabel: { fontSize: 12, fontWeight: "600", color: colors.text },
  recentCard: { flexDirection: "row", alignItems: "center", gap: spacing.sm, paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  recentPhoto: { width: 48, height: 48, borderRadius: radius.sm, backgroundColor: colors.gray[100] },
  recentContent: { flex: 1 },
  recentTitle: { fontSize: 15, fontWeight: "600", color: colors.text },
  recentAddress: { fontSize: fontSize.caption, color: colors.textTertiary, marginTop: 2 },
});
