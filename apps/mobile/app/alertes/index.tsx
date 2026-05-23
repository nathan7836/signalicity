import React from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../src/theme/colors";
import { spacing, radius, fontSize } from "../../src/theme/spacing";

const ALERTS = [
  {
    id: "a1", title: "Travaux rue de Paris", body: "Circulation alternee du 20 au 30 mai. Deviation par la rue de Verdun.",
    type: "travaux", severity: "warning", date: "20 mai 2026",
  },
  {
    id: "a2", title: "Alerte meteo orange", body: "Vent violent prevu. Evitez les deplacements inutiles. Eloignez-vous des arbres.",
    type: "intemperie", severity: "critical", date: "20 mai 2026",
  },
  {
    id: "a3", title: "Coupure d'eau le 25 mai", body: "Secteur parc Chanorier de 9h a 14h pour travaux de canalisation.",
    type: "info", severity: "info", date: "25 mai 2026",
  },
];

const TYPE_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  travaux: "construct", intemperie: "thunderstorm", securite: "shield", info: "information-circle",
};
const SEV_COLORS: Record<string, { bg: string; text: string }> = {
  info: { bg: "#EFF6FF", text: "#2563EB" },
  warning: { bg: "#FEF3C7", text: "#D97706" },
  critical: { bg: "#FEE2E2", text: "#DC2626" },
};

export default function AlertesScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Alertes</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {ALERTS.map((alert) => {
          const sev = SEV_COLORS[alert.severity] ?? SEV_COLORS.info;
          const icon = TYPE_ICONS[alert.type] ?? "information-circle";
          return (
            <View key={alert.id} style={[styles.card, { backgroundColor: sev.bg }]}>
              <View style={styles.cardRow}>
                <Ionicons name={icon} size={22} color={sev.text} />
                <View style={styles.cardContent}>
                  <Text style={[styles.cardTitle, { color: sev.text }]}>{alert.title}</Text>
                  <Text style={styles.cardBody}>{alert.body}</Text>
                  <Text style={styles.cardDate}>{alert.date}</Text>
                </View>
              </View>
            </View>
          );
        })}

        {ALERTS.length === 0 && (
          <View style={styles.empty}>
            <Ionicons name="checkmark-circle-outline" size={48} color={colors.gray[300]} />
            <Text style={styles.emptyText}>Aucune alerte en cours</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: fontSize.body, fontWeight: "600", color: colors.text },
  content: { padding: spacing.lg, gap: spacing.sm },
  card: { borderRadius: radius.lg, padding: spacing.md },
  cardRow: { flexDirection: "row", gap: spacing.sm },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: "700", marginBottom: 4 },
  cardBody: { fontSize: 14, color: colors.text, lineHeight: 20, marginBottom: 6 },
  cardDate: { fontSize: 12, color: colors.textTertiary },
  empty: { alignItems: "center", paddingTop: 100, gap: spacing.md },
  emptyText: { fontSize: fontSize.body, color: colors.textTertiary },
});
