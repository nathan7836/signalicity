import React from "react";
import { View, Text, FlatList, StyleSheet, RefreshControl } from "react-native";
import SignalementCard from "../../src/components/SignalementCard";
import { colors } from "../../src/theme/colors";
import { spacing, fontSize } from "../../src/theme/spacing";
import { Ionicons } from "@expo/vector-icons";
import type { Signalement } from "@signalicity/shared";

const MOCK_MY: Signalement[] = [
  {
    id: "sig-001",
    created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 3600000).toISOString(),
    user_id: "me",
    guest_email: null,
    category_id: "c1",
    title: "Nid de poule rue de Paris",
    description: "Important nid de poule dangereux pour les velos.",
    ai_description: "Degradation de chaussee detectee.",
    photo_url: "https://placehold.co/800x600/6366F1/white?text=Voirie",
    photo_after_url: null,
    latitude: 48.879,
    longitude: 2.1345,
    address: "15 Rue de Paris, 78290 Croissy-sur-Seine",
    status: "received",
    severity: "high",
    assigned_service_id: null,
    assigned_agent_id: null,
    duplicate_of: null,
    internal_notes: null,
    resolved_at: null,
  },
  {
    id: "sig-003",
    created_at: new Date(Date.now() - 5 * 24 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 24 * 3600000).toISOString(),
    user_id: "me",
    guest_email: null,
    category_id: "c3",
    title: "Lampadaire en panne rue Jean Jaures",
    description: "Lampadaire eteint depuis plusieurs jours.",
    ai_description: "Eclairage public defaillant.",
    photo_url: "https://placehold.co/800x600/FBBF24/white?text=Eclairage",
    photo_after_url: "https://placehold.co/800x600/10B981/white?text=Repare",
    latitude: 48.88,
    longitude: 2.136,
    address: "22 Rue Jean Jaures, 78290 Croissy-sur-Seine",
    status: "resolved",
    severity: "medium",
    assigned_service_id: null,
    assigned_agent_id: null,
    duplicate_of: null,
    internal_notes: null,
    resolved_at: new Date(Date.now() - 3 * 24 * 3600000).toISOString(),
  },
];

export default function MesSignalementsScreen() {
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <FlatList
      data={MOCK_MY}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <SignalementCard signalement={item} />}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.accent}
        />
      }
      ListEmptyComponent={
        <View style={styles.empty}>
          <Ionicons name="clipboard-outline" size={48} color={colors.gray[300]} />
          <Text style={styles.emptyTitle}>Aucun signalement</Text>
          <Text style={styles.emptyText}>
            Vos signalements apparaitront ici.
          </Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 100,
    gap: spacing.sm,
  },
  emptyTitle: {
    fontSize: fontSize.heading,
    fontWeight: "600",
    color: colors.text,
    marginTop: spacing.md,
  },
  emptyText: {
    fontSize: fontSize.body,
    color: colors.textTertiary,
  },
});
