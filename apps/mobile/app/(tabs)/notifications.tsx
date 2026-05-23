import React from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../src/theme/colors";
import { spacing, radius, fontSize } from "../../src/theme/spacing";

interface NotificationItem {
  id: string;
  title: string;
  body: string;
  read: boolean;
  created_at: string;
}

const MOCK_NOTIFS: NotificationItem[] = [
  {
    id: "n1",
    title: "Signalement recu",
    body: "Votre signalement 'Nid de poule rue de Paris' a bien ete enregistre.",
    read: false,
    created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
  {
    id: "n2",
    title: "Pris en charge",
    body: "Votre signalement 'Poubelle renversee' est en cours de traitement.",
    read: false,
    created_at: new Date(Date.now() - 20 * 3600000).toISOString(),
  },
  {
    id: "n3",
    title: "Resolu !",
    body: "Le lampadaire en panne rue Jean Jaures a ete repare. Merci pour votre signalement !",
    read: true,
    created_at: new Date(Date.now() - 3 * 24 * 3600000).toISOString(),
  },
];

function formatNotifDate(date: string): string {
  const d = new Date(date);
  const now = new Date();
  const diffH = Math.floor((now.getTime() - d.getTime()) / 3600000);
  if (diffH < 1) return "A l'instant";
  if (diffH < 24) return `Il y a ${diffH}h`;
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

export default function NotificationsScreen() {
  return (
    <FlatList
      data={MOCK_NOTIFS}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.content}
      renderItem={({ item }) => (
        <TouchableOpacity
          activeOpacity={0.7}
          style={[styles.card, !item.read && styles.unread]}
        >
          <View
            style={[
              styles.iconWrap,
              {
                backgroundColor: item.read
                  ? colors.gray[100]
                  : colors.accentLight,
              },
            ]}
          >
            <Ionicons
              name={
                item.title.includes("Resolu")
                  ? "checkmark-circle"
                  : item.title.includes("charge")
                  ? "arrow-forward-circle"
                  : "document-text"
              }
              size={20}
              color={item.read ? colors.gray[400] : colors.accent}
            />
          </View>
          <View style={styles.textWrap}>
            <Text style={[styles.title, !item.read && styles.titleUnread]}>
              {item.title}
            </Text>
            <Text style={styles.body} numberOfLines={2}>
              {item.body}
            </Text>
            <Text style={styles.time}>{formatNotifDate(item.created_at)}</Text>
          </View>
          {!item.read && <View style={styles.dot} />}
        </TouchableOpacity>
      )}
      ListEmptyComponent={
        <View style={styles.empty}>
          <Ionicons
            name="notifications-off-outline"
            size={48}
            color={colors.gray[300]}
          />
          <Text style={styles.emptyText}>Aucune notification</Text>
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
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.lg,
    marginBottom: spacing.sm,
    backgroundColor: colors.white,
  },
  unread: {
    backgroundColor: colors.surface,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  textWrap: { flex: 1 },
  title: {
    fontSize: 15,
    fontWeight: "500",
    color: colors.text,
    marginBottom: 2,
  },
  titleUnread: { fontWeight: "700" },
  body: {
    fontSize: fontSize.caption,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 4,
  },
  time: {
    fontSize: 11,
    color: colors.textTertiary,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent,
    marginTop: 6,
  },
  empty: {
    alignItems: "center",
    paddingTop: 100,
    gap: spacing.md,
  },
  emptyText: {
    fontSize: fontSize.body,
    color: colors.textTertiary,
  },
});
